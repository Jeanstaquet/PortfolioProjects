import React from 'react';
import "./Backdrop.scss";

const Backdrop = (props) => {
    return (
        <div className="backdrop__container" style={{display: props.show ? "block" : "none"}} onClick={props.click}>
            
        </div>
    );
};

export default Backdrop;