import { NotifierService } from 'angular-notifier';
import { GlobalScript } from './global-script';

describe('GlobalScript', () => {
  let notifier: NotifierService
  it('should create an instance', () => {
    expect(new GlobalScript(notifier)).toBeTruthy();
  });
});
