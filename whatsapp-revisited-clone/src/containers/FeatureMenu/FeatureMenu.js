import React, { useState } from 'react';
import "./FeatureMenu.css";
import Modal from "../../components/UI/Modal/Modal";
import ClearIcon from '@material-ui/icons/Clear';
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import * as actions from "../../store/action/index";
const FeatureMenu = (props) => {
    const [openModal, setOpenModal] = useState(false);
    const modalOpenHandler = () => {
        setOpenModal(true)
    }
    const modalCloseHandler = () => {
        setOpenModal(false)
    }

    return (

        <div className={props.open ? "featureMenu__container toggleMenu" : "featureMenu__container"}>
            {props.isAuth ? <Redirect to="/"/> : null}
            <div className="featureMenu__container2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Whatsapp_logo.svg" alt="whatsapp logo" className="featureMenu__WLogo"/>
                <ClearIcon className="feateMenu__clearIcon" onClick={props.toggle}/>
                <ul className="featureMenu__text">
                    <li onMouseOver={() => modalOpenHandler()} onMouseLeave={() => modalCloseHandler()}>Account</li>
                    <div className="featureMenu__accountModal">
                        <Modal 
                            openModal={openModal} 
                            title={"Account information"}
                            info1={"email"} data1={props.pseudo.email !== null ? props.pseudo.email : " "}
                            info2={"pseudo"} data2={props.pseudo.pseudo !== null ? props.pseudo.pseudo : " "}
                            info3={"password"} data3={props.pseudo.password !== null ? props.pseudo.password : " "}> </Modal>
                    </div>
                    <button onClick={props.logoutHandler}>LOGOUT</button>
                </ul>
                
            </div>

        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        pseudo: state.pseudo,
        isAuth: state.userId === null
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logoutHandler: () => dispatch(actions.logoutHandler())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeatureMenu);