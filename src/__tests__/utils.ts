import { argMax, cosineSimilarity } from "../utils";

test("argMax", () => {
  const testCase: Array<[number[], number]> = [
    [[1, 2, 3, 4, 5], 4],
    [[5, 4, 3, 2, 1], 0],
    [[1, 1, 3, 1, 1], 2],
    [[-1, -2, -10, -10], 0],
    [[1, 1, 1, 3, 3], 3],
  ];
  for (const [input, expeceted] of testCase) {
    expect(argMax(input)).toBe(expeceted);
  }
});
describe("cosine_similarity", () => {
  // answer is calculated by scikit-learn(Python)
  test("random 2d array", () => {
    const [x, y] = [
      [0.09956054, 0.5038788],
      [0.2305643, 0.00829671],
    ];
    expect(cosineSimilarity(x, y)).toBeCloseTo(0.22899424, 5);
  });
  test("random 5d array", () => {
    const [x, y] = [
      [0.06081733, 0.965065, 0.58768536, 0.86828104, 0.6631044],
      [0.25537965, 0.41821181, 0.54754574, 0.18387871, 0.99281546],
    ];
    expect(cosineSimilarity(x, y)).toBeCloseTo(0.79366579, 5);
  });
  test("opposite array", () => {
    expect(cosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0, 5);
  });
  test("proportional array", () => {
    expect(cosineSimilarity([1, 1], [1, 1])).toBeCloseTo(1, 5);
  });
});
