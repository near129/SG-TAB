import { cloneDeep } from "lodash";
import { autoGroup, ungroup, updateTabGroup } from "./tab";
import { Message, MessageType } from "./message";
import {
  defaultSettings,
  loadSyncSettings,
  setSettings,
  convertChanges,
} from "./settings";

const settings = cloneDeep(defaultSettings);
loadSyncSettings().then((syncSettings) => {
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

const WINDOW_ID_CURRENT = chrome.windows.WINDOW_ID_CURRENT;
chrome.runtime.onMessage.addListener(async (message: Message) => {
  console.log("onMessage", message);
  switch (message.type) {
    case MessageType.UNGROUP: {
      ungroup(WINDOW_ID_CURRENT);
      break;
    }
    case MessageType.AUTO_GROUP: {
      await autoGroup(
        WINDOW_ID_CURRENT,
        settings.minTabsInGroup,
        settings.threshold
      );
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
  }
});
