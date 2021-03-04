import React from "react";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import Tooltip from "@material-ui/core/Tooltip";

const EmojiFileBtn = (props) => {
    return (
        <div className="chat__sendMessageEmoji">
            <Tooltip title="Send an emoji" arrow>
                <InsertEmoticonIcon onClick={props.displayEmojiHandler} />
            </Tooltip>
            <Tooltip title="Send a picture" arrow>
                <AttachFileIcon onClick={props.displayFileHandler} />
            </Tooltip>
        </div>
    );
};

export default EmojiFileBtn;
