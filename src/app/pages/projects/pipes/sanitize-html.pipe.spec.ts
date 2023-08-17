import { DomSanitizer } from '@angular/platform-browser';
import { SanitizeHtmlPipe } from './sanitize-html.pipe';

describe('SanitizeHtmlPipe', () => {
  let sanitizer: DomSanitizer
  it('create an instance', () => {
    const pipe = new SanitizeHtmlPipe(sanitizer);
    expect(pipe).toBeTruthy();
  });
});
