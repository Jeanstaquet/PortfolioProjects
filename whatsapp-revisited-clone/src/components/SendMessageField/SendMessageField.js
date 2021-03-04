import React from 'react';
import EmojiFileBtn from '../UI/EmojiFileBtn/EmojiFileBtn';
import Tooltip from "@material-ui/core/Tooltip";
import SendIcon from "@material-ui/icons/Send";
import MicIcon from "@material-ui/icons/Mic";

const SendMessageField = (props) => {
        //Changes the icon between mic and send
        let iconSend =
        props.mess.length < 1 ? (
            <Tooltip title="Record a voice message" arrow>
                <MicIcon className="chat__sendMessageMic" />
            </Tooltip>
        ) : (
            <Tooltip title="Send the message" arrow>
                <SendIcon
                    onClick={(e) => props.sendMessage(e, props.mess)}
                    className="chat__sendMessageMic"
                />
            </Tooltip>
        );
    return (
        <div className="chat__sendMessage">
        <EmojiFileBtn
            displayFileHandler={props.displayFileHandler}
            displayEmojiHandler={props.displayEmojiHandler}
        />
        <form className="chat__sendMessageContent">
            <input
                disabled={props.roomName === null}
                type="text"
                onChange={(e) => props.setMessage(e.target.value)}
                value={props.mess}
            />
            <button
                type="submit"
                onClick={(event) => props.sendMessage(event, props.mess)}
            ></button>
        </form>
        {iconSend}
    </div>
    );
};

export default SendMessageField;