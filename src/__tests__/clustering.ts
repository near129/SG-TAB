import { clusteringTabs } from "../clustering-tabs/clustering";

test("clustring", () => {
  const tabs = JSON.parse(
    `[{"active":false,"audible":false,"autoDiscardable":true,"discarded":false,"favIconUrl":"https://developer.chrome.com/images/meta/favicon-32x32.png","groupId":-1,"height":976,"highlighted":false,"id":184,"incognito":false,"index":0,"mutedInfo":{"muted":false},"pinned":false,"selected":false,"status":"complete","title":"chrome.tabs - Chrome Developers","url":"https://developer.chrome.com/docs/extensions/reference/tabs/#type-Tab","width":960,"windowId":187},{"active":false,"audible":false,"autoDiscardable":true,"discarded":false,"favIconUrl":"https://developer.chrome.com/images/meta/favicon-32x32.png","groupId":-1,"height":976,"highlighted":false,"id":196,"incognito":false,"index":1,"mutedInfo":{"muted":false},"pinned":false,"selected":false,"status":"complete","title":"chrome.tabGroups - Chrome Developers","url":"https://developer.chrome.com/docs/extensions/reference/tabGroups/","width":960,"windowId":187},{"active":false,"audible":false,"autoDiscardable":true,"discarded":false,"favIconUrl":"https://developer.chrome.com/images/meta/favicon-32x32.png","groupId":-1,"height":976,"highlighted":false,"id":199,"incognito":false,"index":2,"mutedInfo":{"muted":false},"pinned":false,"selected":false,"status":"complete","title":"chrome.storage - Chrome Developers","url":"https://developer.chrome.com/docs/extensions/reference/storage/","width":960,"windowId":187},{"active":false,"audible":false,"autoDiscardable":true,"discarded":false,"favIconUrl":"https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico?v=ec617d715196","groupId":-1,"height":976,"highlighted":false,"id":206,"incognito":false,"index":3,"mutedInfo":{"muted":false},"pinned":false,"selected":false,"status":"complete","title":"Newest 'reactjs' Questions - Stack Overflow","url":"https://stackoverflow.com/questions/tagged/reactjs","width":960,"windowId":187},{"active":false,"audible":false,"autoDiscardable":true,"discarded":false,"favIconUrl":"https://ja.reactjs.org/favicon.ico","groupId":-1,"height":976,"highlighted":false,"id":209,"incognito":false,"index":4,"mutedInfo":{"muted":false},"pinned":false,"selected":false,"status":"complete","title":"React – ユーザインターフェース構築のための JavaScript ライブラリ","url":"https://ja.reactjs.org/","width":960,"windowId":187},{"active":true,"audible":false,"autoDiscardable":true,"discarded":false,"favIconUrl":"https://www.mozilla.org/media/img/favicons/firefox/browser/favicon.f093404c0135.ico","groupId":-1,"height":976,"highlighted":true,"id":203,"incognito":false,"index":5,"mutedInfo":{"muted":false},"pinned":false,"selected":true,"status":"complete","title":"Mozilla から高速、プライベート、無料の Firefox ブラウザー をダウンロード","url":"https://www.mozilla.org/ja/firefox/new/","width":960,"windowId":187},{"active":false,"audible":false,"autoDiscardable":true,"discarded":false,"favIconUrl":"https://ja.wikipedia.org/static/favicon/wikipedia.ico","groupId":-1,"height":976,"highlighted":false,"id":212,"incognito":false,"index":6,"mutedInfo":{"muted":false},"pinned":false,"selected":false,"status":"complete","title":"React - Wikipedia","url":"https://ja.wikipedia.org/wiki/React","width":960,"windowId":187},{"active":false,"audible":false,"autoDiscardable":true,"discarded":false,"favIconUrl":"https://ja.wikipedia.org/static/favicon/wikipedia.ico","groupId":-1,"height":976,"highlighted":false,"id":215,"incognito":false,"index":7,"mutedInfo":{"muted":false},"pinned":false,"selected":false,"status":"complete","title":"Mozilla Firefox - Wikipedia","url":"https://ja.wikipedia.org/wiki/Mozilla_Firefox","width":960,"windowId":187},{"active":false,"audible":false,"autoDiscardable":true,"discarded":false,"favIconUrl":"https://ja.wikipedia.org/static/favicon/wikipedia.ico","groupId":-1,"height":976,"highlighted":false,"id":218,"incognito":false,"index":8,"mutedInfo":{"muted":false},"pinned":false,"selected":false,"status":"complete","title":"Google Chrome - Wikipedia","url":"https://ja.wikipedia.org/wiki/Google_Chrome","width":960,"windowId":187}]`
  );
  const result = clusteringTabs(tabs, {
    tabProcessOption: { useTitle: true, useUrl: true },
    clusteringOption: { threshold: 1.0 },
  });
  /* console.log(result); */
});
