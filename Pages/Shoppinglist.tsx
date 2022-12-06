import React, { type PropsWithChildren } from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text as RNText,
  useColorScheme,
  View
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { Input, IconButton, Checkbox, Box, VStack, HStack, Heading, Text, Center, NativeBaseProvider } from "native-base";

const { convert } = require('convert');
import ScrollPicker from 'react-native-wheel-scrollview-picker';
// import { addrecipieToList } from '../helpers.js';

import Icon from 'react-native-vector-icons/FontAwesome';

const Shoppinglist = (props) => {
  
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  // Initialize 
  const boughtInstState: { name: string, unit: string, amount: number, showList: boolean, valList: { amount: number, unit: string, recipie: string }[] }[] = [];
  
  const [boughtlist, setBoughtList] = React.useState(boughtInstState);
  const [grocery, setGrocery] = React.useState("");
  const [amount, setAmount] = React.useState('');
  const [unit, setUnit] = React.useState("");
  const [selIndex, setSelectedIndex] = React.useState(1)
  const units = ["dl", "", "l", "g", "kg", "tsk"]


  const updateFromNewValslistReturn = (inList: [], index: number) => {
    // Each grocery in the grocerylist contains a valslist containing all the added grocery (E.g. if we have added Milk twice). 
    // This functions then updates the total amount of milk we need from the added items.
    let List = inList
    // Remove where vallist is empty or undefined
    List = List.filter(function (item, itemI) {
      return item.valList.length > 0
    })
    
    if (List.length > 0) {

      if (index === null) { // If no specific index, then update all
        for (var k = 0; k < List.length; k++) {

          // Remove where vallist is empty or undefined
          List = List.filter(function (item, itemI) {
            return (item.valList !== undefined || item.valList.length > 0)
          })

          // If vList is empty then remove grocery
          if (List[k].valList === undefined || List[k].valList.length === 0) {

            List = List.filter(function (item, itemI) {
              return itemI !== k
            })


          } else { // Else if valList is not emtpy, then update
            // Get vallist
            let vList = List[k].valList
            let a = 0

            // Go through list
            for (var i = 0; i < vList.length; i++) {

              // If the units in vallist are not the same as the main unit 
              if ((vList[i].unit.toLowerCase() != List[k].unit.toLowerCase())) {
                // then convert the units to the main and add new amount
                let newa = convert(parseInt(vList[i].amount), vList[i].unit.toLowerCase()).to(List[index].unit.toLowerCase())
                a = a + newa

              } else if (vList[i].unit === "") { // If unit is empty then just add amount
                a = a + parseInt(vList[i].amount)
              } else { // If the units are the same, then just add the amount
                a = a + parseInt(vList[i].amount)
              }

            }

            List[k].amount = a
            console.log(List)
          }
        }

      } else {
        // Get vallist
        let vList = List[index].valList ? List[index].valList : []
        let a = 0

        // Go through list
        for (var i = 0; i < vList.length; i++) {

          // If the units in vallist are not the same as the main unit 
          if ((vList[i].unit.toLowerCase() != List[index].unit.toLowerCase())) {
            // then convert the units to the main and add new amount

            //let newa = converter.volume(parseInt(vList[i].amount)).from(vList[i].unit.toLowerCase()).to(list[index].unit.toLowerCase()).value
            let newa = convert(parseInt(vList[i].amount), vList[i].unit.toLowerCase()).to(List[index].unit.toLowerCase())
            a = a + newa

          } else if (vList[i].unit === "") { // If unit is empty then just add amount
            a = a + parseInt(vList[i].amount)
          } else { // If the units are the same, then just add the amount
            a = a + parseInt(vList[i].amount)
          }

        }

        List[index].amount = a
        // setList(myList)
      }
    }
    return List
  }

  const handleDelete = (index: number) => {
    // When we delete items from shopping list
    props.setList(prevList => {
      const temp = prevList.filter((_, itemI) => itemI !== index);
      return temp;
    });
  };

  const handleBoughtDelete = (index: number) => {
    // When we delete from bought list
    setBoughtList(prevList => {
      const temp = prevList.filter((_, itemI) => itemI !== index);
      return temp;
    });
  };

  const handleStatusChange = (index: number) => {
    // When we check a checkbox in grocery list
    const value = props.list[index]
   
    // Move value down to bought list
    setBoughtList(prevList => {
      return [{
        name: value.name,
        unit: value.unit,
        amount: value.amount,
        showList: false,
        valList: value.valList
      }, ...prevList];
    });

    // Then delete from shoppinglist
    handleDelete(index)
  };

  const showSubGrocery = (index: number) => {
    // This does not work
    props.setList(prevList => {
      let temp = prevList
      temp[index].showList = !(temp[index].showList)
      return temp;
    });
  }

  const removeRecipie = (recipieName: string, recipieIndex: Number) => {
    ////// Remove groceries comming from recipie //////
    let myList = props.list

    // Go through list
    for (var k = 0; k < myList.length; k++) {
      // Get vallist
      let vList = myList[k].valList ? myList[k].valList : []
  
      myList[k].valList = myList[k].valList.filter(function (item, itemI) {
        return item.recipie.toLowerCase() !== recipieName.toLowerCase()
      })

    }

   
    let updatedList = updateFromNewValslistReturn(myList, null)
    props.setList(updatedList)
    // updateFromNewValslist(null) // Update grovery where we have removed


    ////// Remove recipie from recipies list //////
    props.setRecipies(prevRecipies => {
      const temp = prevRecipies.filter((_, itemI) => itemI !== recipieIndex);
      return temp;
    });


  }

  const handleBoughtStatusChange = (index: number) => {
    // When we uncheck a checkbox in bought list
    const value = boughtlist[index]
    console.log(value)

    // If grocery does not already exist in shopping list
    const alredyexists: boolean = props.list.some(item => value.name.toLowerCase() === item.name.toLowerCase());
    if (alredyexists == false) {
      // Move value up to shopping list
      handleBoughtDelete(index)
      props.setList(prevList => {
        return [...prevList, {
          name: value.name,
          unit: value.unit,
          amount: value.amount,
          showList: false, //value.showList,
          valList: value.valList
        }]
      });
    }
  };

  const Capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }



  return (
    <NativeBaseProvider >
      <Center w="100%">
        <Box w="100%" paddingLeft={"10%"} style={styles.recipieListStyles}>
          <Heading paddingBottom={3} mb="2" size="md" color="white">
            Recipies
          </Heading>
          <HStack width={"100%"} flexWrap={'wrap'}>
            {props.recipies.map((item, itemI) => (
              // <HStack alignItems={'flex-start'} color="white" >
              <View style={styles.recipiebox}>
                <Text flexShrink={1} textAlign="left" mx="2" color="white" >
                  {Capitalize(item)}
                </Text>

                <IconButton icon={<Icon name="close" size={15} color="white" />} size="xs" colorScheme="white" onPress={() => removeRecipie(item, itemI)} />


              </View>
              // </HStack>
            ))}
          </HStack>

        </Box>
      </Center>
      <ScrollView style={styles.generalShoppinglistStyles}>
        <Center w="100%" >
          <Box w="100%" paddingLeft={"10%"}>
            <Heading paddingBottom={5} mb="2" size="md" color="white">
              Shopping list
            </Heading>
            <VStack space={4}>
              <VStack space={2}>
                {props.list ? props.list.map((item, itemI) => (
                  <HStack accessible={true} w="100%" justifyContent="space-between" alignItems="center" color="white" key={item.name + itemI.toString()}>
                    <Checkbox isChecked={false} onChange={() => handleStatusChange(itemI)} value={item.name}></Checkbox>
                    <Text width="100%" flexShrink={1} textAlign="left" mx="2" color="white"
                      onPress={() => showSubGrocery(itemI)}>
                      {(item.amount ? item.amount + " " : "") + (item.unit ? item.unit + " " : "") + item.name}
                    </Text>
                    <IconButton icon={<Icon name="close" size={15} color="white" />} size="sm" colorScheme="white" onPress={() => handleDelete(itemI)} />
                    {(item.showList && item.valList) ? item.valList.map((val, valI) =>
                      <Text width="100%" flexShrink={1} textAlign="left" mx="2" color="white"
                        onPress={() => handleStatusChange(itemI)}>
                        {val.recipie != "" ? val.amount + " " + val.unit + " " + item.name + " from recipie " + val.recipie :
                          + val.amount + " " + val.unit + " " + item.name}
                      </Text>
                    ) : ""}
                  </HStack>
                )) :
                  ""
                }
              </VStack>

            </VStack>
          </Box>

          {/* Bought list */}
          <Box w="100%" paddingLeft={"10%"} paddingTop={30} paddingBottom={50}>
            <Heading color="white" mb="2" size="md">
              Bought
            </Heading>
            <VStack space={4}>
              <VStack space={2}>
                {boughtlist.length > 0 ?
                  boughtlist.map((item, itemI) =>
                    <HStack accessible={true} w="100%" justifyContent="space-between" alignItems="center" key={item.name + itemI.toString()}>
                      <Checkbox isChecked={true} onChange={() => handleBoughtStatusChange(itemI)} value={item.name}></Checkbox>
                      <Text width="100%" flexShrink={1} textAlign="left" mx="2" strikeThrough={true} color="white"
                        onPress={() => handleBoughtStatusChange(itemI)}>
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
        </Center>
      </ScrollView>



      <HStack space={2} style={styles.addItem}>
        <Input flex={3} color="white" onChangeText={v => setGrocery(v)} value={grocery} placeholder="Add Grocery" />
        <Input flex={1} color="white" onChangeText={v => setAmount(v)} keyboardType='numeric' value={amount.toString()} placeholder="Amount" />
        <ScrollPicker
          dataSource={units}
          selectedIndex={selIndex}
          renderItem={(data, index) => {
            return (
              <View>
                <Text color="black">{data}</Text>
              </View>
            )
          }}
          onValueChange={(data, selectedIndex) => {
            setSelectedIndex(selectedIndex)
            setUnit(data + "")
          }}
          wrapperHeight={55}
          wrapperWidth={250}
          wrapperColor='#FFFFFF'
          itemHeight={60}
          highlightColor='#d8d8d8'
          highlightBorderWidth={2}
        />
        <IconButton borderRadius="sm" variant="solid" icon={<Icon name="plus" size={12} color="white" />} onPress={() => { // Add icon
          props.addItem({ "grocery": grocery, "amount": 2, "unit": unit, recipie: "" });
          setGrocery("");
          setAmount('');
          setUnit("");
        }}
        />
      </HStack>


    </NativeBaseProvider>
  );
};


const styles = StyleSheet.create({
  generalShoppinglistStyles: {
    paddingTop: 20,
    fontSize: 18,
    fontWeight: '400',
    backgroundColor: "#13131A",
    
  },
  recipieListStyles: {
    paddingTop: 30,
    fontSize: 18,
    fontWeight: '400',
    backgroundColor: "#13131A",
  },
  addItem: {
    backgroundColor: "#13131A",
    paddingLeft: "10%",
    paddingRight: "10%"

  },
  recipiebox: {
    borderWidth: 1,
    borderColor: "#1C1C24",
    borderRadius: 10,
    padding: 3,
    backgroundColor: "#1C1C24",
    flexDirection: "row",
    marginRight: 8,
    marginBottom: 8,
  },
});

export default Shoppinglist;
