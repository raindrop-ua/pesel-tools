import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppRouteEnum } from '@core/enums/app-route.enum';

@Component({
  selector: 'app-masthead',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './masthead.component.html',
  host: { class: 'mt-4 mb-8 block md:mt-10' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MastheadComponent {
  protected readonly AppRouteEnum = AppRouteEnum;
}
