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
    const [modal, setModal] = useState(false); 
    const [conversationName, setConversationName] = useState("");
    const [fetchedConversations, setFetchecConversations] = useState([])
    const [contact, setContact] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [menuOpenClose, setMenuOpenClose] = useState(true);
    const [filterName, setFilterName] = useState("");
    const [onModifyPP, setOnModifyPP] = useState(false);
    const [filePP, setFilePP] = useState(null)

    const toggleModal = () => {
        setModal(true)
    }

    const toggleModalClose = (e) => {
        e.preventDefault();
        setModal(false)
    }

    const changeModalHandler = (e) => {
        setConversationName(e.target.value)
    }


    const changeContactHandler = (e) => {
        setContact(e.target.value)
    }

    const addConversationHandler = (e) => {
        e.preventDefault()
        if(contact.length === 0 || conversationName.length === 0) {
            setErrorMessage("You have to add an chat name and/or a valid pseudo name")
            setTimeout(() => {
                setErrorMessage("")
            }, 2500)
        } else {
            checkPseudo(contact)
        }

    }

    const checkPseudo = (name) => {
        db.collection("Users").where("pseudo", "==", name)
        .get()
        .then((querySnapshot) => {
            if(querySnapshot.empty) {
                setErrorMessage("This userd don't exist")
                setTimeout(() => {
                    setErrorMessage("")
                }, 2500)
            }
            querySnapshot.forEach(function(doc) {
                props.contactDetails(doc.data())
                db.collection("Users").doc(props.userId).collection("conversations").doc(conversationName).set({
                    name: conversationName,
                    contact: doc.data()

                })

                db.collection("Users").doc(doc.data().userId).collection("conversations").doc(conversationName).set({
                    name: conversationName,
                    contact: props.dataForContact
                })
                setConversationName("");
                setModal(false)
            });
        })
    }

    useEffect(() => {
        let unsubcribe = () => {

        }
        if(props.userId) {
            unsubcribe = db.collection("Users")
            .doc(props.userId)
            .collection("conversations")
            .onSnapshot(snapshot => setFetchecConversations(snapshot.docs.map((doc) => doc.data())))
        }
        
    
        return () => {
            unsubcribe()
        }
    
    }, [props.userId])


    const handleMenu = () => {
        setMenuOpenClose(!menuOpenClose)
    }

    const searchHandler = (e) => {
        setFilterName(e.target.value)
    }

    const newPPHandler = (e) => {
        e.preventDefault();
        if(filePP) {
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

    const handlerModalPP = () => {
        setOnModifyPP(!onModifyPP)
    }

    const setFilePPHandler = (event) => {
        setFilePP(event.target.files[0])
    }


    return (
        <div className="converstations__container" >
            <FeatureMenu toggle={handleMenu} open={menuOpenClose}/>
            <WhiteScreen hide={(props.roomName || onModifyPP || modal)}/>
            <Modal show={modal} 
                   click={toggleModalClose} 
                   change={changeModalHandler}
                   changeContact={changeContactHandler} 
                   ok={addConversationHandler}
                   errorMessage={errorMessage}/>
            <div className="conv__account">
                
                <Avatar className="conv__avatar" src={props.pseudo.photo}>{props.pseudo !== null ? props.pseudo.pseudo[0] : null}</Avatar>
                <AddIcon className="conversations__plusSign" onClick={handlerModalPP}/>
                <ImageModal 
                    changePP={true} 
                    submit={newPPHandler} 
                    show={onModifyPP}
                    closePP={handlerModalPP}
                    newFile={setFilePPHandler}/> 
                <button onClick={handleMenu}>MENU</button>
            </div>
            <div className="conv__searchBar">
                <input type="text" value={filterName} onChange={e => searchHandler(e)}/>
                <SearchIcon className="conv__glass"/>
            </div>
            <div className="conv__list">
                <Conversation addNewConv={true} click={toggleModal}/>
                {fetchedConversations.filter(name => name.name.includes(filterName)).map((conv, i) => {
                    return <Conversation key={i} 
                                         name={conv.contact.pseudo} 
                                         roomname={conv.name}
                                         photo={conv.contact.photo}
                                         dispatchRoomName={() => props.roomNameHandler(conv.name, conv.contact.pseudo, conv.contact)}/>
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
        roomNameHandler: (r, c, d) => dispatch(actions.roomNameHandler(r, c, d)),
        contactDetails: (d) => dispatch(actions.contactDetails(d)),
        photoHandler: (p) => dispatch(actions.photoHandler(p))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Conversations);