import React from 'react';
import { Avatar } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import MenuContact from '../UI/MenuContact/MenuContact';
const ChatBanner = (props) => {
    return (
        <div className="chat__banner">
        <div className="chat__bannerInfo">
            <Avatar
                className="chat__bannerAvatar"
                src={
                    props.contactData !== null
                        ? props.contactData.photo
                        : null
                }
            ></Avatar>
            <div className="chat__info">
                <p>{props.contact}</p>
            </div>
        </div>
        <div className="chat__bannerIcon">
            <SearchIcon onClick={props.searchBarHandler} />
            <input
                type="text"
                value={props.searchBar}
                disabled={props.roomName === null}
                className={
                    !props.showSearchBar
                        ? "chat__bannerSearch"
                        : "chat__bannerSearch show"
                }
                onChange={(e) => props.setSearchBar(e.target.value)}
            />
            <MoreHorizIcon onClick={props.contactMenuHandler} />
            <MenuContact
                show={props.showContactMenu && props.roomName !== null}
                delete={props.deleteConversation}
            />
        </div>
    </div>
    );
};

export default ChatBanner;