import { ProcessNamePipe } from './process-name.pipe';

describe('ProcessNamePipe', () => {
  it('create an instance', () => {
    const pipe = new ProcessNamePipe();
    expect(pipe).toBeTruthy();
  });
});
