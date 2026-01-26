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
  // Each set is a triptych (3 images shown left to right)
 ARTWORK_SETS: [
    [
      "/collections/3/img-01.png",
      "/collections/3/img-02.png",
      "/collections/3/img-03.png",
    ],
    [
      "/collections/5/img-01.png",
      "/collections/5/img-02.png",
      "/collections/5/img-03.png",
    ],
    [
      "/collections/6/img-01.png",
      "/collections/6/img-02.png",
      "/collections/6/img-03.png",
    ],
    [
      "/collections/7/img-01.png",
      "/collections/7/img-02.png",
      "/collections/7/img-03.png",
    ],
    [
      "/collections/9/img-01.png",
      "/collections/9/img-02.png",
      "/collections/9/img-03.png",
    ],
  ],

  // Timing
  OBJKT_POLL_INTERVAL_MS: 5000, // Poll Objkt.com every 5 seconds for sales
  PIXEL_CLEANUP_AGE_MS: 15000, // Clean pixels older than 15 seconds

  // Objkt.com API
  OBJKT_GRAPHQL_ENDPOINT: 'https://data.objkt.com/v3/graphql',

  // Visual settings
  PIXEL_SIZE: 4,
  WHITE_TO_BLACK_MS: 5000,
  BURN_THROUGH_MS: 10000
};
