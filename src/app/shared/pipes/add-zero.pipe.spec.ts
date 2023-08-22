import { AddZeroPipe } from './add-zero.pipe';

describe('AddZeroPipe', () => {
  it('create an instance', () => {
    const pipe = new AddZeroPipe();
    expect(pipe).toBeTruthy();
  });
});