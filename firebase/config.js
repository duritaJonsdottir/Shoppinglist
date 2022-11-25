
// import * as firebase from 'firebase';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBMRCEGdwEnfTa_3MezXRyEA0NEJSdEnf8",
  authDomain: "shoppinglistduritaliv.firebaseapp.com",
  databaseURL: "https://shoppinglistduritaliv.firebaseio.com",
  projectId: "shoppinglistduritaliv",
  storageBucket: "",
};
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();