import React from "react";
import "./ChatHeader.scss";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PushPinIcon from "@mui/icons-material/PushPin";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import Search from "../searchbar/Search";

type Props = {
  channelName: string | null;
};

const ChatHeader = (props: Props) => {
  const { channelName } = props;
  return (
    <div className="chatHeader">
      <div className="chatHeaderLeft">
        <h3>
          <span className="chatHashTag">#</span>
          {channelName}
        </h3>
      </div>
      <div className="chatHeaderRight">
        <NotificationsIcon className="chatHeaderIcon" />
        <PushPinIcon className="chatHeaderIcon" />
        <PeopleAltIcon className="chatHeaderIcon" />
        <Search />
      </div>
    </div>
  );
};

export default ChatHeader;
