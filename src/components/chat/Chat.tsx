import React, { useState,FormEventHandler } from "react";
import "./Chat.scss";
import ChatHeader from "./ChatHeader";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import AddIcon from "@mui/icons-material/Add";
import GifIcon from "@mui/icons-material/Gif";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import Message from "./Message";
import { useAppSelector } from "../../app/hooks";
import {
  addDoc,

  collection,
  CollectionReference,
  DocumentData,
  DocumentReference,
  serverTimestamp,
} from "firebase/firestore";
import { db, storage } from "../../firebase";
import {
  ref,
  StorageReference,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import useSubCollection from "../../hooks/useSubCollection";

const Chat = () => {
  const [putMessage, setPutMessage] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const channelId = useAppSelector((state) => state.channel.channelId);
  const channelName = useAppSelector((state) => state.channel.channelName);
  const user = useAppSelector((state) => state.user.user);
  const { subDocuments: messages } = useSubCollection("channels", "messages");
  const messagesCollection = collection(db, "messages");

  const OnFileUploadToFirebase = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file: File | undefined = e.target.files?.[0];
    console.log("file name", file);
    if (!file) return;
    const storageRef: StorageReference = ref(storage, "image/" + file.name);
    const snapshot = await uploadBytes(storageRef, file);
    console.log("Uploaded a blob or file!");
    const url = await getDownloadURL(storageRef);
    console.log("画像url", url);
    setImageUrl(url);
  };

  const sendMessage: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    // console.log("send message");
    setPutMessage("");

    const collectionRef: CollectionReference<DocumentData> = collection(
      db,
      "channels",
      String(channelId),
      "messages"
    );

    const docRef: DocumentReference<DocumentData> = await addDoc(
      collectionRef,
      {
        message: putMessage,
        timeStamp: serverTimestamp(),
        user: user,
        imageUrl: imageUrl,
      }
    );
    setImageUrl("");
  };

  console.log("全体", messages);
  return (
    <div className="chat">
      {/* chatHeader */}
      <ChatHeader channelName={channelName} />

      {/* chatMessage */}
      <div className="chatMessage">
        {messages.map((message, index) => (
          <Message
            key={index}
            message={message.message}
            timeStamp={message.timeStamp}
            user={message.user}
            imageUrl={message.imageUrl}
          />
        ))}
      </div>

      {/* chatInput */}
      <div className="chatInput">
        <LibraryAddIcon />
        <form onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="send message"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPutMessage(e.target.value)
            }
            value={putMessage}
          />
          {imageUrl && <img src={imageUrl} alt="" width="150" />}

          <button type="submit" className="send-btn">
            Send
          </button>
          {/* ボタンはEnterで操作できる */}
        </form>

        <div className="chat-input-icons">
          <div className="chat-input-icon">
            <label htmlFor="file-input">
              <AddIcon />
            </label>
            <input
              id="file-input"
              type="file"
              multiple
              name="imageUrl"
              accept=".png, .jpeg, .jpg, .PNG"
              style={{ display: "none" }}
              onChange={OnFileUploadToFirebase}
            />
          </div>
          <div className="chat-input-icon">
            <CardGiftcardIcon />
          </div>
          <div className="chat-input-icon">
            <GifIcon />
          </div>
          <div className="chat-input-icon">
            <SentimentSatisfiedAltIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
