import React, {useEffect, useState} from 'react';
import "./Conversations.css";
import SearchIcon from '@material-ui/icons/Search';
import { Avatar } from '@material-ui/core';
import Conversation from "../../components/Conversation/Conversation";
import {connect} from "react-redux";
import Modal from "../../components/UI/Modal/Modal";
import db, {storage} from "../../firebase";
import FeatureMenu from "../FeatureMenu/FeatureMenu";
import * as actions from "../../store/action/index";
import AddIcon from '@material-ui/icons/Add';
import ImageModal from "../../components/UI/ImageModal/ImageModal";
import WhiteScreen from "../../components/UI/WhiteScreen/WhiteScreen";
const Conversations = (props) => {
    //Manages the modal state
    const [modal, setModal] = useState(false); 
    //Keeps track of the new conversation name
    const [conversationName, setConversationName] = useState("");
    //Keeps track of the new contact
    const [contact, setContact] = useState("");
    //Stores all the fetched conversations/rooms
    const [fetchedConversations, setFetchecConversations] = useState([])
    //Manages the error message
    const [errorMessage, setErrorMessage] = useState("");
    //Handle the left menu
    const [menuOpenClose, setMenuOpenClose] = useState(true);
    //Tracks the conversation filter
    const [filterName, setFilterName] = useState("");
    //show the modal to change the avatar
    const [onModifyPP, setOnModifyPP] = useState(false);
    //Stores the files for the avatar
    const [filePP, setFilePP] = useState(null)

    //Show the modal
    const toggleModal = () => {
        setModal(true)
    }

    //Hide the modal
    const toggleModalClose = (e) => {
        e.preventDefault();
        setModal(false)
    }

    //Store the value of the new conversation name
    const changeModalHandler = (e) => {
        setConversationName(e.target.value)
    }

    //Store the value of the new contact name
    const changeContactHandler = (e) => {
        setContact(e.target.value)
    }

    //Add a new chat room
    const addConversationHandler = (e) => {
        e.preventDefault()
        if(contact.length === 0 || conversationName.length === 0) {
            setErrorMessage("You have to add an chat name and/or a valid pseudo name")
            setTimeout(() => {
                setErrorMessage("")
            }, 2500)
        } else {
            //Check if the pseudo exists
            checkPseudo(contact)
        }

    }

    //Check if the pseudo exists
    const checkPseudo = (name) => {
        db
            .collection("Users")
            .where("pseudo", "==", name)
            .get()
            .then((querySnapshot) => {
                if(querySnapshot.empty) {
                    setErrorMessage("This userd don't exist")
                    setTimeout(() => {
                        setErrorMessage("")
                    }, 2500)
                }
                querySnapshot.forEach(function(doc) {
                    //If the pseudo exists, create a new room for the current user
                    props.contactDetails(doc.data())
                    db
                        .collection("Users")
                        .doc(props.userId)
                        .collection("conversations")
                        .doc(conversationName)
                        .set({
                            name: conversationName,
                            contact: doc.data()
                        })
                    //Creates a room for the chosen contact
                    db
                        .collection("Users")
                        .doc(doc.data().userId)
                        .collection("conversations")
                        .doc(conversationName)
                        .set({
                            name: conversationName,
                            contact: props.dataForContact
                            })
                setConversationName("");
                setModal(false)
            });
        })
    }

    //Get all the conversations
    const getData = () => {
        if(props.userId) {
            db
                .collection("Users")
                .doc(props.userId)
                .collection("conversations")
                .onSnapshot(snapshot => setFetchecConversations(snapshot.docs.map((doc) => doc.data())))
        }
    }

    //Fetch the data for the conversations
    useEffect(() => {
        getData()  
              
        return () => {
            getData()   
        }
    }, [props.userId])

    //Open/close left menu
    const handleMenu = () => {
        setMenuOpenClose(!menuOpenClose)
    }

    //Search for a specific conversation
    const searchHandler = (e) => {
        setFilterName(e.target.value)
    }

    //Handles the new profile avatar
    const newPPHandler = (e) => {
        e.preventDefault();
        if(filePP) {
            //Make a reference in the firebase storage
            storage.ref(`images/${filePP.name}`).put(filePP)
            setTimeout(() => {
                storage
                    .ref("images")
                    .child(filePP.name)
                    .getDownloadURL()
                    .then(url => {
                        db
                            .collection("Users")
                            .doc(props.userId)
                            .update({
                                photo: url
                            })
                        props.photoHandler(url)
                })
            }, 1500);

        }
        setFilePP(null)
        setOnModifyPP(false)
    }

    //Open/close the modal to change the avatar
    const handlerModalPP = () => {
        setOnModifyPP(!onModifyPP)
    }

    //Store the chosen avatar
    const setFilePPHandler = (event) => {
        setFilePP(event.target.files[0])
    }


    return (
        <div className="converstations__container" >
            <FeatureMenu 
                toggle={handleMenu} 
                open={menuOpenClose}
            />
            <WhiteScreen hide={(props.roomName || onModifyPP || modal)}/>
            <Modal 
                show={modal} 
                click={toggleModalClose} 
                change={changeModalHandler}
                changeContact={changeContactHandler} 
                ok={addConversationHandler}
                errorMessage={errorMessage}
            />
            <div className="conv__account">
                <Avatar 
                    className="conv__avatar" 
                    src={props.pseudo.photo}>
                    {props.pseudo !== null ? props.pseudo.pseudo[0] : null}
                </Avatar>
                <AddIcon 
                    className="conversations__plusSign" onClick={handlerModalPP}/>
                <ImageModal 
                    changePP={true} 
                    submit={newPPHandler} 
                    show={onModifyPP}
                    closePP={handlerModalPP}
                    newFile={setFilePPHandler}
                /> 
                <button onClick={handleMenu}>MENU</button>
            </div>
            <div className="conv__searchBar">
                <input 
                    type="text" 
                    value={filterName} 
                    onChange={e => searchHandler(e)}
                />
                <SearchIcon className="conv__glass"/>
            </div>
            <div className="conv__list">
                <Conversation addNewConv={true} click={toggleModal}/>
                {fetchedConversations.filter(name => name.name.includes(filterName)).map((conv, i) => {
                    return <Conversation 
                                key={i} 
                                name={conv.contact.pseudo} 
                                roomname={conv.name}
                                photo={conv.contact.photo}
                                dispatchRoomName={() => props.roomNameHandler(conv.name, conv.contact.pseudo, conv.contact)}
                            />
                })}
            </div>
        </div>
    );
};

const mapStateToProps = state => {
    return {
        photo: state.photo,
        userId: state.userId,
        pseudo: state.pseudo,
        contactData: state.contactDetails,
        dataForContact: state.pseudo,
        isAuth: state.userId !== null,
        roomName: state.roomName
    }
}

const mapDispatchToProps = dispatch => {
    return {
        //Handles the conversation details when the conversation changes
        roomNameHandler: (r, c, d) => dispatch(actions.roomNameHandler(r, c, d)),
        //Handles the contact details when the conversation changes
        contactDetails: (d) => dispatch(actions.contactDetails(d)),
        //Handles the avatar details
        photoHandler: (p) => dispatch(actions.photoHandler(p))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Conversations);