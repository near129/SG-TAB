export type Settings = {
  // excludeOwnGroup: boolean;
  threshold: number;
  // excludeTabUrlRule: RegExp[];
  // autoGroup: "auto" | "manual" | "off";
  minTabsInGroup: number;
  // useTitle: boolean;
  // useUrl: boolean;
  // autoAppendTab: boolean;
  // sortTab: "sort" | "clustering" | "groupTab" | "off";
  // collapseOtherGroup: boolean;
  // autoAlignTabs: boolean;
  // stopWords: string[];
};

export const defaultSettings: Settings = {
  // excludeOwnGroup: true,
  threshold: 0.5,
  // excludeTabUrlRule: [],
  // autoGroup: "manual",
  minTabsInGroup: 3,
  // useTitle: true,
  // useUrl: true,
  // autoAppendTab: true,
  // sortTab: "clustering",
  // collapseOtherGroup: true,
  // autoAlignTabs: true,
  // stopWords: [],
};

export const loadSyncSettings = async (): Promise<Partial<Settings>> => {
  const syncSettings = await chrome.storage.sync.get(
    Object.keys(defaultSettings)
  );
  for (const [key, value] of Object.entries(syncSettings)) {
    syncSettings[key] = JSON.parse(value);
  }
  return syncSettings;
};
export const setSyncSettings = async (item: Partial<Settings>) => {
  const stringifyItem: { [key: string]: string } = {};
  for (const [key, value] of Object.entries(item)) {
    stringifyItem[key] = JSON.stringify(value);
  }
  await chrome.storage.sync.set(stringifyItem);
};
export const setSettings = async (
  settings: Settings,
  item: Partial<Settings>
) => {
  Object.assign(settings, item);
  setSyncSettings(item);
  return settings;
};

export const convertChanges = (changes: chrome.storage.StorageChange) => {
  const changeSettings: { [key: string]: any } = {};
  for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
    changeSettings[key] = JSON.parse(newValue);
  }
  return changeSettings;
};
