import React, {type PropsWithChildren} from 'react';

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text as RNText,
    useColorScheme,
    View
} from 'react-native';

import { useState, useEffect } from 'react';
import SelectDropdown from 'react-native-select-dropdown'
import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { Button, Input, IconButton, Checkbox, Box, VStack, HStack, Heading, Text, Icon, Center, useToast, NativeBaseProvider } from "native-base";
// import { Feather, Entypo } from "@expo/vector-icons";

import FontAwesome, {
  SolidIcons,
  RegularIcons,
  BrandIcons,
  parseIconFromClassName,
} from 'react-native-fontawesome';

//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faAngleRight } from '@fortawesome/free-solid-svg-icons'

import { db } from "../firebase/config.js";
const {convert} = require('convert');
import ScrollPicker from 'react-native-wheel-scrollview-picker';
// import { addrecipieToList } from '../helpers.js';

import { doc, setDoc } from "firebase/firestore"; 


const Shoppinglist = () => {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };
    


    // Initialize 
    const boughtInstState: { name: string, unit: string, amount: number, showList: boolean, valList:{amount: number, unit: string, recipie:string}[]}[] = [];
    const [list, setList] = React.useState(boughtInstState);
    const [boughtlist, setBoughtList] = React.useState(boughtInstState);
    const [grocery, setGrocery] = React.useState("");
    const [amount, setAmount] = React.useState('');
    const [unit, setUnit] = React.useState("l");
    const [selIndex, setSelectedIndex] = React.useState(1)
    const units = ["dl", "l", "g", "kg"]

    // const recipie =
    //   {carbonara: 
    //     [
    //       {ingredient: "bacon",
    //       amount: 100,
    //       unit: "g"
    //       },
    //       {ingredient: "smør",
    //       amount: 1,
    //       unit: "tsk",
    //       },
    //       {ingredient: "løg, i tern",
    //       amount: 1,
    //       unit: "",
    //       },
    //       {ingredient: "piskefløde",
    //       amount: 1,
    //       unit: "dl",
    //       },
    //       {ingredient: "æg",
    //       amount: 2,
    //       unit: "",
    //       },
    //       {ingredient: "parmesan",
    //       amount: 50,
    //       unit: "g",
    //       },
    //       {ingredient: "sort peber, friskkværnet",
    //       amount: null,
    //       unit: "",
    //       },
    //     ],
    //   }
  
    
    useEffect(() => {// Runs when starting page up
      // Load data
      //console.log(converter.mass(1).from('lb').to('oz').value)
      console.log(convert(1, 'seconds').to('minutes'))
      // console.log(db.collection("shoppinglist").doc('I9VH80v5RZE2z3KApD3m').get())

      // Get shoppinglist from database
      db.collection('shoppinglist').get().then(querySnapshot => {
        console.log('Total users: ', querySnapshot.size);

        querySnapshot.forEach(documentSnapshot => {
          // console.log('User ID: ', documentSnapshot.id);
          // console.log("shopping data: ", documentSnapshot.data())
          // console.log("shop list: ", documentSnapshot.data()["shoplist"])
          setList(documentSnapshot.data()["shoplist"])
        });
      });
    },[]);


  

    const toast = useToast();

    
    // const addrecipieToList = (recipie) => {
    //   console.log("EHHLLO")
    //   let user = 'I9VH80v5RZE2z3KApD3m'
    //   console.log(user)
      
    //   const cityRef = db.collection('user_recipies').doc(user);
    //   console.log(cityRef)
    //   const doc = cityRef.get();
    //   if (!doc.exists) {
    //       console.log('No such document!');
    //   } else {
    //       console.log('Document data:', doc.data());
    //   }

    //   // // Get shoppinglist from database
    //   // db.collection('shoppinglist').get('I9VH80v5RZE2z3KApD3m').then(querySnapshot => {
    //   //     console.log('Total users: ', querySnapshot.size);

    //   //     querySnapshot.forEach(documentSnapshot => {
    //   //       // console.log('User ID: ', documentSnapshot.id);
    //   //       // console.log("shopping data: ", documentSnapshot.data())
    //   //       // console.log("shop list: ", documentSnapshot.data()["shoplist"])
    //   //       //setList(documentSnapshot.data()["shoplist"])
    //   //     });
    //   // });

    //   // Add recipie to list


    //   // Update database


    // }

    const addItem = () => { // Add single item to list
      
      // Check if grocery already exists in list
      const alredyexists : boolean = list.some(item => grocery.toLowerCase() === item.name.toLowerCase());
      
      // If grocery does not already exists in list, then add it to list
      if (alredyexists == false){
        setList(prevList => {
          return [...prevList, {
            name: grocery,
            unit: unit,
            amount: parseInt(amount),
            valList: [{amount: parseInt(amount), unit: unit, recipie: ""}]
          }];
        });
      }else{ // If grocery already exists in list then merge
        // We need to figure out how to join the existing value and the new added values
        let index = list.findIndex(obj => obj.name.toLowerCase() === grocery.toLowerCase()) // Get the aready existing value
        
        // Add new grocery to valslist
        list[index].valList = list[index].valList.concat({amount: parseInt(amount), unit: unit, recipie: ""})
        
        // Then update the total amount and unit
        updateFromNewValslist(index)
        
      }
    };


    const updateFromNewValslist = (index: number) => {
      // Each grocery in the grocerylist contains a valslist containing all the added grocery (E.g. if we have added Milk twice). 
      // This functions then updates the total amount of milk we need from the added items. 
      
      // Get vallist
      let vList = list[index].valList
      let a = 0

      // Go through list
      for (var i=0; i < vList.length; i++){
        
        // If the units in vallist are not the same as the main unit 
        if(vList[i].unit.toLowerCase() != list[index].unit.toLowerCase()){ 
          // then convert the units to the main and add new amount

          //let newa = converter.volume(parseInt(vList[i].amount)).from(vList[i].unit.toLowerCase()).to(list[index].unit.toLowerCase()).value
          let newa = convert(parseInt(vList[i].amount), vList[i].unit.toLowerCase()).to(list[index].unit.toLowerCase())
          a = a + newa
          
  
        }else{ // If the units are the same, then just add the amount
          a = a + parseInt(amount)
        }
        
      }

      list[index].amount = a
      // Optimize 
      // converter.volume(list[index].amount).from().toBest();
      // let opt = convert(list[index].amount).from(list[index].unit.toLowerCase()).toBest(); // optimal unit for amount
      // list[index].amount = Number(opt.val.toFixed(4)) // Set amount for optimal unit
      // list[index].unit = opt.unit // Set optimal unit

    }

    const handleDelete = (index:number) => {
      // When we delete items from shopping list
      setList(prevList => {
        const temp = prevList.filter((_, itemI) => itemI !== index);
        return temp;
      });
    };

    const handleBoughtDelete = (index:number) => {
      // When we delete from bought list
      setBoughtList(prevList => {
        const temp = prevList.filter((_, itemI) => itemI !== index);
        return temp;
      });
    };

    const handleStatusChange = (index:number) => {
      // When we check a checkbox in grocery list
      const value = list[index]
      
      // Move value down to bought list
      setBoughtList(prevList => {
        return [{
          name: value.name,
          unit: value.unit,
          amount: value.amount,
          showList: value.showList,
          valList: value.valList
        }, ...prevList];
      });

      // Then delete from shoppinglist
      handleDelete(index)
    };

    const showSubGrocery = (index:number) => {
      // This does not work
      setList(prevList => {
        let temp = prevList
        temp[index].showList = !(temp[index].showList)
        return temp;
      });
    }

    const handleBoughtStatusChange = (index:number) => {
      // When we uncheck a checkbox in bought list
      const value = boughtlist[index]
    
      // If grocery does not already exist in shopping list
      const alredyexists : boolean = list.some(item => value.name.toLowerCase() === item.name.toLowerCase());
      if (alredyexists == false){
        // Move value up to shopping list
        handleBoughtDelete(index)
        setList(prevList => {
          return [ ...prevList, {
              name: value.name,
              unit: value.unit,
              amount: value.amount,
              showList: value.showList,
              valList: value.valList
            }]
        });
      }
    };

  
    return (
        <NativeBaseProvider>
          <ScrollView>
            <Center w="100%">
              <Box maxW="300" w="100%">
                <Heading mb="2" size="md">
                  Shopping list
                </Heading>
                <VStack space={4}>
                    <HStack space={2}>
                      <Input flex={3} onChangeText={v => setGrocery(v)} value={grocery} placeholder="Add Grocery" />
                      <Input flex={1} onChangeText={v => setAmount(v)} keyboardType = 'numeric' value={amount.toString()} placeholder="Amount" />
                      {/* <Input flex={1} onChangeText={v => setUnit(v)} value={unit} placeholder="Unit" /> */}
                      <ScrollPicker
                        dataSource={units}
                        selectedIndex={selIndex}
                        renderItem={(data, index) => {
                          return(
                            <View>
                                <Text >{data}</Text>
                            </View>
                        )
                        }}
                        onValueChange={(data, selectedIndex) => {
                          setSelectedIndex(selectedIndex)
                          setUnit(data+"")
                        }}
                        wrapperHeight={110}
                        wrapperWidth={250}
                        wrapperColor='#FFFFFF'
                        itemHeight={60}
                        highlightColor='#d8d8d8'
                        highlightBorderWidth={2}
                      />
                      <IconButton borderRadius="sm" variant="solid" onPress={() => { // Add icon
                      addItem();
                      setGrocery("");
                      setAmount('');
                      setUnit("");
                      }} 
                    />
                    </HStack>
                    <VStack space={2}>
                      {list.map((item, itemI) => (
                        <HStack accessible={true} w="100%" justifyContent="space-between" alignItems="center" key={item.name + itemI.toString()}>
                          <Checkbox isChecked={false} onChange={() => handleStatusChange(itemI)} value={item.name}></Checkbox>
                          <Text width="100%" flexShrink={1} textAlign="left" mx="2" _light={{
                              color: "coolGray.800"
                            }} _dark={{
                              color: "coolGray.50"
                            }} onPress={() => showSubGrocery(itemI)}>
                                  {item.amount + " " + item.unit + " " + item.name}
                          </Text>
                          <IconButton size="sm" colorScheme="trueGray" onPress={() => handleDelete(itemI)} /> 
                          {/* <Icon name="camera" type="FontAwsome"/> */}
                          {/* <FontAwesomeIcon icon={faAngleRight} /> */}

                          {item.showList ? item.valList.map((val, valI) => 
                              <Text width="100%" flexShrink={1} textAlign="left" mx="2"  _light={{
                                color: "coolGray.400"
                              }} 
                              onPress={() => handleStatusChange(itemI)}>
                                    { val.recipie != "" ? val.amount + " " + val.unit + " " + item.name + " from recipie " + val.recipie:
                                     + val.amount + " " + val.unit + " " + item.name }
                              </Text>
                        ) : ""}
                        </HStack>
                        ))}
                    </VStack>
                </VStack>
              </Box>

              {/* Bought list */}
              <Box maxW="300" w="100%">
                <Heading mb="2" size="md">
                  Bought
                </Heading>
                <VStack space={4}>
                    <VStack space={2}>
                      {boughtlist.length > 0 ? 
                        boughtlist.map((item, itemI) => 
                          <HStack accessible={true} w="100%" justifyContent="space-between" alignItems="center" key={item.name + itemI.toString()}>
                            <Checkbox isChecked={true} onChange={() => handleBoughtStatusChange(itemI)} value={item.name}></Checkbox>
                            <Text width="100%" flexShrink={1} textAlign="left" mx="2" strikeThrough={true} _light={{
                                color: "gray.400" 
                              }} _dark={{
                                color: "gray.400"
                              }} onPress={() => handleBoughtStatusChange(itemI)}>
                                    {item.name}
                            </Text>
                            <IconButton size="sm" colorScheme="trueGray" onPress={() => handleBoughtDelete(itemI)} /> 
                          </HStack>)
                        :
                        ""
                      }
                    </VStack>
                </VStack>

              </Box>
              {/* <IconButton borderRadius="sm" variant="solid" onPress={() => { // Add icon
                      addrecipieToList(recipie)
                      }} ></IconButton> */}
            </Center>
          </ScrollView>
        </NativeBaseProvider>
    );
  };


  
  const styles = StyleSheet.create({
    sectionContainer: {
      // flex: 1,
      display: "block",
      // justifyContent: "space-between",
      backgroundColor: "green",
    },
    scrollinglistContainer: {
      marginTop: 32,
      paddingHorizontal: 24,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: '600',
    },
    sectionDescription: {
      marginTop: 8,
      fontSize: 18,
      fontWeight: '400',
    },
    highlight: {
      fontWeight: '700',
    },
  });
  
export default Shoppinglist;
  