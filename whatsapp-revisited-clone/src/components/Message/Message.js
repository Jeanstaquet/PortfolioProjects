import React from 'react';
import "./Message.css";
const Message = (props) => {
    return (
        <div className={props.reciever ? "message__container" : "message__container sender"}>
            <p>{props.message}</p>
            {props.img ? <img src={props.img} onClick={props.clicked}/> : null}
            <span>{props.timestamp}</span>
        </div>
    );
};

export default Message;