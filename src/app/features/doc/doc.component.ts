import { Component } from '@angular/core';
import {ButtonComponent} from "../../shared/components/button/button.component";
import {RouterLink} from "@angular/router";
import {SectionComponent} from "../../core/layout/section/section.component";

@Component({
  selector: 'app-doc',
    imports: [
        ButtonComponent,
        RouterLink,
        SectionComponent
    ],
  templateUrl: './doc.component.html',
  styleUrl: './doc.component.scss'
})
export class DocComponent {

}
