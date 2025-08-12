import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { Router } from '@angular/router';
import { ToolbarButtonComponent } from '@components/toolbar/toolbar-button/toolbar-button.component';
import {
  ActionResult,
  ToolbarAction,
} from '@components/toolbar/toolbar-button/toolbar-action';
import { AppRouteEnum } from '@core/enums/app-route.enum';

@Component({
  selector: 'app-goto-parse-button',
  imports: [ToolbarButtonComponent],
  templateUrl: './goto-parse-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GotoParseButtonComponent implements ToolbarAction<void> {
  private readonly router = inject(Router);
  public readonly pesel = input.required<string | undefined>();

  async run(): Promise<ActionResult> {
    const pesel = this.pesel();

    const urlTree = this.router.createUrlTree([AppRouteEnum.Parser], {
      queryParams: pesel ? { pesel } : undefined,
    });

    await this.router.navigateByUrl(urlTree);

    return { ok: true, message: 'Navigated to parser' };
  }
}
