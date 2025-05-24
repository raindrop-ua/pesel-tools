import { Component, Input } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'svg[icon]',
  imports: [],
  template: '<svg:use [attr.href]="href"></svg:use>',
})
export class SvgIconComponent {
  @Input() icon = '';

  get href() {
    return `/assets/svg/${this.icon}.svg#${this.icon}`;
  }
}
