import React, { useState, FormEventHandler, useEffect } from "react";
import "./Chat.scss";
import ChatHeader from "./ChatHeader";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import GifIcon from "@mui/icons-material/Gif";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
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

  
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth); // Track window width
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(window.innerWidth <= 393);
  const [isAccordionVisible, setIsAccordionVisible] = useState<boolean>(false);

  const updateWindowWidth = () => {
    const width = window.innerWidth;
    setWindowWidth(width);
    setIsSmallScreen(width <= 393);
  };

  useEffect(() => {
    window.addEventListener("resize", updateWindowWidth); // Update window width on resize
    return () => {
      window.removeEventListener("resize", updateWindowWidth); // Clean up event listener
    };
  }, []);

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
        {!isSmallScreen && <LibraryAddIcon className="chatIcon" />}
        <form onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="send a message"
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

        <div className="chatIcons">
            {isSmallScreen && (
              <span className="comma" onClick={() => setIsAccordionVisible(!isAccordionVisible)}>
                ：
              </span>
            )}
          <label htmlFor="file-input">
            <CameraAltIcon className="cameraIcon" />
            <input
              id="file-input"
              type="file"
              multiple
              name="imageUrl"
              accept=".png, .jpeg, .jpg, .PNG"
              style={{ display: "none" }}
              onChange={OnFileUploadToFirebase}
            />
          </label>
          {!isSmallScreen && 
          <div className="accordion-pc">
              <CardGiftcardIcon className="chatIcon" />
              <GifIcon className="chatIcon" />
              <SentimentSatisfiedAltIcon className="chatIcon" />
            </div>
            }
          {isAccordionVisible && (
            <div className="accordion">
              <CardGiftcardIcon className="chatIcon" />
              <GifIcon className="chatIcon" />
              <SentimentSatisfiedAltIcon className="chatIcon" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
