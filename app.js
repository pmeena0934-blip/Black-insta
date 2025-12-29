import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, doc, getDoc } 
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

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

const statusText = document.getElementById("monoStatus");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    statusText.innerText = "Login required";
    return;
  }

  const snap = await getDoc(doc(db, "users", user.uid));

  if (!snap.exists()) {
    statusText.innerText = "Profile not ready";
    return;
  }

  const u = snap.data();

  if (!u.isProfessional) {
    statusText.innerText = "❌ Professional account required";
  } else if (!u.isPublic) {
    statusText.innerText = "❌ Account must be public";
  } else {
    statusText.innerText =
      "⏳ Monetization coming soon. Complete criteria to unlock wallet.";
  }
});
