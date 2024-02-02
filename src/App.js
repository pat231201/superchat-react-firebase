import logo from "./logo.svg";
import "./App.css";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { useState, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";
// import {getAuth,signInWithPopup,GoogleAuthProvider} from "firebase/auth"
firebase.initializeApp({
  apiKey: "AIzaSyBY9fwj5nGTlUsFE1NmW1ZXI2UtPe8Bey0",
  authDomain: "superchat-using-react-firebase.firebaseapp.com",
  projectId: "superchat-using-react-firebase",
  storageBucket: "superchat-using-react-firebase.appspot.com",
  messagingSenderId: "392015131315",
  appId: "1:392015131315:web:ac30bd0ff28b1a667376c6",
  measurementId: "G-5PV64VQ1ZF",
});
const auth = firebase.auth();
const firestore = firebase.firestore();
function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>

      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}
const SignIn = () => {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };
  return (
    <>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
      {/* <p>
        Do not violate the community guidelines or you will be banned for life!
      </p> */}
    </>
  );
};
const SignOut = () => {
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>Sign Out</button>
  );
};
const ChatRoom = () => {
  const dummy = useRef();
  const [formValue, setFormValue] = useState("");
  const messageRef = firestore.collection("messages");
  const query = messageRef.orderBy("createdAt").limit(25);
  const [messages] = useCollectionData(query, { idField: "id" });
  const sendMessage = async (e) => {
    const { uid, photoURL } = auth.currentUser;
    e.preventDefault();
    await messageRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });
    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
      <main>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        <span ref={dummy}></span>
      </main>
      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => {
            setFormValue(e.target.value);
          }}
        />
        <button type="submit" disabled={!formValue}>
          Submit
        </button>
      </form>
    </>
  );
};
const ChatMessage = (props) => {
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";
  return (
    <div className={`message${messageClass}`}>
      <img
        src={
          photoURL ||
          "https://api.adorable.io/avatars/23/abott@adorable.png" ||
          "https://www.flaticon.com/free-icon/user_13173762?term=user&page=1&position=7&origin=tag&related_id=13173762"
        }
      />
      <p>{text}</p>
    </div>
  );
};

export default App;
