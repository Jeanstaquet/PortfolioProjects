import React from "react";
import Message from "../Message/Message";

const ChatListMessage = (props) => {
    return (
        <>
            {props.messageCanal
                .filter((msg) => msg.data.message.includes(props.searchBar))
                .map((room, index) => (
                    <Message
                        key={index}
                        message={room.data.imgUrl ? null : room.data.message}
                        img={room.data.imgUrl}
                        clicked={() => props.clickedHandler(room.data.imgUrl)}
                        reciever={
                            room.data.sender === props.pseudo.pseudo
                                ? false
                                : true
                        }
                        timestamp={
                            room.data.timestamp
                                ? new Date(
                                      room.data.timestamp.seconds * 1000
                                  ).toLocaleDateString("en-UK")
                                : null
                        }
                    />
                ))}
        </>
    );
};

export default ChatListMessage;
