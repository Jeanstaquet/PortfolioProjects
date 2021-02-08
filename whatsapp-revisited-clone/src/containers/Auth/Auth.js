import React, { useState } from 'react';
import { connect } from 'react-redux';
import "./Auth.css";
import TextField from '@material-ui/core/TextField';
import * as actions from "../../store/action/index";
import { Redirect } from 'react-router-dom';
//Quand l'ath à reussi, il faut aussi mettre le pseudo de la personne qui se connecte
const Auth = (props) => {
    const [email, setEmail] = useState("");
    const [pseudo, setPseudo] = useState("");
    const [password, setPassword] = useState("");
    const [method, setMethod] = useState("Register");
    const [errorMessage, setErrorMessage] = useState(false);

    const authCreateHandler = (e) => {
        e.preventDefault();
        //props.registerMethod();
        if(method ==="Login") {

        } else if(pseudo.length < 1 || email.length < 1 || password < 1) {
            setErrorMessage(true)
            setTimeout(() => {
                setErrorMessage(false)
            }, 5000)
        }
        let meth = true;
        if(method==="Login") {
            meth = false
        }
        
        props.auth(email, password, pseudo, meth);
    
    }

    const visitorAuth = () => {
        props.auth("admin@admin.com", "admin123456", false)
    }

    const switchMethod = () => {
        if(method === "Register") {
            //props.loginMethod();
            setMethod("Login");
        } else if (method === "Login") {
            setMethod("Register");
            //props.registerMethod();
        }
    }


    let redirect = true;
    if(props.isAuth) {
        redirect = <Redirect to="/app"/>
    }
    return (
        <div className="auth__background">
            {redirect}
            <div className="auth__container">
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Whatsapp_logo.svg" alt="whatsapp logo"/>
                <div className="authW__container">
                    <h2><span onClick={switchMethod} className={method==="Register" ? "auth__loginButton": null}>Login</span> or <span onClick={switchMethod} className={!(method==="Register") ? "auth__registerButton": null}>create a new account</span></h2>
                </div>
                <form className="authNormal__container">
                <h4>{method==="Register" ? "Create an account with your informations" : "Enter your information"}</h4>
                    {errorMessage ? <p className="error__message">You should include a pseudo, email and password</p> : null}
                    {props.message ? <p className="error__message">{props.message}</p> : null}
                    <TextField onChange={(e) => setEmail(e.target.value)}
                        id="filled-password-input"
                        label="Email"
                        type="email"
                        value={email}
                    />
                    {method==="Register" ? <TextField onChange={(e) => setPseudo(e.target.value)}
                        id="filled-password-input"
                        label="Pseudo"
                        type="name"
                        required
                        value={pseudo}
                    />: null}
                    <TextField onChange={(e) => setPassword(e.target.value)}
                        id="filled-password-input"
                        label="Password"
                        type="password"
                        value={password}
                    />
                    <button type="submit" onClick={authCreateHandler}>{method==="Register" ? "Create an account" : "Login"}</button>
                </form>
                <p className="aut__logVisitor" onClick={visitorAuth}>If you just want to visit the site: Log as an visitor</p>
            </div>
        </div>
    );
};

const mapStateToProps = state => {
    return {
        isAuth: state.token && true,
        userId: state.userId,
        message: state.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        auth: (e, p, pseudo, registred) => dispatch(actions.authEP(e, p, pseudo, registred)),
        authReset: () => dispatch(actions.authReset())
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Auth);