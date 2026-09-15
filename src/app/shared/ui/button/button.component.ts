import {
  Component,
  Input,
  HostBinding,
  ChangeDetectionStrategy,
} from '@angular/core';

type ButtonType = 'primary' | 'secondary' | 'danger';

@Component({
  // Using an attribute selector on native elements to create
  // a universal button/link component.
  // This preserves native button/anchor behavior and supports routerLink.
  // Disabling eslint rule as this specific selector pattern is intentional.
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[app-button], a[app-button]',
  imports: [],
  templateUrl: './button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input('app-button') appButton: ButtonType = 'primary';

  @HostBinding('class') get hostClasses(): string {
    const variants: Record<ButtonType, string> = {
      primary:
        'bg-button-primary-background text-button-primary-text [&:not([disabled])]:hover:bg-button-primary-hover-background',
      secondary:
        'bg-button-secondary-background text-button-secondary-text [&:not([disabled])]:hover:bg-button-secondary-hover-background',
      danger:
        'bg-button-danger-background text-button-danger-text [&:not([disabled])]:hover:bg-button-danger-hover-background',
    };
    return `inline-flex min-h-12 cursor-pointer items-center justify-center rounded-xl border-0 px-5 py-3 text-center text-sm font-bold no-underline transition-colors duration-200 disabled:cursor-default disabled:opacity-50 motion-reduce:transition-none ${variants[this.appButton]}`;
  }
}
