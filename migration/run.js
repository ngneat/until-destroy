const hasUntilDestroy = /import\s*{\s*[^}]*untilDestroyed[^}]*}\s*from\s*("|')ngx-take-until-destroy\1(?=[^]*untilDestroyed\(\w*\)[^]*)/;
const catchImport = /import\s*{\s*[^}]*untilDestroyed[^}]*}\s*from\s*("|')ngx-take-until-destroy['|"];/;

const glob = require('glob');
const fs = require('fs');

const base = `src/app`;

glob(`${base}/**/*.ts`, {}, function(er, files) {
  files.forEach(path => {
    fs.readFile(path, 'utf8', function(err, text) {
      if (hasUntilDestroy.test(text)) {
        console.log(`Replaced ${path}`);
        const result = text
          .replace(
            /((?:@\w*\([^]*\)[\n\s\r\t]*)(?=([\n\s\r\t]*export[\s\r\t]*class))\2)/,
            '@UntilDestroy()\n$1'
          )
          .replace(
            catchImport,
            `import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';`
          );
        fs.writeFile(path, result, 'utf8', function(err) {
          if (err) return console.log(err);
        });
      }
    });
  });
});
