import { Component, OnInit } from '@angular/core';
import { SectionComponent } from '../../core/layout/section/section.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { DisclaimerComponent } from '../../shared/components/disclaimer/disclaimer.component';
import { SeoService } from '../../services/seo.service';
import { MastheadComponent } from './components/masthead/masthead.component';

@Component({
  selector: 'app-home',
  imports: [
    SectionComponent,
    CardComponent,
    DisclaimerComponent,
    MastheadComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    this.seo.updateTitle('Home | Ultimate PESEL Tools');
    this.seo.updateDescription('Ultimate PESEL Tools');
    this.seo.updateKeywords('pesel generator');
  }
}
