import { TestBed } from '@angular/core/testing';
import { DownloadService } from './download.service';
import { DOCUMENT } from '@angular/common';

describe('DownloadService', () => {
  let service: DownloadService;
  let doc: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DownloadService);
    doc = TestBed.inject(DOCUMENT);
  });

  it('should create an anchor and click it', () => {
    const a = doc.createElement('a');
    const appendSpy = vi.spyOn(doc.body, 'appendChild');
    const removeSpy = vi.spyOn(doc.body, 'removeChild');
    const clickSpy = vi.spyOn(a, 'click');

    vi.spyOn(doc, 'createElement').mockReturnValue(a as any);

    service.downloadText('hello', 'file.txt');

    expect(appendSpy).toHaveBeenCalledWith(a);
    expect(clickSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalledWith(a);
  });
});
