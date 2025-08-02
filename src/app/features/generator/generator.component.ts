import { Component } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SectionComponent } from '@core/layout/section/section.component';
import {SimpleGeneratorComponent} from '@features/generator/components/simple-generator/simple-generator.component';
import {
  AdvancedGeneratorComponent
} from '@features/generator/components/advanced-generator/advanced-generator.component';

@Component({
  selector: 'app-generator',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SectionComponent,
    SimpleGeneratorComponent,
    AdvancedGeneratorComponent,
  ],
  templateUrl: './generator.component.html',
  styleUrl: './generator.component.scss',
})
export class GeneratorComponent {

}
