import React, { useEffect, useState } from 'react';
import "./Chat.scss";
import SearchIcon from '@material-ui/icons/Search';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MicIcon from '@material-ui/icons/Mic';
import { Avatar } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import Message from "../../components/Message/Message";
import db, {storage} from "../../firebase";
import firebase from "firebase"
import {connect} from "react-redux";
import ImageModal from "../../components/UI/ImageModal/ImageModal";
import Tooltip from '@material-ui/core/Tooltip';
import Picker from 'emoji-picker-react';
import * as actions from "../../store/action/index";
import MenuContact from "../../components/UI/MenuContact/MenuContact";
const Chat = (props) => {
    const [mess, setMessage] = useState("");
    const [messageCanal, setMessageCanal] = useState([])
    const [showEmoji, setShowEmoji] = useState(false);
    const [showAddFile, setShowAddFile] = useState(false);
    const [fileSend, setFileSend] = useState(null);
    const [fileError, setFileError] = useState(false);
    const [imageToShow, setImageToShow] = useState("");
    const [searchBar, setSearchBar] = useState("");
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [showContactMenu, setShowContactMenu] = useState(false);
    const [recording, setRecording] = useState(false)
    const [showModalRecording, setShowModalRecording] = useState(true);
    const [blopUrl, setBlopUrl] = useState("")
    let iconSend = mess.length < 1 ? <Tooltip title="Record a voice message" arrow><MicIcon className="chat__sendMessageMic"/></Tooltip> : <Tooltip title="Send the message" arrow><SendIcon onClick={(e) => sendMessage(e, mess)} className="chat__sendMessageMic"/></Tooltip>

    useEffect(() => {
        let unsubcribe = () => {

        };
        if(props.userId && props.roomName) {
            unsubcribe = db
            .collection("Users")
            .doc(props.userId)
            .collection("conversations")
            .doc(props.roomName)
            .collection("messages")
            .orderBy("timestamp", "asc")
            .onSnapshot(snapshot => (
                setMessageCanal(snapshot.docs.map(doc => (
                    {
                        data: doc.data()
                    }
                )))
            ))
        }

        return () => {
            unsubcribe()
        }
    }, [props.roomName, props.userId]);

    const sendMessage = (event) => {
        if(event) {
            event.preventDefault()
        }
        //Query for the current user
        db
            .collection("Users")
            .doc(props.userId)
            .collection("conversations")
            .doc(props.roomName)
            .collection("messages")
            .add({
                message: mess,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                sender: props.pseudo.pseudo
            })
        //Query for the contact     
        db
        .collection("Users")
        .doc(props.contactData.userId)
        .collection("conversations")
        .doc(props.roomName)
        .collection("messages")
        .add({
            message: mess,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            sender: props.pseudo.pseudo
        })

            setMessage("");
    }

    const fileHandler = (event) => {
        if(event.target.files[0]) {
            if(event.target.files[0].type === "image/jpeg" || event.target.files[0].type === "image/png") {

            } else {
                setFileError(true) 
                console.log("jjj")
                setTimeout(() => {
                    setFileError(false) 
                }, 5000)
                event.target.value = null
                
            }
            setFileSend(event.target.files[0])
        }
    }
    

    const fileUploadHandler = (event) => {
        event.preventDefault()
        storage.ref(`images/${fileSend.name}`).put(fileSend)
        setTimeout(() => {
            storage
            .ref("images")
            .child(fileSend.name)
            .getDownloadURL()
            .then(url => {
                        //Query for the current user
                db
                .collection("Users")
                .doc(props.userId)
                .collection("conversations")
                .doc(props.roomName)
                .collection("messages")
                .add({
                    message: "img",
                    imgUrl: url,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    sender: props.pseudo.pseudo
                })

                        //Query for the contact     
                db
                .collection("Users")
                .doc(props.contactData.userId)
                .collection("conversations")
                .doc(props.roomName)
                .collection("messages")
                .add({
                    message: "img",
                    imgUrl: url,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    sender: props.pseudo.pseudo
                })


            })
        }, 1500);

            setShowAddFile(false)
    }


    const onEmojiClick = (event, emojiObject) => {
        setShowEmoji(false)
        setMessage(mess + emojiObject.emoji)
    };

    const displayEmojiHandler = () => {
        setShowEmoji(!showEmoji);
        setShowAddFile(false);
    }

    const displayFileHandler = () => {
        setShowAddFile(!showAddFile)
        setShowEmoji(false)
    }

    //select an url for the image modal
    const clickedHandler = (imgUrl) => {
        setImageToShow(imgUrl)
    }

    const closeImageModal = () => {
        setImageToShow("")
    }
    
    const searchBarHandler = () => {
        setShowSearchBar(!showSearchBar)
    }

    const contactMenuHandler = () => {
        setShowContactMenu(!showContactMenu)
    }

    const deleteConversation = () => {
        setShowContactMenu(false)
        props.roomDeleteHandler()
        db
        .collection("Users")
        .doc(props.userId)
        .collection("conversations")
        .doc(props.roomName)
        .delete()
        setMessageCanal([])
    }
    let messageBody = document.querySelector('.chat__content');
    if(messageBody) {
        messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
    }
    const closeModalRecording = () => {
        setShowModalRecording(!showModalRecording)
    }

    const beginEndRecording = (arg) => {
        if(arg==="close") {
            setRecording(false)
        } else if(arg==="begin") {
            setRecording(true)
        }
    }

    const onData = (recordedBlob, fileName) =>  {
            //A Blob() is almost a File() - it's just missing the two properties below which we will add
            recordedBlob.lastModifiedDate = new Date();
            recordedBlob.name = fileName;
            setBlopUrl(recordedBlob.blobURL); 
            console.log(recordedBlob)

            //let myBlob = new Blob(recordedBlob.blobURL);
            //console.log(myBlob)
            let audio = URL.createObjectURL(recordedBlob.blobURL)
            console.log(audio)
        }

    return (
        <div className="chat__container">
            <ImageModal 
                show={showModalRecording} 
                record={true} 
                isRec={recording} 
                closePP={closeModalRecording}
                recordingBeginEnd={beginEndRecording}
                onData={onData}
                blopUrl={blopUrl}/>
            <div className="chat__banner">
                <div className="chat__bannerInfo">
                    <Avatar className="chat__bannerAvatar" src={props.contactData.photo ? props.contactData.photo: null}>{props.contact!==null ? props.contact[0] : null}</Avatar>
                    <div className="chat__info">
                        <p>{props.contact}</p>
                    </div>

                </div>
                <div className="chat__bannerIcon">
                    <Tooltip title="Search a message" arrow>
                        <SearchIcon onClick={searchBarHandler}/>
                    </Tooltip>
                    <Tooltip title="You can write 'img' or a letter" arrow>
                    <input type="text" value={searchBar} disabled={props.roomName===null} className={!showSearchBar ? "chat__bannerSearch" : "chat__bannerSearch show"} onChange={e => setSearchBar(e.target.value)}/>
                    </Tooltip>
                    <MoreHorizIcon onClick={contactMenuHandler}/>
                    <Tooltip title="options" arrow >
                        <MenuContact show={showContactMenu && props.roomName!==null} delete={deleteConversation}/>
                    </Tooltip>
                </div>
            </div>
            <div className="chat__content">
                <div className={showAddFile ? "chat__addFileModal" : "notShow"}>
                    <form style={{border: fileError ? "1px solid red" : null}}>
                        <p style={{display: fileError ? "block": "none"}}>This not a valid file type</p>
                        <input type="file" onChange={fileHandler}/>
                        <input type="submit" disabled={fileError || fileSend === null ? true : false} onClick={fileUploadHandler}/>
                    </form>
                </div>
                {showEmoji && props.roomName ? <Picker onEmojiClick={onEmojiClick} disableSearchBar={true} /> : null}
                {messageCanal.filter(msg => msg.data.message.includes(searchBar)).map((room, index) => (
                    <Message key={index} 
                             message={room.data.imgUrl ? null : room.data.message} 
                             img={room.data.imgUrl}
                             clicked={() => clickedHandler(room.data.imgUrl)}
                             reciever={room.data.sender == props.pseudo.pseudo ? false : true}
                             timestamp={room.data.timestamp ? (new Date(room.data.timestamp.seconds * 1000)).toLocaleDateString('en-UK') : null} />
                ))}
            </div>
            <div className="chat__sendMessage">
                <div className="chat__sendMessageEmoji">
                    <Tooltip title="Send an emoji" arrow>
                        <InsertEmoticonIcon onClick={displayEmojiHandler}/>
                    </Tooltip>
                    <Tooltip title="Send a picture" arrow>
                        <AttachFileIcon onClick={displayFileHandler}/>
                    </Tooltip>
                </div>
                <form className="chat__sendMessageContent">
                    <input disabled={props.roomName===null} type="text" onChange={(e) => setMessage(e.target.value)} value={mess}/>
                    <button type="submit" onClick={(event) => sendMessage(event, mess)}></button>
                </form>
                {iconSend}
            </div>
        </div>
    );
};

const mapStateToProps = state => {
    return {
        userId: state.userId,
        roomName: state.roomName,
        email: state.email,
        pseudo: state.pseudo,
        contact: state.contact,
        contactData: state.contactDetails
    }
}

const mapDispatchToProps = dispatch => {
    return {
        roomDeleteHandler: () => dispatch(actions.roomDeleteHandler())
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Chat);