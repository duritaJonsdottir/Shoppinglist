export function HelloChandu() {
    console.log("EHHLLO")
}

export function HelloTester() {
    console.log("EHHLLO")
}

import {
    ref,
    onValue,
    push,
    update,
    remove
} from 'firebase/database';

import { db } from "./firebase/config.js";

import { collection, doc, setDoc } from "firebase/firestore"; 

const citiesRef = collection(db, "user_recipies");

export function addrecipieToList(recipie) {
    console.log("EHHLLO")
    let user = 'I9VH80v5RZE2z3KApD3m'
    
    // const cityRef = db.collection('cities').doc(user);
    // const doc = cityRef.get();
    // if (!doc.exists) {
    //     console.log('No such document!');
    // } else {
    //     console.log('Document data:', doc.data());
    // }

    // // Get shoppinglist from database
    // db.collection('shoppinglist').get('I9VH80v5RZE2z3KApD3m').then(querySnapshot => {
    //     console.log('Total users: ', querySnapshot.size);

    //     querySnapshot.forEach(documentSnapshot => {
    //       // console.log('User ID: ', documentSnapshot.id);
    //       // console.log("shopping data: ", documentSnapshot.data())
    //       // console.log("shop list: ", documentSnapshot.data()["shoplist"])
    //       //setList(documentSnapshot.data()["shoplist"])
    //     });
    // });

    // Add recipie to list


    // Update database


}