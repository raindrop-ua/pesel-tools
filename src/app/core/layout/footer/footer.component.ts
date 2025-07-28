import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NAVIGATION_TOKEN } from '../../../config/navigation.config';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  private router = inject(Router);
  navigation = inject(NAVIGATION_TOKEN);

  isLinkActive(path: string): boolean {
    return this.router.isActive(path, {
      paths: 'exact',
      queryParams: 'ignored',
      matrixParams: 'ignored',
      fragment: 'ignored',
    });
  }
}
