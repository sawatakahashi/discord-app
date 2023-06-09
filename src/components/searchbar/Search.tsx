import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import "./Search.scss";
import useCollection from "../../hooks/useCollection";
import { DocumentData } from "firebase/firestore";
import { setChannelInfo } from "../../features/channelSlice";

interface Channels {
  id: string;
  channel: DocumentData;
}

const Search = () => {
  const [searchResults, setSearchResults] = useState<Channels[]>([]);
  const { documents: channels } = useCollection("channels");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const searchResult = channels.filter((channel) => {
      return e.target.value === channel.channel.channelName;
    });
    setSearchResults(searchResult);
  };

  return (
    <div className="searchBox">
      <form className="search">
        <input type="search" placeholder="search" onChange={handleChange} />
        <SearchIcon className="icon" />
      </form>
      <div>
        {searchResults.map((channel) => {
          return <a href="#">{channel.channel.channelName}</a>;
        })}
      </div>
    </div>
  );
};

export default Search;
