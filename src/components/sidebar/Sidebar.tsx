import React, { useEffect, useState } from "react";
import "./Sidebar.scss";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import SidebarChannel from "./SidebarChannel";
import MicIcon from "@mui/icons-material/Mic";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import SettingsIcon from "@mui/icons-material/Settings";
import { auth, db } from "../../firebase";
import { useAppSelector } from "../../app/hooks";
import useCollection from "../../hooks/useCollection";
import { addDoc, collection } from "firebase/firestore";

const Sidebar = () => {
  const user = useAppSelector((state) => state.user.user);
  const { documents: channels } = useCollection("channels");
  const [isChannelListOpen, setIsChannelListOpen] = useState(false);

  //hide channelName first
  const handleToggleChannelList = () => {
    setIsChannelListOpen(!isChannelListOpen);
  };

  const addChannel = async () => {
    let channelName: string | null = prompt("Add new channel");

    if (channelName) {
      await addDoc(collection(db, "channels"), {
        channelName: channelName,
      });
    }
  };

  return (
    <div className="sidebar">
      {/* left */}
      <div className="sidebarLeft">
        <div className="sidebarLeftTop">
          <div className="serverIcon">
            <img src="./discord-icon.png" alt="" />
          </div>
          <div className="serverIcon">
            <img src="./discord-icon.png" alt="" />
          </div>
        </div>
        <div className="sidebarLeftBottom" onClick={() => auth.signOut()} >Logout</div>
      </div>
      {/* right */}
      <div className="sidebarRight">
        <div className="sidebarTop">
          <h3>Discord</h3>
          <ExpandMoreIcon />
        </div>

        {/* channels */}
        <div className="channels">
          <div className="channelsHeader">
            <div className="sidebarHeader">
              <ExpandMoreIcon
                className="sidebarIcon"
                onClick={handleToggleChannelList}
              />
              <h4>Programming Channel</h4>
            </div>
            <AddIcon className="sidebarIcon" onClick={() => addChannel()} />
          </div>

          <div
            className="channelList"
            style={{ display: isChannelListOpen ? "block" : "none" }}
          >
            {channels.map((channel) => (
              <SidebarChannel
                channel={channel}
                id={channel.id}
                key={channel.id}
              />
            ))}
          </div>

          <div className="footer">
            <div className="account">
              <img src={user?.photo} alt="" />
              <div className="accountName">
                <h4>{user?.displayName}</h4>
                <span>#{user?.uid.substring(0, 4)}</span>
              </div>
            </div>

            <div className="voice">
              <MicIcon />
              <HeadphonesIcon />
              <SettingsIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
