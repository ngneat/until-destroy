const hasUntilDestroy = /import\s*{\s*[^}]*untilDestroyed[^}]*}\s*from\s*("|')ngx-take-until-destroy\1(?=[^]*untilDestroyed\(\w*\)[^]*)/;
const catchImport = /import\s*{\s*[^}]*untilDestroyed[^}]*}\s*from\s*("|')ngx-take-until-destroy['|"];/;
const catchOnDestroy = /\s*(public\s+)?ngOnDestroy\s*[(]\s*[)](\s*:\s*void)?\s*[{]\s*[}]/;

const glob = require('glob');
const fs = require('fs');

const base = `app`;

let removeOnDestroy = false;

glob(`${base}/**/*.ts`, {}, function(_, files) {
  if (process.argv.includes('--removeOnDestroy')) removeOnDestroy = true;

  files.forEach(path => {
    fs.readFile(path, 'utf8', function(_, text) {
      if (hasUntilDestroy.test(text)) {
        console.log(`Replaced ${path}`);
        let result = text
          .replace(
            /((?:@\w*\([^]*\)[\n\s\r\t]*)(?=([\n\s\r\t]*export[\s\r\t]*class))\2)/,
            '@UntilDestroy()\n$1'
          )
          .replace(
            catchImport,
            `import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';`
          );

        if (removeOnDestroy) result = cutOnDestroyHook(result);
        fs.writeFile(path, result, 'utf8', function(err) {
          if (err) return console.log(err);
        });
      }
    });
  });
});

function cutOnDestroyHook(text) {
  let result = text.replace(catchOnDestroy, '');

  if (/ngOnDestroy\s*\(\s*\)/.test(result)) return result;

  result = cutOnDestroyEntries(/\s*implements\s+([a-zA-Z,\s]*)\s*/, result, {
    restReplacer: str => ` implements ${str} `,
    emptyReplacer: ' '
  });
  result = cutOnDestroyEntries(/import\s*{(.*)}\s*from\s*["']@angular\/core["'];\s*/, result, {
    restReplacer: str => `import { ${str} } from '@angular/core';\n`,
    emptyReplacer: ''
  });

  return result;
}

function cutOnDestroyEntries(regex, code, { restReplacer, emptyReplacer }) {
  const [, target] = regex.exec(code) || [];
  if (!target) return code;

  const list = target
    .trim()
    .split(/\s*[,]\s*/)
    .filter(i => i != 'OnDestroy');
  return code.replace(regex, list.length ? restReplacer(list.join(', ')) : emptyReplacer);
}
