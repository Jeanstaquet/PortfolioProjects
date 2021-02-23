import axios from "axios";
import db from "../../firebase";
import firebase from "firebase";

//Start the auth process
export const authStart = () => {
    return {
        type: "AUTH_START"
    }
}

//Auth process is validated
export const authSuccess = (token, userId, expirationTime) => {
    return {
        type: "AUTH_SUCCESS",
        token: token,
        userId: userId,
        expirationTime: expirationTime
    }
}

//Auth process fail
export const authFail = (message) => {
    return {
        type: "AUTH_FAIL",
        message: message
    }
}

//Logout handler
export const logout = () => {
    return {
        type: "LOGOUT"
    }
}

//Reset the auth flow
export const authReset = () => {
    return {
        type: "AUTH_RESET"
    }
}

//Manages the state for the pseudo
export const pseudoHandler = (pseudo) => {
    return {
        type: "PSEUDO_HANDLER",
        pseudo: pseudo
    }
}

//Manages the auth with firebase
export const authEP = (email, password, pseudo, isRegister) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            email: email,
            password: password, 
            returnSecureToken: true
        }
        let url = ""
        //Changes the url depending if the user is already registered
        if(isRegister) {
            url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAetezyzd_TAHEUZlwBR7FgJKY7vieoebY";

        }
        
        if(!isRegister) {
            url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAetezyzd_TAHEUZlwBR7FgJKY7vieoebY"
        }
        //Send the request to auth 
        axios.post(url, authData)
            .then(res => {
                if(isRegister) {
                    db.collection("Users").doc(res.data.localId).set({
                        userId: res.data.localId,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        email: email,
                        pseudo: pseudo,
                        password: password,
                        profilePhoto: "."
                    });
                }
                db.collection("Users").where("userId", "==", res.data.localId)
                .get()
                .then((querySnapShot) => {
                    querySnapShot.forEach(function(doc) {
                        dispatch(pseudoHandler(doc.data()))
                    })
                });
                
                dispatch(authSuccess(res.data.idToken, res.data.localId, 60))
            })
            .catch(error => {
                dispatch(authFail(error.response.data.error.message))
                setTimeout(() => {
                    dispatch(authReset())
                }, 5000);
        })
    }
}

//Manages the info for the current chat room
export const roomNameHandler = (roomName, contact, details) => {
    return {
        type: "ROOM_NAME_HANDLER",
        roomName: roomName,
        contact: contact,
        details: details
    }
}

//State for the contact data of a room
export const contactDetails = (details) => {
    return {
        type: "CONTACT_DATA",
        details: details
    }
}

//Manages the state for the logout features
export const logoutHandler = () => {
    return {
        type: "LOGOUT_HANDLER"
    }
}

//Delete the current chat room
export const roomDeleteHandler = () => {
    return {
        type: "ROOM_DELETE_HANDLER"
    }
}

//Manages the photo of the user
export const photoHandler = (photo) => {
    return {
        type: "PHOTO_HANDLER",
        photo: photo
    }
}