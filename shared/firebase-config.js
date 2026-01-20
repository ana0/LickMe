// Firebase Configuration
// IMPORTANT: The actual config values should be in firebase-config.private.js
// Load firebase-config.private.js BEFORE this file in your HTML
// Example: <script src="../shared/firebase-config.private.js"></script>

// Use config from private file if available, otherwise use placeholder values
const firebaseConfig = window.FIREBASE_CONFIG_PRIVATE || {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Warn if using placeholder values
if (!window.FIREBASE_CONFIG_PRIVATE) {
  console.warn('⚠️ Firebase config not found! Create firebase-config.private.js with your project credentials.');
}

// Initialize Firebase and sign in anonymously
async function initFirebase() {
  firebase.initializeApp(firebaseConfig);
  try {
    await firebase.auth().signInAnonymously();
    console.log('Signed in anonymously');
    return true;
  } catch (error) {
    console.error('Auth error:', error);
    return false;
  }
}


// Shared constants
const CONFIG = {
  // Artwork API endpoints
  ARTWORKS: [
    "https://isthisa.computer/api/lickworks/1",
    "https://isthisa.computer/api/lickworks/2",
    "https://isthisa.computer/api/lickworks/3",
    "https://isthisa.computer/api/lickworks/4",
    "https://isthisa.computer/api/lickworks/5",
    "https://isthisa.computer/api/lickworks/6",
    "https://isthisa.computer/api/lickworks/7",
    "https://isthisa.computer/api/lickworks/8",
    "https://isthisa.computer/api/lickworks/9",
    "https://isthisa.computer/api/lickworks/10"
  ],

  // Timing
  ARTWORK_CYCLE_MS: 60000, // 60 seconds
  PIXEL_CLEANUP_AGE_MS: 15000, // Clean pixels older than 15 seconds

  // Visual settings
  PIXEL_SIZE: 4,
  WHITE_TO_BLACK_MS: 5000,
  BURN_THROUGH_MS: 10000
};
