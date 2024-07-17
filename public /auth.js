// auth.js

import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { doc, getDoc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { db } from './firebase.js'; // Import the db instance
import { showNotification, closeSignInPopup, updateUserUI } from './ui.js'; // Import showNotification, closeSignInPopup, and updateUserUI from UI.js

const auth = getAuth();

async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    await handleNewUser(user);
    displayUserInfo(user);

    // Show success message
    showNotification('Signed in successfully!');

    // Close the sign-in popup after successful sign-in
    closeSignInPopup();

    // Set up real-time listener for user data
    setupUserListener(user.uid);
  } catch (error) {
    console.error('Error signing in with Google:', error);
    showNotification('Failed to sign in. Please try again.');
  }
}

async function signInWithFacebook() {
  const provider = new FacebookAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    await handleNewUser(user);
    displayUserInfo(user);

    // Show success message
    showNotification('Signed in successfully!');

    // Close the sign-in popup after successful sign-in
    closeSignInPopup();

    // Set up real-time listener for user data
    setupUserListener(user.uid);
  } catch (error) {
    console.error('Error signing in with Facebook:', error);
    showNotification('Failed to sign in. Please try again.');
  }
}

async function handleNewUser(user) {
  const userDoc = doc(db, 'users', user.uid);
  const userSnapshot = await getDoc(userDoc);
  if (!userSnapshot.exists()) {
    await setDoc(userDoc, {
      displayName: user.displayName,
      userId: user.uid,
      balance: 1000, // Default balance for new users
      level: 1,
      dailyAirdropClaims: 0,
      session: new Date().toISOString(),
    });
  }
}

function displayUserInfo(user) {
  const userInfoContainer = document.querySelector('.user-info-container');
  userInfoContainer.innerHTML = `<p>Welcome, ${user.displayName}</p>`;
}

function setupUserListener(userId) {
  const userDoc = doc(db, 'users', userId);
  onSnapshot(userDoc, (doc) => {
    if (doc.exists()) {
      const userData = doc.data();
      updateUserUI(userData);
    }
  });
}

export { auth, signInWithGoogle, signInWithFacebook, displayUserInfo, setupUserListener };