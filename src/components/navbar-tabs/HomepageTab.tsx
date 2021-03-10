import React from "react";
import {Keyboard, SafeAreaView, StyleSheet, Text, View} from "react-native";
import MapView from "react-native-maps";
import constants from "../../lib/utils/constants";
import { romeCoordinates } from "./MapTab";
import { ComponentProps } from "../routeTypings";
import { CinePinButton } from "../../lib/components/CinePinButton";

export const HomepageTab = ({ navigation }: ComponentProps<"Home">) => {
    return (
        <>
            <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center"}}>
                <View style={homeStyle.mainContainer}>
                    <View style={homeStyle.mapContainer}>
                        <MapView
                            showsScale={true}
                            zoomControlEnabled={true}
                            showsUserLocation={true}
                            showsCompass={true}
                            style={homeStyle.map}
                            initialRegion={{
                                latitude: romeCoordinates.lat,
                                longitude: romeCoordinates.lon,
                                latitudeDelta: constants.map.DELTA,
                                longitudeDelta: constants.map.DELTA
                            }}
                        />
                    </View>
                    <View style={homeStyle.card}>
                        <Text style={homeStyle.textStyle}>
                            {"Vuoi scoprire quali film sono stati girati in un determinato luogo?"}
                        </Text>
                        <CinePinButton
                            style={homeStyle.button}
                            onPress={() => navigation.navigate("Map")}
                            message="cerca location"
                        />
                    </View>
                </View>
            </SafeAreaView>
        </>
    );
};

const homeStyle = StyleSheet.create({
    mainContainer: {
        flex: 1,
        width: "100%",
    },
    mapContainer: {
        flex: 2,
        flexDirection: "row",
        marginTop: 15,
        backgroundColor: "white",
        borderRadius: 5,
        margin: 15,
        shadowOffset: {
            height: 0,
            width: 1
        },
        elevation: 5,
        shadowOpacity: 0.22,
        shadowRadius: 2.22
    },
    map: {
        flex: 1
    },
    card: {
        marginTop: 15,
        backgroundColor: "white",
        borderRadius: 5,
        margin: 15,
        shadowOffset: {
            height: 0,
            width: 1
        },
        elevation: 5,
        shadowOpacity: 0.22,
        shadowRadius: 2.22
    },
    buttonContainer: {
        // position: "absolute",
        marginLeft: "60%",
        marginTop: "25%"
    },
    textStyle: {
        fontSize: 20,
        margin: 10
    },
    button: {
        margin: 20
    }
});
