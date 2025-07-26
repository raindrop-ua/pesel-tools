import { Component } from '@angular/core';
import {ButtonComponent} from "../../shared/components/button/button.component";
import {CardComponent} from "../../shared/components/card/card.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PeselInputComponent} from "../../shared/components/pesel-input/pesel-input.component";
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
