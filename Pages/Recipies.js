import React, { type PropsWithChildren } from 'react';

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text as RNText,
    useColorScheme,
    Image,
    View
} from 'react-native';

import { useState, useEffect } from 'react';

import { Button, Pressable, Input, IconButton, Checkbox, Box, VStack, HStack, Heading, Text, Center, useToast, NativeBaseProvider } from "native-base";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Shoppinglist } from './Shoppinglist';
import { db } from "../firebase/config.js";




const Recipies = (props) => {
    const [recipe, setRecipe] = React.useState([]) 
    useEffect(() => {// Runs when starting page up
        // Load data
        db.collection('user_recipes')
            .doc(' PvybugXUxOtFxi2j5SMx') // My userid
            .get()
            .then(documentSnapshot => {
                // const data = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
                console.log(documentSnapshot)
                console.log(documentSnapshot.data())
                setRecipe(documentSnapshot.data())
                // setList(documentSnapshot.data()["shoplist"])
            })
            .catch(error => {
                if (error instanceof TypeError) {
                    return null;
                }
                throw error;
            })

    }, []);


    const Capitalize = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }


    return (
        <NativeBaseProvider>

            <ScrollView style={styles.generalShoppinglistStyles}>
                <Center w="100%" >
                    <Box w="100%">
                        <Heading paddingLeft={"5%"} paddingBottom={5} mb="2" size="md" color="white">
                            Recipes
                        </Heading>
                        <VStack space={4}>
                            {Object.keys(recipe).map((key, index) => (
                                // <HStack alignItems={'flex-start'} color="white" >
                                <View style={styles.boxStyle}>
                                    <HStack style={styles.container}>
                                        <Box h="90%" w="30%">
                                            <Image style={{
                                                width: "100%",
                                                height: "100%",
                                                // resizeMode: 'contain'
                                            }} source={require('../Images/bolognese-1.webp')} />
                                        </Box>
                                        <Box h="80%" w="55%" style={styles.description}>
                                            <Text fontSize={16} fontWeight="bold" flexShrink={1} textAlign="left" mx="2" color="white" >
                                                {Capitalize(key)}
                                            </Text>
                                            <Text flexShrink={1} textAlign="left" mx="2" color="white" >
                                                Soup
                                            </Text>
                                        </Box>
                                        <Box h="80%" w="20%" style={styles.some}>
                                            <IconButton icon={<Icon name="plus" size={20} color="white" />} size="xs" onPress={() => props.addrecipieToList({ [key]: recipe[key]["Ingredients"] })} colorScheme="white" />

                                        </Box>


                                    </HStack>
                                </View>

                                // </HStack>
                            ))}

                        </VStack>
                    </Box>
                </Center>
            </ScrollView >


        </NativeBaseProvider >
    );
};


const styles = StyleSheet.create({
    generalShoppinglistStyles: {
        paddingTop: 30,
        fontSize: 18,
        fontWeight: '400',
        backgroundColor: "#13131A",

    },
    boxStyle: {
        height: 120,
        width: '90%',
        backgroundColor: "#1C1C24",
        // alignItems: 'center',
        borderRadius: 15,
        // justifyContent: 'center',
        flex: 1,
        marginLeft: "5%"
    },
    container: {
        width: "100%",
        height: "100%",
        padding: "5%",
    },
    some: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    description: {
        // alignItems: 'center',
        paddingLeft:10,
        justifyContent: 'center',
    }
});
export default Recipies;
