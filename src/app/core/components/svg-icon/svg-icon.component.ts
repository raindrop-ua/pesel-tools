import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'svg[icon]',
  imports: [],
  template: '<svg:use [attr.href]="href"></svg:use>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgIconComponent {
  public icon = input.required();
  public sprite = input('icons');

  get href() {
    return `/assets/svg/${this.sprite()}.svg#${this.icon()}`;
  }
}
