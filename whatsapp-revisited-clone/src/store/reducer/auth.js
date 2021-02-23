const initalState = {
    token: null,
    userId: null,
    expirationTime: null,
    pseudo: {userId: ".",
             email: ".",
             pseudo: ".",
             password: ".",
             timestamp: ".",
             photo: null},
    name: null,
    photo: null, 
    isAdmin: false,
    loading: false,
    error: null, 
    isNew: null,
    roomName: null, 
    contact: null,
    fail: false,
    contactDetails: {userId: ".",
    email: ".",
    pseudo: ".",
    password: ".",
    timestamp: ".",
    photo: null}
}

const reducer = (state = initalState, action) => {
    switch(action.type) {
        //Start the auth process
        case "AUTH_START":
            return {
                ...state,
                loading: true,
                error: null
            }
        //Auth process is validated
        case "AUTH_SUCCESS": 
            return {
                ...state,
                token: action.token,
                userId: action.userId,
                expirationTime: action.expirationTime,
                loading: false,
            }
        //Auth process fail
        case "AUTH_FAIL":
            return {
                ...state,
                error: action.message,
            }
        //Reset the auth state
        case "AUTH_RESET":
            return {
                ...state,
                fail: false,
                error: null
            }
        //Logout handler
        case "LOGOUT":
            return {
                ...state,
                token: null,
                userId: null,
                expirationTime: null,
            }

        //If the user is a new user
        case "LOGIN_METHOD":
            return {
                ...state,
                isNew: false
            }
        //If the user is a new user
        case "REGISTER_METHOD":
            return {
                ...state,
                isNew: true
            }
        
        //Manage infos for the sign in/up process
        case "SIGN_WITH_GOOGLE":
            return {
                ...state,
                token: action.token,
                userId: action.userId,
                photo: action.photo,
                loading: false,
                expirationTime: 60,
                isNew: action.isNew, 
                email: action.email
            }
        //Manages the info for the current chat room
        case "ROOM_NAME_HANDLER":
            return {
                ...state,
                roomName: action.roomName,
                contact: action.contact, 
                contactDetails: action.details
            }
        //Delete the current chat room
        case "ROOM_DELETE_HANDLER": 
            return {
                ...state,
                roomName: null,
                contact: null,
                contactDetails: {userId: ".",
                email: ".",
                pseudo: ".",
                password: ".",
                timestamp: ".",
                photo: null}
            }
        //State for the contact data of a room
        case "CONTACT_DATA":
            return {
                ...state,
                contactDetails: action.details
            }
        //Manages the state for the pseudo
        case "PSEUDO_HANDLER":
            return {
                ...state,
                pseudo: action.pseudo
            }
        //Manages the state for the logout features
        case "LOGOUT_HANDLER":
            return {
                ...state,
                token: null,
                userId: null,
                expirationTime: null,
                pseudo: {userId: ".",
                         email: ".",
                         pseudo: ".",
                         password: ".",
                         timestamp: "."},
                name: null,
                photo: null, 
                isAdmin: false,
                loading: false,
                error: null, 
                isNew: null,
                roomName: null, 
                contact: null,
                fail: false,
                contactDetails: null
            }
        //Manages the photo of the user
        case "PHOTO_HANDLER": 
            return {
                ...state,
                pseudo: {
                    ...state.pseudo,
                    photo: action.photo
                }
            }
        default: 
            return {
                ...state
            }
    }
}

export default reducer;