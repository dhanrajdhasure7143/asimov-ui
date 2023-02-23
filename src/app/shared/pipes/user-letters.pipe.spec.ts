import { UserLettersPipe } from './user-letters.pipe';

describe('UserLettersPipe', () => {
  it('create an instance', () => {
    const pipe = new UserLettersPipe();
    expect(pipe).toBeTruthy();
  });
});
