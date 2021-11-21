#!/usr/bin/env node

import * as fs from 'fs';
import * as minimist from 'minimist';
import { ClassDeclaration, Project, QuoteKind, SourceFile } from 'ts-morph';

const glob = require('glob');

const { base = 'src/app', removeOnDestroy } = minimist(process.argv.slice(2));

const hasUntilDestroy =
  /import\s*{\s*[^}]*untilDestroyed[^}]*}\s*from\s*(["'])ngx-take-until-destroy\1(?=[^]*untilDestroyed\(\w*\)[^]*)/;

const project = new Project({
  useInMemoryFileSystem: true,
  manipulationSettings: {
    quoteKind: QuoteKind.Single,
  },
});

glob(`${base}/**/*.ts`, {}, (_: NodeJS.ErrnoException, files: string[]) => {
  files.forEach(path => {
    fs.readFile(path, 'utf8', (_, text) => {
      if (!hasUntilDestroy.test(text)) return;

      const result = transformCode(text, path, removeOnDestroy);

      fs.writeFile(path, result, 'utf8', (error: NodeJS.ErrnoException | null) => {
        if (error) {
          console.error(error);
        } else {
          console.log(`Replaced ${path}`);
        }
      });
    });
  });
});

export function transformCode(code: string, filePath: string, removeOnDestroy = false) {
  const sourceFile = project.createSourceFile(filePath, code, { overwrite: true });
  replaceOldImport(sourceFile);

  sourceFile.getClasses().forEach(classDeclaration => {
    addUntilDestroyDecorator(classDeclaration);

    if (removeOnDestroy) {
      const ngOnDestroyDeclaration = classDeclaration.getMember('ngOnDestroy');
      if (!ngOnDestroyDeclaration) return;

      const ngOnDestroyIsNotEmpty = Boolean(
        ngOnDestroyDeclaration.getDescendantStatements().length
      );
      if (ngOnDestroyIsNotEmpty) return;

      ngOnDestroyDeclaration.remove();

      removeOnDestroyImplements(classDeclaration);
      removeOnDestroyImport(sourceFile);
    }
  });

  return sourceFile.getFullText();
}

function replaceOldImport(sourceFile: SourceFile) {
  const oldImport = sourceFile.getImportDeclaration('ngx-take-until-destroy');
  oldImport &&
    oldImport.replaceWithText(
      `import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';`
    );
}

function addUntilDestroyDecorator(classDeclaration: ClassDeclaration) {
  classDeclaration.insertDecorator(0, { name: 'UntilDestroy', arguments: [] });
}

function removeOnDestroyImplements(classDeclaration: ClassDeclaration) {
  const onDestroyImplementClause = classDeclaration
    .getImplements()
    .find(impl => impl.getText() === 'OnDestroy');
  onDestroyImplementClause && classDeclaration.removeImplements(onDestroyImplementClause);
}

function removeOnDestroyImport(sourceFile: SourceFile) {
  const importDeclaration = sourceFile.getImportDeclaration('@angular/core');
  if (!importDeclaration) return;

  const importClause = importDeclaration.getImportClause();
  if (!importClause) return;

  const onDestroyImportSpecifier = importClause
    .getNamedImports()
    .find(node => node.getText() === 'OnDestroy');
  if (!onDestroyImportSpecifier) return;

  onDestroyImportSpecifier.remove();

  // The existence of the `importClause` is checked twice because the `importDeclaration` mutates after `OnDestroy` is removed.
  if (!importDeclaration.getImportClause()) {
    importDeclaration.remove();
  }
}
