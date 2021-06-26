import { SafeAreaView, StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { romeCoordinates } from "../navbar-tabs/MapTab";
import constants from "../../lib/utils/constants";
import React from "react";
import { ViewProps } from "../routeTypings";

export function LocationsMap({ navigation, route }: ViewProps<"Luoghi nel film">) {
    const pins = route.params;
    return (
        <>
            <SafeAreaView>
                <View style={style.mapContainer}>
                    <MapView
                        showsScale={true}
                        zoomControlEnabled={true}
                        showsUserLocation={true}
                        showsCompass={true}
                        style={style.map}
                        initialRegion={{
                            latitude: romeCoordinates.lat,
                            longitude: romeCoordinates.lon,
                            latitudeDelta: constants.map.DELTA,
                            longitudeDelta: constants.map.DELTA
                        }}
                    >
                        {pins.map(pin => {
                            if (!pin.location) {
                                console.debug("null location for pin:", pin);
                                return;
                            }
                            return (
                                <Marker
                                    key={pin.id}
                                    coordinate={{ latitude: pin.location.lat, longitude: pin.location.lon }}
                                    title={pin.location!.display_name}
                                />
                            );
                        })}
                    </MapView>
                </View>
            </SafeAreaView>
        </>
    );
}

const style = StyleSheet.create({
    mapContainer: {
        width: "100%",
        height: "100%",
        shadowOffset: {
            height: 0,
            width: 1
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 5
    },
    map: {
        flex: 1,
        margin: "3%"
    }
});
