const l2norm2d = (array: number[][]) => {
  return array.map((row) => {
    const y = Math.sqrt(sum(row.map((x) => x * x)));
    return row.map((x) => x / y);
  });
};

const sum = (array: number[]) => array.reduce((acc, curr) => acc + curr);

export const tfidfVectorizeTexts = (
  texts: string[][]
): [number[][], string[]] => {
  const vocabulary = [...new Set(texts.flat())];
  vocabulary.sort();
  const vocab2idx = new Map(vocabulary.map((word, idx) => [word, idx]));
  const wordCounts = [...Array(texts.length)].map((_) =>
    Array(vocabulary.length).fill(0)
  );
  texts.forEach((doc, i) => {
    doc.forEach((word) => {
      wordCounts[i][vocab2idx.get(word)!] += 1;
    });
  });
  const idf = vocabulary.map((word) => {
    let count = 0;
    for (let i = 0; i < texts.length; i++) {
      if (wordCounts[i][vocab2idx.get(word)!] > 0) {
        count += 1;
      }
    }
    return Math.log((texts.length + 1) / (count + 1));
  });
  const tf = wordCounts.map((wordCount) => {
    const numWords = sum(wordCount);
    return wordCount.map((x) => x / numWords);
  });
  const tfidf = [...Array(texts.length)].map((_) => Array(vocabulary.length));
  for (let i = 0; i < texts.length; i++) {
    for (let j = 0; j < vocabulary.length; j++) {
      tfidf[i][j] = tf[i][j] * (idf[j] + 1);
    }
  }
  return [l2norm2d(tfidf), vocabulary];
};
