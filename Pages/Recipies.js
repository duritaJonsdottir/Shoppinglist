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

import { useState, useEffect } from 'react';

import { Button, Pressable, Input, IconButton, Checkbox, Box, VStack, HStack, Heading, Text, Center, useToast, NativeBaseProvider } from "native-base";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Shoppinglist } from './Shoppinglist';

const recipies =
{
    "carbonara":
        [
            {
                grocery: "bacon",
                amount: 100,
                unit: "g",
            },
            {
                grocery: "milk",
                amount: 1,
                unit: "L",
            },
            {
                grocery: "smør",
                amount: 1,
                unit: "tsk",
            },
            {
                grocery: "løg, i tern",
                amount: 1,
                unit: "",
            },
            {
                grocery: "piskefløde",
                amount: 1,
                unit: "dl",
            },
            {
                grocery: "æg",
                amount: 2,
                unit: "",
            },
            {
                grocery: "parmesan",
                amount: 50,
                unit: "g",
            },
            {
                grocery: "sort peber, friskkværnet",
                amount: null,
                unit: "",
            },
        ],
    "pasta kødsovs":
        [
            {
                grocery: "bacon",
                amount: 100,
                unit: "g",
                showList: false
            },
            {
                grocery: "milk",
                amount: 1,
                unit: "L",
                showList: false
            },
            {
                grocery: "smør",
                amount: 1,
                unit: "tsk",
                showList: false
            },
            {
                grocery: "løg, i tern",
                amount: 1,
                unit: "",
                showList: false
            },
            {
                grocery: "piskefløde",
                amount: 1,
                unit: "dl",
                showList: false
            },
            {
                grocery: "æg",
                amount: 2,
                unit: "",
                showList: false
            },
            {
                grocery: "parmesan",
                amount: 50,
                unit: "g",
                showList: false
            },
            {
                grocery: "sort peber, friskkværnet",
                amount: null,
                unit: "",
                showList: false
            },
        ],
}
const Recipies = (props) => {
    const Capitalize = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
      }


    return (
        <NativeBaseProvider>

            <ScrollView style={styles.generalShoppinglistStyles}>
                <Center w="100%" >
                    <Box w="100%">
                        <Heading paddingLeft={"5%"} paddingBottom={5} mb="2" size="md" color="white">
                            Recipies
                        </Heading>
                        <VStack space={4}>
                            {Object.keys(recipies).map((key, index) => (
                                // <HStack alignItems={'flex-start'} color="white" >
                                <View style={styles.boxStyle}>
                                    <HStack style={styles.container}>
                                        <Box h="80%" w="20%">

                                        </Box>
                                        <Box h="80%" w="60%" style={styles.description}>
                                            <Text fontSize={16}  fontWeight="bold" flexShrink={1} textAlign="left" mx="2" color="white" >
                                                {Capitalize(key)}
                                            </Text>
                                            <Text flexShrink={1} textAlign="left" mx="2" color="white" >
                                                Soup
                                            </Text>
                                        </Box>
                                        <Box h="80%" w="20%" style={styles.some}>
                                            <IconButton icon={<Icon name="plus" size={20} color="white" />} size="xs" onPress={() => props.addrecipieToList({[key] : recipies[key]})} colorScheme="white" />

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
        padding: 20,
    },
    some:{
        alignItems: 'center',
        justifyContent: 'center',
    },
    description:{
        // alignItems: 'center',
        justifyContent: 'center',
    }
});
export default Recipies;
