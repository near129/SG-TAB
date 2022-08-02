const TAB_SUSPENDER_PATTERN =
  /chrome-extension:\/\/.*\/suspended.html#.*&url=(.*)$/;
export const preprocessUrl = (url: string) => {
  // TODO: もう少しhttpとか削除
  let match;
  if ((match = url.match(TAB_SUSPENDER_PATTERN)) !== null) {
    url = match[1];
  }
  return decodeURI(url);
};
const SEGMENTER = new Intl.Segmenter([], { granularity: "word" });

export const preprocessText = (document: string) => {
  // TODO: stopword
  return Array.from(SEGMENTER.segment(document))
    .filter((seg) => seg.isWordLike)
    .map((seg) => seg.segment.toLowerCase().normalize("NFKC"));
};

export type TabPreprocessOption = {
  useTitle: boolean;
  useUrl: boolean;
  // stopwords
};
export const preprocessTab = (
  tab: chrome.tabs.Tab,
  option: TabPreprocessOption
) => {
  let text = "";
  if (option.useUrl && tab.url !== undefined) {
    text += preprocessUrl(tab.url);
  }
  if (option.useTitle && tab.title !== undefined) {
    text += " " + tab.title;
  }
  return preprocessText(text);
};
