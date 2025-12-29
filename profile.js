// 🔹 Firebase core
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// 🔹 Firestore
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// 🔹 Storage
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

// 🔹 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyC_WIMVeD5zvzNaUGWW48IbNrAl4vOwCSY",
  authDomain: "black-insta-3cbb9.firebaseapp.com",
  projectId: "black-insta-3cbb9",
  storageBucket: "black-insta-3cbb9.appspot.com",
  messagingSenderId: "69596985964",
  appId: "1:69596985964:web:f5d83a8d1664a91d427649"
};

// 🔹 Init
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// 🔹 AUTH + USER INIT
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("Please login first");
    return;
  }

  // show email
  document.getElementById("userEmail").innerText =
    "Logged in as: " + user.email;

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  // create user if not exists
  if (!snap.exists()) {
    await setDoc(userRef, {
      email: user.email,
      followers: 0,
      following: 0,
      isPublic: true,
      isProfessional: false
    });
  }

  const userData = (await getDoc(userRef)).data();

  // set toggles
  document.getElementById("publicToggle").checked = userData.isPublic;
  document.getElementById("proToggle").checked = userData.isProfessional;

  // 🔹 LIVE FOLLOWERS COUNT
  onSnapshot(
    query(collection(db, "follows"), where("followingId", "==", user.uid)),
    (snap) => {
      document.getElementById("followersCount").innerText = snap.size;
      updateDoc(userRef, { followers: snap.size });
    }
  );

  // 🔹 LIVE FOLLOWING COUNT
  onSnapshot(
    query(collection(db, "follows"), where("followerId", "==", user.uid)),
    (snap) => {
      document.getElementById("followingCount").innerText = snap.size;
      updateDoc(userRef, { following: snap.size });
    }
  );

  // 🔹 PUBLIC / PRIVATE TOGGLE
  document.getElementById("publicToggle").addEventListener("change", async (e) => {
    await updateDoc(userRef, { isPublic: e.target.checked });
    document.getElementById("privacyMsg").innerText =
      e.target.checked ? "Account is Public 🔓" : "Account is Private 🔒";
  });

  // 🔹 PROFESSIONAL TOGGLE
  document.getElementById("proToggle").addEventListener("change", async (e) => {
    await updateDoc(userRef, { isProfessional: e.target.checked });
    document.getElementById("proMsg").innerText =
      e.target.checked
        ? "Professional Account Enabled ✅"
        : "Professional Account Disabled ❌";
  });
});

// 🔹 UPLOAD POST
document.getElementById("uploadBtn").addEventListener("click", async () => {
  const file = document.getElementById("file").files[0];
  if (!file) return alert("Select a file");

  const user = auth.currentUser;
  if (!user) return alert("Login required");

  const storageRef = ref(storage, `posts/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  await addDoc(collection(db, "posts"), {
    userId: user.uid,
    userEmail: user.email,
    mediaUrl: url,
    createdAt: profile.js.
  });

  document.getElementById("uploadMsg").innerText = "Post uploaded ✅";
});// 🔹 ADD STORY
document.getElementById("storyBtn").addEventListener("click", async () => {
  const file = document.getElementById("storyFile").files[0];
  if (!file) return alert("Select story file");

  const user = auth.currentUser;
  if (!user) return alert("Login required");

  const storyRef = ref(storage, `stories/${Date.now()}_${file.name}`);
  await uploadBytes(storyRef, file);
  const url = await getDownloadURL(storyRef);

  const now = new Date();
  const expire = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  await addDoc(collection(db, "stories"), {
    userId: user.uid,
    userEmail: user.email,
    mediaUrl: url,
    createdAt: serverTimestamp(),
    expiresAt: expire
  });

  document.getElementById("storyMsg").innerText = "Story added ⏱";
});
