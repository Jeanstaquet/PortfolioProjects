import React, { useEffect, useState } from "react";
import "./Chat.css";
import db, { storage } from "../../firebase";
import firebase from "firebase";
import { connect } from "react-redux";
import ImageModal from "../../components/UI/ImageModal/ImageModal";
import Picker from "emoji-picker-react";
import * as actions from "../../store/action/index";
import AddFilePromt from "../../components/UI/AddFilePrompt/AddFilePromt";
import SendMessageField from "../../components/SendMessageField/SendMessageField";
import ChatBanner from "../../components/ChatBanner/ChatBanner";
import ChatListMessage from "../../components/ChatListMessage/ChatListMessage";

const Chat = (props) => {
    const [mess, setMessage] = useState("");
    const [messageCanal, setMessageCanal] = useState([]);
    const [showEmoji, setShowEmoji] = useState(false);
    const [showAddFile, setShowAddFile] = useState(false);
    const [fileSend, setFileSend] = useState(null);
    const [fileError, setFileError] = useState(false);
    const [imageToShow, setImageToShow] = useState("");
    const [searchBar, setSearchBar] = useState("");
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [showContactMenu, setShowContactMenu] = useState(false);

    //Get the data from the db and set a change listenner
    const getData = () => {
        if (props.userId && props.roomName) {
            db.collection("Users")
                .doc(props.userId)
                .collection("conversations")
                .doc(props.roomName)
                .collection("messages")
                .orderBy("timestamp", "asc")
                .onSnapshot(
                    (snapshot) =>
                        setMessageCanal(
                            snapshot.docs.map((doc) => ({
                                data: doc.data(),
                            }))
                        ),
                    (error) => console.log(error)
                );
        }
    };

    //Gets the data from every componentDidMount
    useEffect(() => {
        getData();

        return () => {
            getData();
            console.log("remove");
        };
    }, [props.roomName, props.userId]);

    //Send the message in the db of the user and the contact
    const sendMessage = (event) => {
        if (event) {
            event.preventDefault();
        }
        //Query for the current user
        db.collection("Users")
            .doc(props.userId)
            .collection("conversations")
            .doc(props.roomName)
            .collection("messages")
            .add({
                message: mess,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                sender: props.pseudo.pseudo,
            });
        //Query for the contact
        db.collection("Users")
            .doc(props.contactData.userId)
            .collection("conversations")
            .doc(props.roomName)
            .collection("messages")
            .add({
                message: mess,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                sender: props.pseudo.pseudo,
            });

        setMessage("");
    };

    //Manages the file
    const fileHandler = (event) => {
        if (event.target.files[0]) {
            if (
                event.target.files[0].type === "image/jpeg" ||
                event.target.files[0].type === "image/png"
            ) {
                setFileSend(event.target.files[0]);
            } else {
                setFileError(true);
                setTimeout(() => {
                    setFileError(false);
                }, 5000);
                event.target.value = null;
            }
        }
    };

    //Upload the file in the firebase storage
    const fileUploadHandler = (event) => {
        event.preventDefault();
        storage.ref(`images/${fileSend.name}`).put(fileSend);
        setTimeout(() => {
            storage
                .ref("images")
                .child(fileSend.name)
                .getDownloadURL()
                .then((url) => {
                    //Query for the current user
                    db.collection("Users")
                        .doc(props.userId)
                        .collection("conversations")
                        .doc(props.roomName)
                        .collection("messages")
                        .add({
                            message: "img",
                            imgUrl: url,
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            sender: props.pseudo.pseudo,
                        });

                    //Query for the contact
                    db.collection("Users")
                        .doc(props.contactData.userId)
                        .collection("conversations")
                        .doc(props.roomName)
                        .collection("messages")
                        .add({
                            message: "img",
                            imgUrl: url,
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            sender: props.pseudo.pseudo,
                        });
                });
        }, 1500);

        setShowAddFile(false);
    };

    //Sets the chosen emoji in the chat field
    const onEmojiClick = (event, emojiObject) => {
        setShowEmoji(false);
        setMessage(mess + emojiObject.emoji);
    };

    //Close/open the emoji container
    const displayEmojiHandler = () => {
        setShowEmoji(!showEmoji);
        setShowAddFile(false);
    };

    //Close/open the modal for the file
    const displayFileHandler = () => {
        setShowAddFile(!showAddFile);
        setShowEmoji(false);
    };

    //selects an url for the image modal
    const clickedHandler = (imgUrl) => {
        setImageToShow(imgUrl);
    };

    //Closes the image modal
    const closeImageModal = () => {
        setImageToShow("");
    };

    //Closes the search bar for messages
    const searchBarHandler = () => {
        setShowSearchBar(!showSearchBar);
    };

    //Closes the contact modal
    const contactMenuHandler = () => {
        setShowContactMenu(!showContactMenu);
    };

    //Delete a conversation for both users
    const deleteConversation = () => {
        setShowContactMenu(false);
        props.roomDeleteHandler();
        db.collection("Users")
            .doc(props.userId)
            .collection("conversations")
            .doc(props.roomName)
            .delete();
        setMessageCanal([]);

        db.collection("Users")
            .doc(props.pseudo.userId)
            .collection("conversations")
            .doc(props.roomName)
            .delete();
    };

    //Scroll to the bottom when the user select a new concervation
    let messageBody = document.querySelector(".chat__content");
    if (messageBody) {
        messageBody.scrollTop =
            messageBody.scrollHeight - messageBody.clientHeight;
    }

    return (
        <div className="chat__container">
            <ImageModal
                show={true}
                image={imageToShow ? true : null}
                imgUrl={imageToShow}
                close={closeImageModal}
            />
            <ChatBanner
                contactData={props.contactData}
                contact={props.contact}
                searchBarHandler={searchBarHandler}
                searchBar={searchBar}
                roomName={props.roomName}
                showSearchBar={showSearchBar}
                setSearchBar={setSearchBar}
                contactMenuHandler={contactMenuHandler}
                showContactMenu={showContactMenu}
                deleteConversation={deleteConversation}
            />
            <div className="chat__content">
                <AddFilePromt
                    showAddFile={showAddFile}
                    fileError={fileError}
                    fileHandler={fileHandler}
                    fileSend={fileSend}
                    fileUploadHandler={fileUploadHandler}
                />
                {showEmoji && props.roomName ? (
                    <Picker
                        onEmojiClick={onEmojiClick}
                        disableSearchBar={true}
                    />
                ) : null}
                <ChatListMessage
                    messageCanal={messageCanal}
                    searchBar={searchBar}
                    pseudo={props.pseudo}
                    clickedHandler={clickedHandler}
                />
            </div>
            <SendMessageField
                displayFileHandler={displayFileHandler}
                displayEmojiHandler={displayEmojiHandler}
                roomName={props.roomName}
                setMessage={setMessage}
                mess={mess}
                sendMessage={sendMessage}
            />
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        userId: state.userId,
        roomName: state.roomName,
        email: state.email,
        pseudo: state.pseudo,
        contact: state.contact,
        contactData: state.contactDetails,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        roomDeleteHandler: () => dispatch(actions.roomDeleteHandler()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
