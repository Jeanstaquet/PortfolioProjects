import React from 'react';
import "./MenuContact.scss";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
const MenuContact = (props) => {
    return (
        <div className={props.show ? "menuContact__container" : "menuContact__container hideMenu"}>
            <ul className="menuContact__ul">
                <li className="menuContact__li" onClick={props.delete}><ArrowForwardIosIcon className="menuContact__arrow"/> Delete the conversation</li>
            </ul>
        </div>
    );
};

export default MenuContact;