import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-masthead',
  imports: [NgOptimizedImage],
  templateUrl: './masthead.component.html',
  styleUrl: './masthead.component.scss',
})
export class MastheadComponent {}
