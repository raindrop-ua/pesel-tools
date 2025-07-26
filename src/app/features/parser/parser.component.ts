import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { SectionComponent } from '../../core/layout/section/section.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { PeselInputComponent } from '../../shared/components/pesel-input/pesel-input.component';
import { ResultOutputComponent } from '../../shared/components/result-output/result-output.component';
import { DisclaimerComponent } from '../../shared/components/disclaimer/disclaimer.component';

import { peselValidatorFactory } from '../../shared/validators/pesel-validator.factory';
import {
  PeselInfo,
  PeselParserService,
} from '../../services/pesel-parser.service';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-parser',
  imports: [
    CardComponent,
    FormsModule,
    PeselInputComponent,
    ReactiveFormsModule,
    SectionComponent,
    ResultOutputComponent,
    DisclaimerComponent,
  ],
  templateUrl: './parser.component.html',
  styleUrl: './parser.component.scss',
})
export class ParserComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private peselParser = inject(PeselParserService);
  private seo = inject(SeoService);

  form = this.fb.group({
    pesel: ['', [Validators.required, peselValidatorFactory(this.peselParser)]],
  });

  parsedData = signal<Omit<PeselInfo, 'message'> | null>(null);

  get peselControl() {
    return this.form.get('pesel');
  }

  ngOnInit(): void {
    this.seo.updateTitle('Parser | Ultimate PESEL Tools');
    this.seo.updateDescription('Ultimate PESEL Tools');
    this.seo.updateKeywords('pesel generator');

    this.route.queryParamMap.subscribe((params) => {
      const pesel = params.get('pesel');
      if (pesel) {
        this.form.patchValue({ pesel });

        if (pesel && this.form.get('pesel')?.valid) {
          this.parsedData.set(this.peselParser.parsePesel(pesel));
        }
      }
    });

    this.peselControl?.valueChanges.subscribe((value) => {
      if (this.peselControl?.valid && value) {
        this.parsedData.set(this.peselParser.parsePesel(value));
      } else {
        this.parsedData.set(null);
      }
    });
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text')?.trim() ?? '';
    if (/^\d{11}$/.test(pasted)) {
      this.form.patchValue({ pesel: pasted });
    }
  }
}
