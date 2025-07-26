import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { SectionComponent } from '../../core/layout/section/section.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { PeselInputComponent } from '../../shared/components/pesel-input/pesel-input.component';
import { PeselOutputComponent } from '../../shared/components/pesel-output/pesel-output.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

import { peselValidatorFactory } from '../../shared/validators/pesel-validator.factory';
import { PeselParserService } from '../../services/pesel-parser.service';

@Component({
  selector: 'app-parser',
  imports: [
    CardComponent,
    FormsModule,
    PeselInputComponent,
    PeselOutputComponent,
    ReactiveFormsModule,
    SectionComponent,
    ButtonComponent
  ],
  templateUrl: './parser.component.html',
  styleUrl: './parser.component.scss'
})
export class ParserComponent implements OnInit {
  form!: FormGroup;
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private peselParser = inject(PeselParserService);

  ngOnInit(): void {
    this.form = this.fb.group({
      pesel: ['', [Validators.required, peselValidatorFactory(this.peselParser)]]
    });

    this.route.queryParamMap.subscribe((params) => {
      const peselFromUrl = params.get('pesel');
      if (peselFromUrl) {
        this.form.patchValue({ pesel: peselFromUrl });
      }
    });
  }

  get peselControl() {
    return this.form.get('pesel');
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('PESEL is valid:', this.form.value.pesel);
    } else {
      console.log('Validation error:', this.form.errors);
    }
  }
}
