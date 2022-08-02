import { debounce, throttle, cloneDeep } from "lodash";
import {
  clusteringTabs,
  ClusteringTabsOption,
} from "./clustering-tabs/clustering";
import { Message, MessageType } from "./message";
import {
  defaultSettings,
  getSyncSettings,
  setSettings,
  convertChanges,
} from "./settings";

const settings = cloneDeep(defaultSettings);
getSyncSettings().then((syncSettings) => {
  console.log("Load storage", syncSettings);
  setSettings(settings, syncSettings);
});
chrome.storage.onChanged.addListener((changes, areaName) => {
  console.log("on Change storage", changes);
  if (areaName === "sync") {
    const changeSettings = convertChanges(changes);
    setSettings(settings, changeSettings);
  }
});

const ungroup = async (windowId?: number) => {
  console.log("ungroup", windowId);
  const tabs = await chrome.tabs.query({ windowId, pinned: false });
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
const autoGroup = async (
  windowId: number,
  options: {
    clusteringTabOption: ClusteringTabsOption;
    minTabsInGroup: number;
    divideTabGroup: boolean;
  }
) => {
  await ungroup(windowId);
  console.log("auto group", windowId, options);
  const tabs = await chrome.tabs.query({ windowId, pinned: false });
  if (tabs.length === 0) {
    return
  }
  const numPinTabs = await chrome.tabs
    .query({ windowId, pinned: true })
    .then((tabs) => tabs.length);
  console.log("#tab", tabs);
  console.log("#num pin tabs ", numPinTabs);
  const groups = clusteringTabs(tabs, options.clusteringTabOption);
  console.log("#group", groups);
  let index = numPinTabs;
  for (const group of groups) {
    if (group.tabIds.length > options.minTabsInGroup) {
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
        if (options.divideTabGroup) {
          chrome.tabs.move(tabId, { index: -1 });
        } else chrome.tabs.move(tabId, { index });
        index += 1;
      }
    }
  }
};

const updateTabGroup = async (collapsed: boolean, windowId?: number) => {
  console.log("updateTabGroup", collapsed);
  const tabGroups = await chrome.tabGroups.query({ windowId });
  for (const tabGroup of tabGroups) {
    chrome.tabGroups.update(tabGroup.id, { collapsed });
  }
};
const alignTabs = async (windowId: number) => {
  const numPinTabs = await chrome.tabs
    .query({ windowId, pinned: true })
    .then((tabs) => tabs.length);
  const groups = await chrome.tabGroups.query({ windowId });
  console.log("alignTabs", numPinTabs, groups);
  for (const group of groups) {
    await chrome.tabGroups.move(group.id, { index: numPinTabs });
  }
};
const WINDOW_ID_CURRENT = chrome.windows.WINDOW_ID_CURRENT;
chrome.runtime.onMessage.addListener(async (message: Message) => {
  console.log("onMessage", message);
  switch (message.type) {
    case MessageType.UNGROUP: {
      ungroup(WINDOW_ID_CURRENT);
      break;
    }
    case MessageType.AUTO_GROUP: {
      await autoGroup(WINDOW_ID_CURRENT, {
        clusteringTabOption: {
          tabProcessOption: {
            useTitle: settings.useTitle,
            useUrl: settings.useUrl,
          },
          clusteringOption: { threshold: settings.threshold },
        },
        minTabsInGroup: settings.minTabsInGroup,
        divideTabGroup: false,
      });
      alignTabs(WINDOW_ID_CURRENT);
      break;
    }
    case MessageType.COLLAPSE_ALL_GROUP: {
      updateTabGroup(true, WINDOW_ID_CURRENT);
      break;
    }
    case MessageType.EXPAND_ALL_GROUP: {
      updateTabGroup(false, WINDOW_ID_CURRENT);
      break;
    }
    case MessageType.ALIGN_TABS: {
      alignTabs(WINDOW_ID_CURRENT);
      break;
    }
  }
});
const collapsedOtherGroup = async (tabId: number, windowId?: number) => {
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

chrome.tabs.onActivated.addListener(
  throttle(({ tabId, windowId }) => {
    console.log("onActivateTab");
    if (settings.collapseOtherGroup) {
      setTimeout(() => collapsedOtherGroup(tabId, windowId), 1000);
    }
  }, 100)
);

chrome.tabs.onUpdated.addListener(
  throttle(() => {
    console.log("onUpdatedTabs");
    if (settings.autoAlignTabs) {
      setTimeout(() => alignTabs(WINDOW_ID_CURRENT), 10);
    }
    if (settings.autoGroup === "auto") {
      setTimeout(
        () =>
          autoGroup(WINDOW_ID_CURRENT, {
            clusteringTabOption: {
              tabProcessOption: {
                useTitle: settings.useTitle,
                useUrl: settings.useUrl,
              },
              clusteringOption: { threshold: settings.threshold },
            },
            minTabsInGroup: settings.minTabsInGroup,
            divideTabGroup: false,
          }),
        10
      );
    }
  }, 100)
);
