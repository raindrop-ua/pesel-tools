import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: 'a[appExternalLink]'
})
export class ExternalLinkDirective {
  @HostBinding('attr.target') target = '_blank';
  @HostBinding('attr.rel') rel = 'noopener noreferrer';
}
