import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imageUrl',
})
export class ImageUrlPipe implements PipeTransform {
  public transform(value: string | null): string | null {
    if (!value) {
      return null;
    }

    return `/assets`;
  }
}
