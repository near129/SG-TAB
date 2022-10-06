import { clusteringTabs } from "./clustering-tabs/clustering";

export const ungroup = async (windowId?: number) => {
  console.log("ungroup", windowId);
  const tabs = await chrome.tabs.query({ windowId, pinned: false });
  console.log("tab", tabs);
  for (const tab of tabs) {
    if (tab.id !== undefined) {
      await chrome.tabs.ungroup(tab.id);
    }
  }
};
const tabColors: chrome.tabGroups.ColorEnum[] = [
  "grey",
  "yellow",
  "blue",
  "purple",
  "green",
  "red",
  "pink",
  "cyan",
];
const name2color = async (name: string) => {
  const data = new TextEncoder().encode(name);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 4);
  return tabColors[parseInt(hashHex, 16) % tabColors.length];
};
export const autoGroup = async (
  windowId: number,
  minTabsInGroup: number,
  threshold: number
) => {
  await ungroup(windowId);
  console.log("auto group", windowId, minTabsInGroup, threshold);
  const tabs = await chrome.tabs.query({ windowId, pinned: false });
  console.log("#tab", tabs);
  if (tabs.length === 0) return;
  const numPinTabs = await chrome.tabs
    .query({ windowId, pinned: true })
    .then((tabs) => tabs.length);
  console.log("#pin tabs ", numPinTabs);
  const groups = clusteringTabs(tabs, {
    clusteringOption: { threshold },
    tabProcessOption: { useTitle: true, useUrl: false },
  });
  console.log("#group", groups);
  let index = numPinTabs;
  for (const group of groups) {
    if (group.tabIds.length > minTabsInGroup) {
      const current_index = index;
      chrome.tabs
        .group({ tabIds: group.tabIds, createProperties: { windowId } })
        .then(async (groupId) => {
          const color = await name2color(group.name);
          await chrome.tabGroups.update(groupId, {
            title: group.name,
            color,
          });
          chrome.tabGroups.move(groupId, { index: current_index });
        });
      index += group.tabIds.length;
    } else {
      for (const tabId of group.tabIds) {
        chrome.tabs.move(tabId, { index: -1 });
      }
    }
  }
};

export const updateTabGroup = async (collapsed: boolean, windowId?: number) => {
  console.log("updateTabGroup", collapsed);
  const tabGroups = await chrome.tabGroups.query({ windowId });
  for (const tabGroup of tabGroups) {
    chrome.tabGroups.update(tabGroup.id, { collapsed });
  }
};
export const alignTabs = async (windowId: number) => {
  const numPinTabs = await chrome.tabs
    .query({ windowId, pinned: true })
    .then((tabs) => tabs.length);
  const groups = await chrome.tabGroups.query({ windowId });
  console.log("alignTabs", numPinTabs, groups);
  for (const group of groups) {
    await chrome.tabGroups.move(group.id, { index: numPinTabs });
  }
};

export const collapsedOtherGroup = async (tabId: number, windowId?: number) => {
  console.log("collapseOtherGroup");
  const currentGroupId = await chrome.tabs
    .get(tabId)
    .then((tab) => tab.groupId);
  const tabGroups = await chrome.tabGroups.query({ windowId });
  for (const tabGroup of tabGroups) {
    if (currentGroupId !== tabGroup.id) {
      chrome.tabGroups.update(tabGroup.id, { collapsed: true });
    }
  }
};
