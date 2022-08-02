import { agnes, Cluster } from "ml-hclust";
import { tfidfVectorizeTexts } from "./tfidf";
import { preprocessTab, TabPreprocessOption } from "./preprocess";
import { argMax, reverseCosineSimilarity } from "../utils";

export type ClusteringOption = {
  threshold: number;
};
type Clustring = {
  groupVec: number[];
  indices: number[];
};

const getGroups = (c: Cluster, threshold: number) => {
  let list = [c];
  const ans = [];
  while (list.length > 0) {
    const aux = list.pop()!;
    if (threshold >= aux.height) {
      ans.push(aux);
    } else {
      Array.prototype.push.apply(list, aux.children);
    }
  }
  return ans;
};
const debugCluster = (c: Cluster, tabs: chrome.tabs.Tab[]) => {
  let line: Array<String> = [];
  const visit = (root: Cluster, prev_height: number) => {
    const now_height = Math.floor(root.height * 30);
    if (root.isLeaf) {
      line.push("-".repeat(prev_height) + " " + tabs[root.index].title);
      console.log(line.join(""));
      line.pop();
      line = line.map((s) =>
        s.replaceAll("-", " ").replaceAll("┬", "|").replaceAll("└", " ")
      );
    } else {
      line.push("-".repeat(Math.max(prev_height - now_height - 1, 0)) + "┬");
      visit(root.children[0], now_height);
      line.pop();
      line.push(" ".repeat(Math.max(prev_height - now_height - 1, 0)) + "└");
      visit(root.children[1], now_height);
      line.pop();
    }
  };
  visit(c, Math.floor(c.height * 30) + 2);
};
const clustering = (x: number[][], option: ClusteringOption, tabs: chrome.tabs.Tab[]) => {
  const c = agnes(x, {
    method: "average",
    distanceFunction: reverseCosineSimilarity,
  });
  console.log(c)
  debugCluster(c, tabs);
  const result: Clustring[] = [];
  // c.cut(option.threshold).forEach((root, idx) => {
  getGroups(c, option.threshold).forEach((root, idx) => {
    const indices = root.indices();
    const groupVec = new Array(x[0].length).fill(0);
    for (const idx of indices) {
      for (let i = 0; i < x[0].length; i++) {
        groupVec[i] += x[idx][i];
      }
    }
    for (let i = 0; i < x[0].length; i++) {
      groupVec[i] /= indices.length;
    }
    result.push({ groupVec, indices });
  });
  return result;
};

export type ClusteringTabsOption = {
  tabProcessOption: TabPreprocessOption;
  clusteringOption: ClusteringOption;
};
export type tabGroup = {
  name: string;
  tabIds: number[];
};
export const clusteringTabs = (
  tabs: chrome.tabs.Tab[],
  option: ClusteringTabsOption
) => {
  const texts = tabs.map((tab) => preprocessTab(tab, option.tabProcessOption));
  const [x, vocabulary] = tfidfVectorizeTexts(texts);
  const clusteringResult = clustering(x, option.clusteringOption, tabs);
  const result: tabGroup[] = [];
  for (const cluster of clusteringResult) {
    result.push({
      name: vocabulary[argMax(cluster.groupVec)],
      tabIds: cluster.indices.map((idx) => tabs[idx].id!),
    });
  }
  return result;
};
