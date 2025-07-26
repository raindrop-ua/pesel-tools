import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-copy-button',
  imports: [],
  templateUrl: './copy-button.component.html',
  styleUrl: './copy-button.component.scss',
})
export class CopyButtonComponent {
  @Input({ required: true }) contentToCopy!: string;

  copied = signal(false);

  copyToClipboard(): void {
    console.log(this.contentToCopy);

    if (!this.contentToCopy) return;

    navigator.clipboard.writeText(this.contentToCopy).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }
}
