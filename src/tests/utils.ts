export function callNgOnDestroy(component: any): void {
  // The TS compiler will whine that this property doesn't on the component itself,
  // but this method will be added by our decorator.
  component.ngOnDestroy();
}
