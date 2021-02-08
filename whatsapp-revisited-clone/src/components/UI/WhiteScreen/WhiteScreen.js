import React, { useEffect } from 'react';
import "./WhiteScreen.css";

const WhiteScreen = (props) => {
    return (
        <div className={!props.hide ? "whiteScreen__container" : "whiteScreen__container transform"}>
            <div className="whiteScreen__content">
                <h2 className="WhiteScreen__title">Begin a new conversation</h2>
                <p className="WhiteScreen__title">By clicking here:</p>
                <img classname="BeginPhoto" src="https://firebasestorage.googleapis.com/v0/b/whatsappclone-46523.appspot.com/o/images%2FAddConv.PNG?alt=media&token=93d783aa-1013-4953-9ad3-b46ae34aa06c" alt=""/>
                <p className="WhiteScreen__title">OR</p>
                <h2 className="WhiteScreen__title">Select one of your conversation</h2>
                <p className="WhiteScreen__title">By clicking here:</p>
                <img src="https://firebasestorage.googleapis.com/v0/b/whatsappclone-46523.appspot.com/o/images%2Fadd.PNG?alt=media&token=2ed8aa96-5769-4370-badf-b0d816e23861" className="EndPhoto"/>
                <img className="WhatsappLogo" src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Whatsapp_logo.svg" alt="whatsapp logo"/>
            </div>
        </div>
    );
};

export default WhiteScreen;