import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SectionComponent } from '@core/layout/section/section.component';
import { SimpleGeneratorComponent } from '@features/generator/components/simple-generator/simple-generator.component';

@Component({
  selector: 'app-generator',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SectionComponent,
    SimpleGeneratorComponent,
  ],
  templateUrl: './generator.component.html',
  styleUrl: './generator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneratorComponent {}
