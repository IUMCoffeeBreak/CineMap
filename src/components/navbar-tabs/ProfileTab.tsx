import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Avatar } from "react-native-elements";

export function ProfileTab() {
    return (
        <SafeAreaView style={style.mainContainer}>
            <View style={style.headerContainer}>
                <View style={style.avatarContainer}>
                    <Avatar
                        rounded
                        title="CB"
                        size={150}
                        activeOpacity={0.7}
                        containerStyle={{ backgroundColor: "black" }}
                        titleStyle={{ color: "yellow" }}
                    />
                </View>
                <View style={style.infoContainer}>
                    <Text style={style.userName}>CoffeeBreak</Text>
                    <Text style={style.userLocation}>Roma</Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const style = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "space-around",
        position: "absolute",
        width: "100%"
    },
    headerContainer: {
        flex: 1
    },
    avatarContainer: {
        flex: 1,
        alignItems: "center",
        marginTop: "50%"
    },
    infoContainer: {
        flex: 1
    },
    userName: {
        fontSize: 25,
        fontWeight: "bold",
        textAlign: "center"
    },
    userLocation: {
        fontSize: 18,
        textAlign: "center"
    }
});
