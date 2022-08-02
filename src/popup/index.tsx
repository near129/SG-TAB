import { debounce } from "lodash";
import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import SettingsPage from "./setting-page";
import SettingsIcon from "@mui/icons-material/Settings";
import { Message, MessageType } from "../message";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { UnfoldLess, UnfoldMore } from "@mui/icons-material";
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
const alignTabs = async () => {
  sendMessage({ type: MessageType.ALIGN_TABS });
};
const Popup = () => {
  const [isSettings, setSettings] = useState(false);
  const mainToolbar = (
    <Toolbar sx={{ justifyContent: "space-between" }}>
      <Typography variant="h6">Tab Group Manager</Typography>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div>
          <IconButton onClick={expandAllGroup}>
            <UnfoldMore style={{ transform: "rotate(90deg)" }} />
          </IconButton>
          <IconButton onClick={collapseAllGroup}>
            <UnfoldLess style={{ transform: "rotate(90deg)" }} />
          </IconButton>
          <IconButton onClick={() => setSettings(true)}>
            <SettingsIcon />
          </IconButton>
        </div>
      </div>
    </Toolbar>
  );
  const settingsToolbar = (
    <Toolbar>
      <IconButton hidden={!isSettings} onClick={() => setSettings(false)}>
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="h6">Settings</Typography>
    </Toolbar>
  );
  return (
    <>
      <div style={{ minWidth: "400px" }}>
        <AppBar position="static">
          {isSettings ? settingsToolbar : mainToolbar}
        </AppBar>
        {!isSettings ? (
          <>
            <Button onClick={ungroup}>ungroup</Button>
            <Button onClick={autoGroup}>auto-group</Button>
            <Button onClick={collapseAllGroup}>collapse</Button>
            <Button onClick={expandAllGroup}>expand</Button>
            <Button onClick={alignTabs}>align-tabs</Button>
          </>
        ) : (
          <SettingsPage />
        )}
      </div>
    </>
  );
};

const container = document.getElementById("root");
const root = createRoot(container!);
// root.render(
//   <React.StrictMode>
//     <Popup />
//   </React.StrictMode>
// );

root.render(<Popup />);
