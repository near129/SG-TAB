import { debounce } from "lodash";
import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Message, MessageType } from "../message";
import { TextField } from "@mui/material";
import {
  defaultSettings,
  loadSyncSettings,
  setSyncSettings,
  Settings,
} from "../settings";
const sendMessage = async (message: Message) => {
  debounce(() => {
    chrome.runtime.sendMessage(message);
  }, 100)();
};
const ungroup = async () => {
  sendMessage({ type: MessageType.UNGROUP });
};
const autoGroup = async () => {
  sendMessage({ type: MessageType.AUTO_GROUP });
};
const collapseAllGroup = async () => {
  sendMessage({ type: MessageType.COLLAPSE_ALL_GROUP });
};
const expandAllGroup = async () => {
  sendMessage({ type: MessageType.EXPAND_ALL_GROUP });
};
const useSettings = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const setSetting = (item: Partial<Settings>) => {
    setSettings({ ...settings, ...item });
    console.log(item, settings);
    setSyncSettings(settings);
  };
};
const Popup = () => {
  console.log("main");
  const [settings, setSettings] = useState(defaultSettings);
  const setSetting = (item: Partial<Settings>) => {
    setSettings({ ...settings, ...item });
    setSyncSettings({ ...settings, ...item });
  };
  useEffect(() => {
    loadSyncSettings().then((syncSettings) =>
      setSettings({ ...settings, ...syncSettings })
    );
  }, []);
  return (
    <>
      <div style={{ minWidth: "400px" }}>
        <TextField
          label="threshold"
          type="number"
          value={settings.threshold}
          onChange={(e) =>
            setSetting({ threshold: parseFloat(e.target.value) })
          }
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
        <Button onClick={autoGroup}>
          {settings.threshold == 0 ? "Sort" : "AutoGroup"}
        </Button>
        <Button onClick={ungroup}>Ungroup</Button>
      </div>
    </>
  );
};

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);

// root.render(<Popup />);
