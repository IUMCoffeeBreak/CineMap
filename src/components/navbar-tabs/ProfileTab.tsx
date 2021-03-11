import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Avatar } from "react-native-elements";
import constants from "../../lib/utils/constants";

const name = "michael scott";
const extractInitials = (n: string) =>
    n
        .split(" ")
        .map(v => v[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
const titlize = (s: string) =>
    s
        .split(" ")
        .map(w => w[0].toUpperCase() + w.slice(1))
        .join(" ");

export function ProfileTab() {
    return (
        <SafeAreaView style={style.mainContainer}>
            <View style={style.headerContainer}>
                <View style={style.avatarContainer}>
                    <Avatar
                        rounded
                        title={extractInitials(name)}
                        size={150}
                        activeOpacity={0.7}
                        containerStyle={{ backgroundColor: "black" }}
                        titleStyle={{ color: constants.colors.MAIN_GREEN }}
                    />
                    <View style={style.infoContainer}>
                        <Text style={style.userName}>{titlize(name)}</Text>
                        <Text style={style.userLocation}>Roma</Text>
                    </View>
                </View>

            </View>
        </SafeAreaView>
    );
}

const style = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "space-around",
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
