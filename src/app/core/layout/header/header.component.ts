import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NAVIGATION_TOKEN } from '../../../config/navigation.config';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
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
