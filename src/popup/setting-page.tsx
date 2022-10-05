import {
  Button,
  Checkbox,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React from "react";
import { useEffect, useState } from "react";
import {
  convertChanges,
  defaultSettings,
  getSyncSettings,
  setSettings,
  setSyncSettings,
  Settings,
} from "../settings";

// const useSettingStatus = (): [Settings, (item: Partial<Settings>) => void, () => void] => {
//   const [settings, setSettings] = useState(defaultSettings);
//   const setAllSettings = async (item: Partial<Settings>) => {
//     setSettings({ ...settings, ...item });
//     await setSyncSettings(item);
//   };
//   getSyncSettings().then((syncSettings) => setSettings({...settings, ...syncSettings}));
//   useEffect(() => {
//     console.log(settings)
//     chrome.storage.onChanged.addListener((changes, areaName) => {
//       if (areaName === "sync") {
//         const changeSettings = convertChanges(changes);
//         setSettings({...settings, ...changeSettings});
//       }
//     });
//   }, []);
//   const clearSettings = () => {
//     chrome.storage.sync.clear()
//     setSettings(defaultSettings);
//   }
//   return [settings, setAllSettings, clearSettings];
// };

const SettingsPage = () => {
  console.log("setting")
  // const [settings, setSettings, clearSettings] = useSettingStatus();
  const [settings, setSettings] = useState(defaultSettings);
  const setSetting = (item: Partial<Settings>) => {
    setSettings({...settings, ...item});
  }
  getSyncSettings().then((syncSettings) => setSettings({...settings, ...syncSettings}));
  const saveSettings = () => {
      console.log("saved ", settings)
      setSyncSettings(settings);
  }
  const clearSettings = () => {
    chrome.storage.sync.clear()
    setSettings(defaultSettings);
  }
  return (
    <div style={{display: "flex", flexDirection: "column"}}>
      <TextField
        label="threshold"
        type="number"
        value={settings.threshold}
        onChange={(e) => setSetting({ threshold: parseFloat(e.target.value) })}
        margin="normal"
      />
      <TextField
        label="the minimum number of tab in group"
        type="number"
        value={settings.minTabsInGroup}
        onChange={(e) =>
          setSetting({ minTabsInGroup: parseInt(e.target.value) })
        }
        margin="normal"
      />
      <InputLabel>Auto Group</InputLabel>
      <Select
        value={settings.autoGroup}
        onChange={(e) =>
          setSetting({ autoGroup: e.target.value as Settings["autoGroup"] })
        }
      >
        <MenuItem value="auto">auto</MenuItem>
        <MenuItem value="manual">manual</MenuItem>
        <MenuItem value="off">off</MenuItem>
      </Select>
      <FormControlLabel
        control={
          <Checkbox
            checked={settings.useTitle}
            onChange={(e) => setSetting({ useTitle: e.target.checked })}
          />
        }
        label="Use title"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={settings.useUrl}
            onChange={(e) => setSetting({ useUrl: e.target.checked })}
          />
        }
        label="Use url"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={settings.collapseOtherGroup}
            onChange={(e) =>
              setSetting({ collapseOtherGroup: e.target.checked })
            }
          />
        }
        label="Collapse other group"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={settings.autoAlignTabs}
            onChange={(e) => setSetting({ autoAlignTabs: e.target.checked })}
          />
        }
        label="Auto align tabs"
      />
      <Button onClick={saveSettings}>SAVE</Button>
      <Button onClick={clearSettings}>CLEAR</Button>
    </div>
  );
};
export default SettingsPage;
