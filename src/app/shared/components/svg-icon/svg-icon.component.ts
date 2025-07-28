import { Component, input } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'svg[icon]',
  imports: [],
  template: '<svg:use [attr.href]="href"></svg:use>',
})
export class SvgIconComponent {
  icon = input.required();
  sprite = input('icons');

  get href() {
    return `/assets/svg/${this.sprite()}.svg#${this.icon()}`;
  }
}
