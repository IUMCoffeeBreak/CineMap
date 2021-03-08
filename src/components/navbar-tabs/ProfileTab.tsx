import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Avatar } from 'react-native-elements';

export function ProfileTab() {
    return (
        <SafeAreaView style={style.mainContainer}>
            <View style={style.avatarContainer}>
                <Avatar
                    rounded
                    title='GF'
                    size='xlarge'
                    activeOpacity={0.7}
                    containerStyle={{backgroundColor:'black'}}
                    titleStyle={{color: 'yellow'}}
                />
            </View>
            <View style={style.infoContainer}>
            <Text>Here some text</Text>
            </View>
        </SafeAreaView>
    );
}
 const style = StyleSheet.create({
    mainContainer:{
        flex:1,
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    avatarContainer: {
        flex: 1,
        alignItems: 'center',
        padding: '5%',
    },
    infoContainer:{
        flex:1,
        alignItems: 'center',
    }
 })