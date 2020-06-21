const hasUntilDestroy = /import\s*{\s*[^}]*untilDestroyed[^}]*}\s*from\s*(["'])ngx-take-until-destroy\1(?=[^]*untilDestroyed\(\w*\)[^]*)/;

const glob = require('glob');
const fs = require('fs');
const { Project } = require('ts-morph');

const base = `app`;

glob(`${base}/**/*.ts`, {}, function(_, files) {
  const removeOnDestroy = process.argv.includes('--removeOnDestroy');

  files.forEach(path => {
    fs.readFile(path, 'utf8', function(_, text) {
      if (!hasUntilDestroy.test(text)) return;

      const result = transformCode(text, { removeOnDestroy });

      fs.writeFile(path, result, 'utf8', function(err) {
        if (err) return console.log(err);
        console.log(`Replaced ${path}`);
      });
    });
  });
});

function transformCode(str, { removeOnDestroy = false } = {}) {
  const sourceFile = new Project().createSourceFile(`code.ts`, str);
  replaceOldImport(sourceFile);

  const classes = sourceFile.getClasses() || [];
  classes.forEach(clazz => {
    addUntilDestroyDecorator(clazz);

    if (removeOnDestroy) {
      const ngOnDestroyMember = clazz.getMember('ngOnDestroy');
      const isNgOnDestroyEmpty = Boolean(
        ngOnDestroyMember && ngOnDestroyMember.getDescendantStatements().length
      );
      if (isNgOnDestroyEmpty) return;
      ngOnDestroyMember.remove();

      removeOnDestroyImplements(clazz);
      removeOnDestroyImport(sourceFile);
    }
  });

  return sourceFile.getFullText();
}

function replaceOldImport(sourceFile) {
  const oldImport = sourceFile.getImportDeclaration('ngx-take-until-destroy');
  oldImport &&
    oldImport.replaceWithText(
      `import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';`
    );
}

function addUntilDestroyDecorator(classDeclaration) {
  const decorators = [
    { name: 'UntilDestroy', arguments: [] },
    ...classDeclaration.getStructure().decorators
  ];
  classDeclaration.getDecorators().forEach(d => d.remove());
  classDeclaration.addDecorators(decorators);
}

function removeOnDestroyImplements(classDeclaration) {
  const onDestroyImpl = classDeclaration
    .getImplements()
    .find(impl => impl.getText() === 'OnDestroy');
  classDeclaration.removeImplements(onDestroyImpl);
}

function removeOnDestroyImport(sourceFile) {
  const importDeclaration = sourceFile.getImportDeclaration('@angular/core');

  importDeclaration
    .getImportClause()
    .getNamedImports()
    .find(node => node.getText() === 'OnDestroy')
    .remove();

  if (!importDeclaration.getImportClause()) {
    importDeclaration.remove();
  }
}

module.exports.transformCode = transformCode;
