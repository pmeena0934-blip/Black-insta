import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC_WIMVeD5zvzNaUGWW48IbNrAl4vOwCSY",
  authDomain: "black-insta-3cbb9.firebaseapp.com",
  projectId: "black-insta-3cbb9",
  storageBucket: "black-insta-3cbb9.appspot.com",
  messagingSenderId: "69596985964",
  appId: "1:69596985964:web:f5d83a8d1664a91d427649"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const chatBox = document.getElementById("chatBox");
const sendBtn = document.getElementById("sendBtn");
const msgInput = document.getElementById("msgInput");

// ⚠️ TEMP: demo chatId (next step me dynamic hoga)
const chatId = "global-chat";

onAuthStateChanged(auth, (user) => {
  if (!user) return;

  // Listen messages
  const q = query(
    collection(db, "messages"),
    where("chatId", "==", chatId),
    orderBy("createdAt")
  );

  onSnapshot(q, (snap) => {
    chatBox.innerHTML = "";
    snap.forEach(doc => {
      const m = doc.data();
      chatBox.innerHTML += `
        <p><b>${m.senderId === user.uid ? "Me" : "User"}:</b> ${m.text}</p>
      `;
    });
    chatBox.scrollTop = chatBox.scrollHeight;
  });

  // Send message
  sendBtn.onclick = async () => {
    if (msgInput.value.trim() === "") return;

    await addDoc(collection(db, "messages"), {
      chatId: chatId,
      senderId: user.uid,
      text: msgInput.value,
      createdAt: serverTimestamp()
    });

    msgInput.value = "";
  };
});
