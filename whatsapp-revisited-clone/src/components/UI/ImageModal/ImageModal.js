import React, { useRef, useState } from 'react';
import "./ImageModal.scss";

const ImageModal = (props) => {
    let modal = null;
    if(props.image === true) {
        modal = <div className={props.show ? "imageModal__container" : "hide"}>
            <div className="imageModal__imgContainer">
                <img src={props.imgUrl} alt=""/>
                <span onClick={props.close}>X</span>
            </div>
        </div>
    } else if (props.changePP === true) {
        modal = 
        <div className={props.show ? "imageModalChangePP__container" : "hide"}>
            <span className="imageModalChangePP__close" onClick={props.closePP}>X</span>
            <h2 className="imageModal__title">You can upload a new profile avatar:</h2>
            <form className="">
                <input type="file" onChange={props.newFile}/>
                <button type="submit" onClick={props.submit}>Submit</button>
            </form>
        </div>
    } 

    return (
        <React.Fragment>
            {modal}
        </React.Fragment>

    );
};

export default ImageModal;