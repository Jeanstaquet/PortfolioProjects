# Project: Whatsapp-clone
This project is a clone of what's app web. It has all the most important features of the real whats'app app.

_info: The link of the app is available on request as it does not have a back-end to protect data transactions (even if with firebase, transactions could remain in front-end)._

# Features!
Here is a list, the details of each feature are further down in the file
- Mainly the same IU as the original Whats'app
- Create an account 
- Talk to whoever you want
- You can send files in the chat 
- Change your profile picture
- Creation/deletion of chat rooms
- Being improved: recording of audio messages & adding a backend

### Tech
This project uses mainly Javascript, the react library, npm packages and firebase.

- [React](https://reactjs.org/) - The whole front-end structure of the app is based on React
  - [React Router DOM](https://reactrouter.com/web/guides/quick-start) - This special package for react app made it possible to do the routing
- [Firestore](https://firebase.google.com/docs/firestore) - NoSQL cloud database from firebase. This database is very quick and easy to use. It also allows to leave the fetching code of the databases in the front-end.
- [Redux](https://redux.js.org/) - Redux, this has made it possible to be a data layer for the application. For this application it may be an overkill, but `redux` offers very user-friendly debugging tools. I will replace the `redux` code with a React `useReducer` later on.
- [Material-UI](https://material-ui.com/) - React components for web development
- [axios](https://github.com/axios/axios) - Promise based HTTP client for the browser

### Installation
To run this project, install it locally using npm:
```
$ cd ../lorem
$ git clone [url]
$ npm install
$ npm start
```

### Overview
On the link below, I make a short presentation of the main features of the app.
I create two different profiles. Then I change the profile picture, write messages in the chat and share a picture. Finally I log out of the application. 

Follow this link => https://firebasestorage.googleapis.com/v0/b/whatsappclone-46523.appspot.com/o/images%2FPres.gif?alt=media&token=24a79444-f910-4758-a07d-4e7b0543291f

#### If you can't see the video, here are two previews of the app:
Auth page:
![Auth](https://firebasestorage.googleapis.com/v0/b/whatsappclone-46523.appspot.com/o/images%2FPhoto%20de%20premier%20plan.PNG?alt=media&token=a0bdb643-0c5f-468c-a41a-3f08f22eba7a)

Main page :
![Main](https://firebasestorage.googleapis.com/v0/b/whatsappclone-46523.appspot.com/o/images%2FPhoto-conversation.PNG?alt=media&token=0c576216-91f7-4978-889c-33994535279e)

### Coding techniques, How to: Firebase
For the data, auth, and storage i decided to use [Firebase](https://firebase.google.com/). It allows you to listen to data changes, send data, or store files in a few lines of code. Moreover FB is very fast, it is a good solution for smaller applications like this one.
Here are short snippets that do most of the work :
#### Listen for data
To fetch firebase data in real time :

```js
const getData = () => {
    if(props.userId) {
        db.collection("Users")
        .doc(props.userId)
        .collection("conversations")
        //Listen for changes
        .onSnapshot(snapshot => setFetchecConversations(snapshot.docs.map((doc) => doc.data())))
    }
}

useEffect(() => {
    getData()  

    return () => {
        getData()   
    }

}, [props.userId])
```
This method makes it possible to listen to the change of data in the database. At the slightest change, the listener fetches the data. However, do not forget to put the function in `componentWillUnmount` which the return statement of the hook `useEffect()`.

#### Send data to Firebase
To send data in real time:

```js
db
    .collection("Users")
    .doc(props.userId)
    .collection("conversations")
    .doc(props.roomName)
    .collection("messages")
    .add({
        message: mess,
        //Server timestamp hour provided by firebase
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        sender: props.pseudo.pseudo
    })
```

#### Handling files with Firebase
To send data into Firebase, nothing could be simpler, just specify the documents and collections to target, and it adds the data. We can also add the variable of firebase timestamp to be regular in the format of the date and time used for the data.

First we need to handle the file in the state (here it is pure JS):
```js
    const fileHandler = (event) => {
        if(event.target.files[0]) {
            if(event.target.files[0].type === "image/jpeg" || event.target.files[0].type === "image/png") {
                setFileSend(event.target.files[0])
            } else {
                setFileError(true) 
                event.target.value = null
            }
        }
    }
```

Then it is sent to Firebase:
```js
const fileUploadHandler = () => {
    //First we create a reference in the firebase storage
    storage.ref(`images/${fileSend.name}`).put(fileSend);
    
    //Then we send the file and get back the URL
    storage
    .ref("images")
    .child(fileSend.name)
    //Get the url to use the image
    .getDownloadURL()
    .then(url => {
        //Put the url in firestore
        db
        .collection("Users")
        .doc(props.userId)
        .collection("conversations")
        .doc(props.roomName)
        .collection("messages")
        .add({
            message: "img",
            imgUrl: url,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            sender: props.pseudo.pseudo
        })
    })}
```
To store a file you must have the file in the state. Then, we create a reference in the firebase storage. Then we send the file to the storage and store the URL to the file in the database to be able to use the image afterwards.


### Last one: Handle auth with firebase
```js
const authData = {
    email: email,
    password: password, 
    returnSecureToken: true}
//used to signIn 
const url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAetezyzd_TAHEUZlwBR7FgJKY7vieoebY";
//There is a different URL to signUp
axios.post(url, authData)
    .then(res => {
        if(isRegister) {
            //Create an entry in the db for the user
            db.collection("Users").doc(res.data.localId).set({
                userId: res.data.localId,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                email: email,
                pseudo: pseudo,
                password: password,
                profilePhoto: "."
            });
        }
    
```

### Inspiration
I got the idea from watching a youtube video from [Clever Programmer](https://www.youtube.com/watch?v=pUxrDcITyjg&ab_channel=CleverProgrammer). However, no code was copied, and I 100% created my own project structure.

