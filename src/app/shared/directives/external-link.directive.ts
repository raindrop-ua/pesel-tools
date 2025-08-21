import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: 'a[appExternalLink]',
})
export class ExternalLinkDirective {
  @HostBinding('attr.target') target = '_blank';
  @HostBinding('attr.rel') rel = 'noopener noreferrer';
  @HostBinding('attr.aria-label') ariaLabel = 'Opens in a new tab';
  @HostBinding('attr.title') title = 'Opens in a new tab';
  @HostBinding('class.link-external') externalLink = true;
}
