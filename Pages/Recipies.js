import React, { type PropsWithChildren } from 'react';
import { Colors } from '../styles/colors';

import {
    ScrollView,
    StyleSheet,
    Text as RNText,
    Image,
    View
} from 'react-native';

import { useEffect } from 'react';

import { Button, Input, IconButton, Box, VStack, Stack, HStack, Text, Center, NativeBaseProvider } from "native-base";
import Icon from 'react-native-vector-icons/FontAwesome';
import { db } from "../firebase/config.js";




const Recipies = (props) => {
    const [recipe, setRecipe] = React.useState([])
    useEffect(() => {// Runs when starting page up
        // Load data
        db.collection('user_recipes')
            .doc(' PvybugXUxOtFxi2j5SMx') // My userid
            .get()
            .then(documentSnapshot => {
                console.log(documentSnapshot)
                console.log(documentSnapshot.data())
                setRecipe(documentSnapshot.data())
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
            <View style={{
                paddingTop: 20, width: '100%', height: '100%', backgroundColor: "#13131A"}} >
                <View style={{ paddingLeft: 23, paddingTop: 15 }}>
                    <Text style={styles.text}>Add new recipe</Text>
                </View>
                <View style={{ paddingLeft: 23, paddingTop: 12 }}>
                    <Stack direction="row" mb="2.5" mt="1.5" space={2}>
                        <Input
                            type="text"
                            placeholder="Enter URL with recipe"
                            w="80%"
                            h="45"
                            backgroundColor={Colors.BAR}
                            borderRadius="10"
                            borderColor={Colors.BAR_BORDER}
                            placeholderTextColor={Colors.PLACEHOLDER}
                            color={Colors.TEXT}
                            _focus={{
                                borderColor: Colors.BAR_BORDER,
                            }}
                        />
                        <Button
                            backgroundColor={Colors.BUTTON}
                            borderColor={Colors.BUTTON_BORDER}
                            borderRadius={10}>
                            HIT
                        </Button>
                    </Stack>
                </View>
                <View style={{ paddingLeft: 18, paddingTop: 15 }}>
                    <Text style={styles.text}>Recipes</Text>
                </View>

                <ScrollView style={styles.generalShoppinglistStyles}>
                    <Center w="100%" >

                        <Box w="100%">
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
            </View>
        </NativeBaseProvider >
    );
};


const styles = StyleSheet.create({
    text: {
        color: Colors.TEXT,
        fontSize: 18,
        fontWeight: 'bold',
    },
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
        borderRadius: 15,
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
        paddingLeft: 10,
        justifyContent: 'center',
    }
});
export default Recipies;
