/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { type PropsWithChildren } from 'react';
import {
  StyleSheet,
} from 'react-native';


import Shoppinglist from './Pages/Shoppinglist';
import Recipies from './Pages/Recipies';

import { Button, Pressable, Input, IconButton, Checkbox, Box, VStack, HStack, Heading, Text, Center, useToast, NativeBaseProvider } from "native-base";

import Icon from 'react-native-vector-icons/FontAwesome';
import { useEffect } from 'react';
import { db } from "./firebase/config.js";
const { convert } = require('convert');



const App = () => {
  const [selected, setSelected] = React.useState(1);
  const [recipies, setRecipies] = React.useState([]);
  const [list, setList] = React.useState([]);

  useEffect(() => {// When list changes, we update database
    // Update database
    db.collection('shoppinglist').doc('PvybugXUxOtFxi2j5SMx').set({ "recipies": recipies, "shoplist": list });

    // This lines adds to firebase
    // db.collection('user_recipes').doc(' PvybugXUxOtFxi2j5SMx').set({ "Carbonara": Carbonara, "Pasta Bolognese": PastaBolognese});
  }, [list]);


  useEffect(() => {// Runs when starting page up
    // Load data
    db.collection('shoppinglist')
      .doc('PvybugXUxOtFxi2j5SMx') // My userid
      .get()
      .then(documentSnapshot => {
        setRecipies(documentSnapshot.data()["recipies"])
        setList(documentSnapshot.data()["shoplist"])
      })
      .catch(error => {
        if (error instanceof TypeError) {
          return null;
        }
        throw error;
      })

  }, []);



  const addrecipieToList = (recipie) => {
    console.log(recipie)
    // let user = 'I9VH80v5RZE2z3KApD3m'
    let recipiename = Object.keys(recipie)[0] // Get name of recipie

    ////// Add all items //////
    for (var i = 0; i < recipie[recipiename].length; i++) {
      let res = recipie[recipiename][i]
      res["recipie"] = recipiename
      addItem(res)
    }

    ////// Update recipies //////
    // If recipies is already in list t recipies
    const alredyexists: boolean = recipies.some(item => item === recipiename);
    if (alredyexists == false) { // If does not exist, then add

      setRecipies(prevsRecipies => {
        return [...prevsRecipies,
          recipiename
        ];
      })

    }
    else { // What should happen if already exist?
      console.log("MAYBE THIS IS THE PROBLEM")
    }
  }



  const addItem = (groceryitem) => { // Add single item to list
    let myList = [...list];
    // Check if grocery already exists in list
    const alredyexists: boolean = list.some(item => groceryitem.grocery.toLowerCase() === item.name.toLowerCase());

    // If grocery does not already exists in list, then add it to list
    if (alredyexists == false) {
      console.log("Grocery does not exist")
      setList(prevList => {
        return [...prevList, {
          name: groceryitem.grocery,
          unit: groceryitem.unit,
          amount: parseInt(groceryitem.amount),
          showList: false,
          valList: [{ amount: parseInt(groceryitem.amount), unit: groceryitem.unit, recipie: groceryitem.recipie ? groceryitem.recipie : "" }]
        }];
      });

    } else { // If grocery already exists in list then merge
      // We need to figure out how to join the existing value and the new added values
      console.log("Grocery does exist")

      let index = myList.findIndex(obj => obj.name.toLowerCase() === groceryitem.grocery.toLowerCase()) // Get the aready existing value

      // Add new grocery to valslist
      myList[index].valList = myList[index].valList.concat({ amount: parseInt(groceryitem.amount), unit: groceryitem.unit, recipie: groceryitem.recipie ? groceryitem.recipie : "" })
      setList(myList)
      // Then update the total amount and unit
      updateFromNewValslist(index)
    }
  };

  const updateFromNewValslist = (index: number) => {
    // Each grocery in the grocerylist contains a valslist containing all the added grocery (E.g. if we have added Milk twice). 
    // This functions then updates the total amount of milk we need from the added items.

    let myList = [...list];
    // If vallist is emtpy then remove
    myList = myList.filter(function (item, itemI) {
      return item.valList.length > 0
    })

    if (list.length > 0) {

      if (index === null) { // If no specific index, then update all
        for (var k = 0; k < myList.length; k++) {

          // If vList is empty then remove grocery
          if (myList[k].valList === undefined || myList[k].valList.length === 0) {

            myList.filter(function (item, itemI) {
              return itemI !== k
            })

          } else { // Else if valList is not emtpy, then update
            // Get vallist
            let vList = myList[k].valList
            let a = 0

            // Go through list
            for (var i = 0; i < vList.length; i++) {

              // If the units in vallist are not the same as the main unit 
              if ((vList[i].unit.toLowerCase() != list[index].unit.toLowerCase()) || vList[i].unit === "") {
                // then convert the units to the main and add new amount

                //let newa = converter.volume(parseInt(vList[i].amount)).from(vList[i].unit.toLowerCase()).to(list[index].unit.toLowerCase()).value
                let newa = convert(parseInt(vList[i].amount), vList[i].unit.toLowerCase()).to(list[index].unit.toLowerCase())
                a = a + newa


              } else { // If the units are the same, then just add the amount
                a = a + parseInt(vList[i].amount)
              }

            }


            myList[index].amount = a
          }
        }
        setList(myList)

      } else {  // If specific index,
        // Get vallist
        let vList = myList[index].valList ? myList[index].valList : []
        let a = 0

        // Go through list
        for (var i = 0; i < vList.length; i++) {

          // If the units in vallist are not the same as the main unit 
          if ((vList[i].unit.toLowerCase() != list[index].unit.toLowerCase())) {
            // then convert the units to the main and add new amount

            //let newa = converter.volume(parseInt(vList[i].amount)).from(vList[i].unit.toLowerCase()).to(list[index].unit.toLowerCase()).value
            let newa = convert(parseInt(vList[i].amount), vList[i].unit.toLowerCase()).to(list[index].unit.toLowerCase())
            a = a + newa

          } else if (vList[i].unit === "") { // If unit is empty then just add amount
            a = a + parseInt(vList[i].amount)
          } else { // If the units are the same, then just add the amount
            a = a + parseInt(vList[i].amount)
          }

        }
        myList[index].amount = a
      }

    }
    setList(myList)

  }



  return (
    <NativeBaseProvider >

      {selected === 0 ? <Recipies addrecipieToList={addrecipieToList} /> : selected === 1 ? 
                        <Shoppinglist 
                              list={list} 
                              setList={setList} 
                              recipies={recipies} 
                              setRecipies={setRecipies} 
                              addrecipieToList={addrecipieToList} 
                              addItem={addItem} /> : 
                              <NativeBaseProvider>
                                <Box backgroundColor="#13131A" w="100%" h="100%">

                                </Box>
                              </NativeBaseProvider> }

      <Box style={navBar.bottomContainer} bg="#13131A" safeAreaTop width="100%" maxW="500px" alignSelf="center">
        <HStack width="90%" alignSelf="center" style={{ marginBottom: 10, borderRadius: 40 }} bg="#1C1C24" alignItems="center" safeAreaBottom shadow={6}>
          <Pressable opacity={selected === 0 ? 1 : 0.5} py="3" flex={1} onPress={() => setSelected(0)}>
            <Center>
              {/* <Icon mb="1" as={<MaterialCommunityIcons name={selected === 0 ? 'home' : 'home-outline'} />} color="white" size="sm" /> */}
              <Icon name="home" size={25} color="white" />
            </Center>
          </Pressable>
          <Pressable opacity={selected === 1 ? 1 : 0.5} py="2" flex={1} onPress={() => setSelected(1)}>
            <Center>
              {/* <Icon mb="1" as={<MaterialIcons name="search" />} color="white" size="sm" /> */}
              <Icon name="plus" size={25} color="white" />
            </Center>
          </Pressable>
          <Pressable opacity={selected === 2 ? 1 : 0.6} py="2" flex={1} onPress={() => setSelected(2)}>
            <Center>
              {/* <Icon mb="1" as={<MaterialCommunityIcons name={selected === 2 ? 'cart' : 'cart-outline'} />} color="white" size="sm" /> */}
              <Icon name="filter" size={25} color="white" />
            </Center>
          </Pressable>
          <Pressable opacity={selected === 3 ? 1 : 0.5} py="2" flex={1} onPress={() => setSelected(3)}>
            <Center>
              {/* <Icon mb="1" as={<MaterialCommunityIcons name={selected === 3 ? 'account' : 'account-outline'} />} color="white" size="sm" /> */}
              <Icon name="bell" size={25} color="white" />
            </Center>
          </Pressable>
        </HStack>
      </Box>
    </NativeBaseProvider>
  );
};



const navBar = StyleSheet.create({
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    maxHeight: 70,
  }
})

export default App;
