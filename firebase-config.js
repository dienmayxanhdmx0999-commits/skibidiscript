// Cấu hình Firebase - dùng chung cho chat.js
const firebaseConfig = {
  apiKey: "AIzaSyDHyuP7FcF8SqOXsoyTeYnAvJbk0Uunq0c",
  authDomain: "chatting-74814.firebaseapp.com",
  databaseURL: "https://chatting-74814-default-rtdb.firebaseio.com",
  projectId: "chatting-74814",
  storageBucket: "chatting-74814.firebasestorage.app",
  messagingSenderId: "520016594870",
  appId: "1:520016594870:web:df652fe9a0fd68dc7e6317",
  measurementId: "G-7HWYC4HCDT"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
