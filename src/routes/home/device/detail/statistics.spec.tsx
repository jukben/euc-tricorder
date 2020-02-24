import { getAverage, getMax, getMin } from './statistics';

describe('math function are correct', () => {
  it('can compute average', () => {
    expect(getAverage([1, 2, 3])).toBe(2);
  });
  it('can compute max', () => {
    expect(getMax([1, 2, 3])).toBe(3);
  });
  it('can compute min', () => {
    expect(getMin([1, 2, 3])).toBe(1);
  });
});
