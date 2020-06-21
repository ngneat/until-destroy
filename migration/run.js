const hasUntilDestroy = /import\s*{\s*[^}]*untilDestroyed[^}]*}\s*from\s*(["'])ngx-take-until-destroy\1(?=[^]*untilDestroyed\(\w*\)[^]*)/;

const glob = require('glob');
const fs = require('fs');
const { Project, QuoteKind } = require('ts-morph');

const base = `app`;

const project = new Project({
  useInMemoryFileSystem: true,
  manipulationSettings: {
    quoteKind: QuoteKind.Single
  }
});

glob(`${base}/**/*.ts`, {}, function(_, files) {
  const removeOnDestroy = process.argv.includes('--removeOnDestroy');

  files.forEach(path => {
    fs.readFile(path, 'utf8', function(_, text) {
      if (!hasUntilDestroy.test(text)) return;

      const result = transformCode(text, path, removeOnDestroy);

      fs.writeFile(path, result, 'utf8', function(err) {
        if (err) return console.log(err);
        console.log(`Replaced ${path}`);
      });
    });
  });
});

/**
 * @param {string} code
 * @param {string} filePath
 * @param {boolean} removeOnDestroy
 */
function transformCode(code, filePath, removeOnDestroy = false) {
  const sourceFile = project.createSourceFile(filePath, code, { overwrite: true });
  replaceOldImport(sourceFile);

  sourceFile.getClasses().forEach(classDeclaration => {
    addUntilDestroyDecorator(classDeclaration);

    if (removeOnDestroy) {
      const ngOnDestroyDeclaration = classDeclaration.getMember('ngOnDestroy');
      const ngOnDestroyIsNotEmpty = Boolean(
        ngOnDestroyDeclaration && ngOnDestroyDeclaration.getDescendantStatements().length
      );
      if (ngOnDestroyIsNotEmpty) return;
      ngOnDestroyDeclaration.remove();

      removeOnDestroyImplements(classDeclaration);
      removeOnDestroyImport(sourceFile);
    }
  });

  return sourceFile.getFullText();
}

/**
 * @param {import('ts-morph').SourceFile} sourceFile
 */
function replaceOldImport(sourceFile) {
  const oldImport = sourceFile.getImportDeclaration('ngx-take-until-destroy');
  oldImport &&
    oldImport.replaceWithText(
      `import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';`
    );
}

/**
 * @param {import('ts-morph').ClassDeclaration} classDeclaration
 */
function addUntilDestroyDecorator(classDeclaration) {
  const decorators = [
    { name: 'UntilDestroy', arguments: [] },
    ...classDeclaration.getStructure().decorators
  ];
  classDeclaration.getDecorators().forEach(d => d.remove());
  classDeclaration.addDecorators(decorators);
}

/**
 * @param {import('ts-morph').ClassDeclaration} classDeclaration
 */
function removeOnDestroyImplements(classDeclaration) {
  const onDestroyImplementClause = classDeclaration
    .getImplements()
    .find(impl => impl.getText() === 'OnDestroy');
  onDestroyImplementClause && classDeclaration.removeImplements(onDestroyImplementClause);
}

/**
 * @param {import('ts-morph').SourceFile} sourceFile
 */
function removeOnDestroyImport(sourceFile) {
  const importDeclaration = sourceFile.getImportDeclaration('@angular/core');

  if (!importDeclaration) return;

  const namedImports = importDeclaration.getImportClause().getNamedImports();
  const onDestroyImportSpecifier = namedImports.find(node => node.getText() === 'OnDestroy');

  if (!onDestroyImportSpecifier) return;

  onDestroyImportSpecifier.remove();

  if (!importDeclaration.getImportClause()) {
    importDeclaration.remove();
  }
}

module.exports.transformCode = transformCode;
