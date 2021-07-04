import * as fs from 'fs';

import { transformCode } from '../src';

jest.mock('glob');

describe('Migration script', () => {
  const code = fs.readFileSync(`${__dirname}/fixtures/several-imports.component.ts`, {
    encoding: 'utf-8',
  });

  it('should replace "ngx-take-until-destroy" import with "@ngneat/until-destroy"', () => {
    const result = transformCode(code, 'several-imports.component.ts');
    expect(result).toContain(
      `import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';`
    );
    expect(result).not.toContain(`import { untilDestroyed } from 'ngx-take-until-destroy';`);
  });

  it('should add @UntilDestroy decorator', () => {
    const result = transformCode(code, 'several-imports.component.ts');
    expect(result).toContain('@UntilDestroy()');
  });

  it('should add @UntilDestroy decorator before others', () => {
    const result = transformCode(code, 'several-imports.component.ts');
    expect(result).toContain(`@UntilDestroy()\n@Component({ template: '' })`);
  });

  it('should skip OnDestroy removing', () => {
    const result = transformCode(code, 'several-imports.component.ts');
    expect(result).toContain('ngOnDestroy()');
  });

  describe('Component with several "@angular/core" imports', () => {
    const code = fs.readFileSync(`${__dirname}/fixtures/several-imports.component.ts`, {
      encoding: 'utf-8',
    });

    it('should remove empty OnDestroy method', () => {
      const result = transformCode(code, 'several-imports.component.ts', true);
      expect(result).not.toContain('ngOnDestroy()');
    });

    it('should remove OnDestroy from implements', () => {
      const result = transformCode(code, 'several-imports.component.ts', true);
      expect(result).toContain(
        `export class SeveralImportsComponent extends BaseComponent implements OnChanges {`
      );
    });

    it('should remove OnDestroy import', () => {
      const result = transformCode(code, 'several-imports.component.ts', true);
      expect(result).toContain(`import { OnChanges, Component } from '@angular/core';`);
    });
  });

  describe('Component with single OnDestroy import from "@angular/core"', () => {
    const code = fs.readFileSync(`${__dirname}/fixtures/single-import.component.ts`, {
      encoding: 'utf-8',
    });

    it('should remove empty OnDestroy method', () => {
      const result = transformCode(code, 'single-import.component.ts', true);
      expect(result).not.toContain('ngOnDestroy()');
    });

    it('should place @UntilDestroy decorator to a new line after the comment', () => {
      const result = transformCode(code, 'single-import.component.ts', true);
      expect(result).toContain(`// test comment\n@UntilDestroy()`);
    });

    it('should remove class implements', () => {
      const result = transformCode(code, 'single-import.component.ts', true);
      expect(result).toContain(`export class SingleImportComponent extends BaseComponent {`);
    });

    it('should remove OnDestroy import', () => {
      const result = transformCode(code, 'single-import.component.ts', true);
      expect(result).not.toContain(`'@angular/core'`);
    });
  });

  describe('Service with filled OnDestroy method', () => {
    const code = fs.readFileSync(`${__dirname}/fixtures/filled-onDestroy.service.ts`, {
      encoding: 'utf-8',
    });

    it('should replace "ngx-take-until-destroy" import with "@ngneat/until-destroy"', () => {
      const result = transformCode(code, 'filled-onDestroy.service.ts', true);
      expect(result).toContain(
        `import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';`
      );
      expect(result).not.toContain(`import { untilDestroyed } from 'ngx-take-until-destroy';`);
    });

    it('should add @UntilDestroy decorator', () => {
      const result = transformCode(code, 'filled-onDestroy.service.ts', true);
      expect(result).toContain('@UntilDestroy()');
    });

    it('should preserve OnDestroy method', () => {
      const result = transformCode(code, 'filled-onDestroy.service.ts', true);
      expect(result).toContain('ngOnDestroy()');
    });

    it('should preserve OnDestroy import', () => {
      const result = transformCode(code, 'filled-onDestroy.service.ts', true);
      expect(result).toContain(`import { OnDestroy } from '@angular/core';`);
    });

    it('should preserve OnDestroy implements', () => {
      const result = transformCode(code, 'filled-onDestroy.service.ts', true);
      expect(result).toContain(`export class FilledOnDestroyService implements OnDestroy {`);
    });
  });
});
