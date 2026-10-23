import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AppRouteEnum } from '@core/enums/app-route.enum';
import { PESEL_TEST_SETS, testCasesCsv } from '@core/testing/pesel-test-sets';
import { PESEL_ISSUE_LABELS } from '@core/validation/pesel-inspection';
import { BatchInputService } from '@services/batch-input.service';
import { DownloadService } from '@services/download.service';
import { SectionComponent } from '@layout/section/section.component';
import { CardComponent } from '@shared/ui/card/card.component';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { CopyButtonComponent } from '@shared/ui/toolbar/copy-button/copy-button.component';

type TestSetId = (typeof PESEL_TEST_SETS)[number]['id'];

@Component({
  selector: 'app-test-data',
  imports: [
    SectionComponent,
    CardComponent,
    ButtonComponent,
    CopyButtonComponent,
  ],
  templateUrl: './test-data.component.html',
  styleUrl: './test-data.component.css',
})
export class TestDataComponent {
  private readonly download = inject(DownloadService);
  private readonly batchInput = inject(BatchInputService);
  private readonly router = inject(Router);
  readonly sets = PESEL_TEST_SETS;
  readonly selected = signal<TestSetId>('boundaries');
  readonly activeSet = computed(
    () => this.sets.find((set) => set.id === this.selected())!,
  );
  readonly validCount = computed(
    () => this.activeSet().cases.filter((item) => item.expectedValid).length,
  );
  readonly json = computed(() =>
    JSON.stringify(this.activeSet().cases, null, 2),
  );
  readonly labels = PESEL_ISSUE_LABELS;

  exportCsv(): void {
    this.download.downloadText(
      testCasesCsv(this.activeSet().cases),
      `pesel-test-${this.selected()}.csv`,
      'text/csv;charset=utf-8',
      true,
    );
  }
  exportJson(): void {
    this.download.downloadJson(
      this.activeSet().cases,
      `pesel-test-${this.selected()}.json`,
      2,
    );
  }
  checkSet(): void {
    this.batchInput.set({
      text: testCasesCsv(this.activeSet().cases),
      format: 'csv',
    });
    void this.router.navigate(['/', AppRouteEnum.Batch]);
  }
}
