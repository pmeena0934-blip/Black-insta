import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot
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
const db = getFirestore(app);

const storiesDiv = document.getElementById("stories");
const now = new Date();

const q = query(
  collection(db, "stories"),
  where("expiresAt", ">", now)
);

onSnapshot(q, (snap) => {
  storiesDiv.innerHTML = "";
  snap.forEach(doc => {
    const s = doc.data();
    storiesDiv.innerHTML += `
      <div style="margin:10px;border-bottom:1px solid #333">
        <p>${s.userEmail}</p>
        <img src="${s.mediaUrl}" width="100%" />
      </div>
    `;
  });
});
