import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SectionComponent } from '../../../layout/section/section.component';
import { SimpleGeneratorComponent } from '@features/generator/ui/simple-generator/simple-generator.component';

@Component({
  selector: 'app-generator',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SectionComponent,
    SimpleGeneratorComponent,
  ],
  templateUrl: './generator.component.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneratorComponent {}
