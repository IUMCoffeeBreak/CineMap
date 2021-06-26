import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import constants from "../../lib/utils/constants";
import { romeCoordinates } from "./MapTab";
import { ViewProps } from "../routeTypings";
import { CinePinButton } from "../../lib/components/CinePinButton";
import { db } from "./../../db";
import { Geolocation } from "../../lib/geolocation";

export function HomepageTab({ navigation }: ViewProps<"Home">) {
    const [associations, setAssociations] = useState<Geolocation[]>(Object.values(db.locationModel.list()));
    useEffect(() => {
        db.onReady().then(() => setAssociations(Object.values(db.locationModel.list())));
    }, []);

    return (
        <>
            <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <View style={homeStyle.mainContainer}>
                    <View style={{ ...homeStyle.card, flex: 2 }}>
                        <View style={homeStyle.mapContainer}>
                            <MapView
                                showsScale={true}
                                zoomControlEnabled={true}
                                showsUserLocation={true}
                                style={homeStyle.map}
                                initialRegion={{
                                    latitude: romeCoordinates.lat,
                                    longitude: romeCoordinates.lon,
                                    latitudeDelta: constants.map.DELTA,
                                    longitudeDelta: constants.map.DELTA
                                }}
                            >
                                {associations.map((pin, i) => {
                                    return (
                                        <Marker
                                            key={`${pin.place_id}`}
                                            coordinate={{ latitude: pin.lat, longitude: pin.lon }}
                                            title={pin.display_name}
                                        />
                                    );
                                })}
                            </MapView>
                        </View>
                        <View>
                            <CinePinButton
                                message={"cerca luogo"}
                                style={{ marginLeft: 20, marginRight: 20, marginBottom: 20 }}
                                onPress={() => navigation.navigate("Map", {})}
                            />
                        </View>
                    </View>
                    <View style={homeStyle.card}>
                        <Text style={homeStyle.textStyle}>
                            {"Vuoi sapere dove sono stati gitati i tuoi film e serie tv preferiti?"}
                        </Text>
                        <CinePinButton
                            style={homeStyle.button}
                            onPress={() => navigation.navigate("Search")}
                            message="cerca film"
                        />
                    </View>
                    <View style={homeStyle.card}>
                        <Text style={homeStyle.textStyle}>
                            {"Sei a conoscenza di scene girate a Roma che non sono state registrate?"}
                        </Text>
                        <CinePinButton
                            style={homeStyle.button}
                            onPress={() => navigation.navigate("Map", { navigatedFromHome: true })}
                            message="aggiungi scena"
                        />
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
