import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SectionComponent } from '@core/layout/section/section.component';
import { SimpleGeneratorComponent } from '@features/generator/components/simple-generator/simple-generator.component';
import {CardComponent} from '@components/card/card.component';
import {ApiInstructionComponent} from '@features/generator/components/api-instruction/api-instruction.component';

@Component({
  selector: 'app-generator',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SectionComponent,
    SimpleGeneratorComponent,
    CardComponent,
    ApiInstructionComponent,
  ],
  templateUrl: './generator.component.html',
  styleUrl: './generator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneratorComponent {}
