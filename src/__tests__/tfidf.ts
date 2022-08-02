import { tfidfVectorizeTexts } from "../clustering-tabs/tfidf";

describe("tfidf", () => {
  const input = [
    ["this", "is", "the", "first", "document"],
    ["this", "document", "is", "the", "second", "document"],
    ["and", "this", "is", "the", "third", "one"],
    ["is", "this", "the", "first", "document"],
  ];
  const correctX = [
    [0, 0.46979139, 0.58028582, 0.38408524, 0, 0, 0.38408524, 0, 0.38408524],
    [0, 0.6876236, 0, 0.28108867, 0, 0.53864762, 0.28108867, 0, 0.28108867],
    [
      0.51184851, 0, 0, 0.26710379, 0.51184851, 0, 0.26710379, 0.51184851,
      0.26710379,
    ],
    [0, 0.46979139, 0.58028582, 0.38408524, 0, 0, 0.38408524, 0, 0.38408524],
  ];
  const correctVocabulary = [
    "and",
    "document",
    "first",
    "is",
    "one",
    "second",
    "the",
    "third",
    "this",
  ];
  const [x, vocabulary] = tfidfVectorizeTexts(input);
  test("vocabulary", () => {
    expect(vocabulary).toEqual(correctVocabulary);
  });
  test("vector", () => {
    expect(x.length).toBe(correctX.length);
    expect(x[0].length).toBe(correctX[0].length);
    for (let i = 0; i < x.length; i++) {
      for (let j = 0; j < x[0].length; j++) {
        expect(x[i][j]).toBeCloseTo(correctX[i][j]);
      }
    }
  });
});
