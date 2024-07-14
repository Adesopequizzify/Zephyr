import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { db } from './firebase.js'; // Import the db instance

const auth = getAuth();

async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    await handleNewUser(user);
    displayUserInfo(user);
  } catch (error) {
    console.error('Error signing in with Google:', error);
  }
}

async function signInWithFacebook() {
  const provider = new FacebookAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    await handleNewUser(user);
    displayUserInfo(user);
  } catch (error) {
    console.error('Error signing in with Facebook:', error);
  }
}

async function handleNewUser(user) {
  const userDoc = doc(db, 'users', user.uid);
  const userSnapshot = await getDoc(userDoc);
  if (!userSnapshot.exists()) {
    await setDoc(userDoc, {
      balance: 0,
      level: 1,
      roundProgress: 0,
    });
  }
}

function displayUserInfo(user) {
  const userInfoContainer = document.querySelector('.user-info-container');
  userInfoContainer.innerHTML = `<p>Welcome, ${user.displayName}</p>`;
}

export { auth, signInWithGoogle, signInWithFacebook, displayUserInfo };