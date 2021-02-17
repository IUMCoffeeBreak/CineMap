import { useScrollToTop } from "@react-navigation/native";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, Button, Alert, ActivityIndicator, } from "react-native";
import MapView from "react-native-maps";
import constants from "../../lib/utils/constants";
import {romeCoordinates} from "./MapTab";

export const HomepageTab = ({navigation}) => {

    return (
        <>
            <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
                            {'Sei a conoscenza di scene girate a Roma che non sono registrate?'}   
                        </Text>
                            <View style={homeStyle.buttonContainer}>
                                <Button
                                    onPress={() => Alert.alert('First button pressed')}
                                    title='Aggiungi Pin'
                                    color="#577b6d"
                                />
                            </View>
                        
                    </View>
                    <View style={homeStyle.card}>
                        <Text style={homeStyle.textStyle}>
                            {'Vuoi sapere dove sono stati girati i tuoi film e serie TV preferiti?'}
                        </Text>
                        <View style={homeStyle.buttonContainer}>
                            <Button
                                onPress={() => navigation.navigate(constants.tabs.SEARCH)}
                                title='Cerca Film'
                                color="#577b6d"
                            />
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </>
    );
}

const homeStyle = StyleSheet.create({
    mainContainer: {
        flex: 1,
        width: "100%"
    },
    mapContainer: {
        flex: 2,
        flexDirection: "row",
        marginTop: 15,
        backgroundColor: 'white',
        borderRadius: 5,
        margin: 15,
        shadowOffset: {
            height: 0,
            width: 1
          },
        elevation: 5,
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    map:{
        flex: 1,
    },
    card: {
        flex: 1,
        flexDirection: "row",
        marginTop: 15,
        backgroundColor: 'white',
        borderRadius: 5,
        margin: 15,
        shadowOffset: {
            height: 0,
            width: 1
          },
        elevation: 5,
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    buttonContainer: {
        position: 'absolute',
        marginLeft: "60%",
        marginTop: "25%"
    },
    textStyle: {
        fontSize: 20,
        margin: 10
    }
});