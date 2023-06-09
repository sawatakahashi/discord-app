import React from "react";
import "./Message.scss";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Timestamp } from "firebase/firestore";

type Props = {
  timeStamp: Timestamp;
  message: string;
  imageUrl?: string;
  user: {
    uid: string;
    photo: string;
    email: string;
    displayName: string;
  };
};

const Message = ({ timeStamp, message, user, imageUrl }: Props) => {
  console.log("image_Url", imageUrl);
  return (
    <div className="message">
      {user?.photo ? (
        <img src={user?.photo} alt="" className="profileImg" />
      ) : (
        <AccountCircleIcon />
      )}
      <div className="messageInfo">
        <h4>
          {user?.displayName}
          <span className="timeStamp">
            {new Date(timeStamp?.toDate()).toLocaleString()}
          </span>
        </h4>
        {imageUrl && (
          <img src={imageUrl} alt="" width="200" className="postImg" />
        )}
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Message;
