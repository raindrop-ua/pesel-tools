import { Component } from '@angular/core';
import {CardComponent} from "../../shared/components/card/card.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PeselOutputComponent} from "../../shared/components/pesel-output/pesel-output.component";
import {SectionComponent} from "../../core/layout/section/section.component";

@Component({
  selector: 'app-generator',
    imports: [
        CardComponent,
        FormsModule,
        PeselOutputComponent,
        ReactiveFormsModule,
        SectionComponent
    ],
  templateUrl: './generator.component.html',
  styleUrl: './generator.component.scss'
})
export class GeneratorComponent {

}
