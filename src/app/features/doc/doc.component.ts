import { Component, OnInit } from '@angular/core';
import { SectionComponent } from '../../core/layout/section/section.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-doc',
  imports: [SectionComponent, CardComponent],
  templateUrl: './doc.component.html',
  styleUrl: './doc.component.scss',
})
export class DocComponent implements OnInit {
  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    this.seo.updateTitle('Docs | Ultimate PESEL Tools');
    this.seo.updateDescription('Ultimate PESEL Tools');
    this.seo.updateKeywords('pesel generator');
  }
}
