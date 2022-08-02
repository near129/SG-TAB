import { preprocessText, preprocessUrl } from "../clustering-tabs/preprocess";
describe("preprocess", () => {
  test("preprocessText", () => {
    const testCase: Array<[string, string[]]> = [
      ["This is TEST!!!", ["this", "is", "test"]],
      ["これは、ﾃｽﾄです！！！", ["これ", "は", "テスト", "です"]],
    ];
    for (const [input, expected] of testCase) {
      expect(preprocessText(input)).toEqual(expected);
    }
  });
});
