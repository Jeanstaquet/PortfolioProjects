import React from 'react';
import "./Conversation.scss";
import { Avatar } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import {Link} from "react-router-dom";
import {connect} from "react-redux"

const Conversation = (props) => {

    let component = (
        
        <div className="conversation__container" onClick={props.dispatchRoomName}>
            <Avatar className="conversation__avatar" src={props.photo}/>
            <Link to={`/app/${props.userId}/${props.roomname}`}>
            <div className="conversation__info">
                <p className="conversation__lastMessage">Room name: {props.roomname}</p>
                <p className="conversation__name">Contact: {props.name}</p>
            </div>
            </Link>
            <div className="conversation__menu">
        </div>

    </div>
    );

    if(props.addNewConv) {
        component = (
            <div className="conversation__addBox">
                <AddIcon className="conversation__add" onClick={props.click}/>
                <h4 className="conversation__addText">Add a new conversation</h4>
            </div>
        )
    }


    return (
        component
    );
};

const mapStateToProps = state => {
    return {
        userId: state.userId
    }
}

export default connect(mapStateToProps, null)(Conversation);