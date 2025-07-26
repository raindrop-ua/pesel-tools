import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import {SectionComponent} from '../../core/layout/section/section.component';
import {CardComponent} from '../../shared/components/card/card.component';
import {DisclaimerComponent} from '../../shared/components/disclaimer/disclaimer.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ButtonComponent, SectionComponent, CardComponent, DisclaimerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
