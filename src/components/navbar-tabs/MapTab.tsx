import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";
import constants from "../../lib/utils/constants";
import { SearchBar } from "../../lib/components/SearchBar";
import { SafeAreaView } from "../../lib/components/SafeAreaView";
import { Geolocation, searchLocation } from "../../lib/geolocation";
import { db } from "../../db";
import { ComponentProps } from "../routeTypings";

const mapTabStyles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject
    },
    searchBar: {
        marginTop: 50,
        zIndex: 1,
        shadowColor: "#bbbbbb",
        shadowOffset: {
            width: 5,
            height: 5
        },
        shadowOpacity: 5,
        shadowRadius: 10,
        elevation: 5
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: constants.borders.RADIUS,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});

export const romeCoordinates = {
    lat: 41.9028,
    lon: 12.4964
};

export function MapTab({ navigation, route }: ComponentProps<"Map">) {
    const [search, setSearch] = useState("");
    const [pins, setPins] = useState<Geolocation[]>([]);
    const [map, setMap] = useState<MapView>();
    const [visibleModal, setModalVisibility] = useState(false);
    const [movieAssociations, setMovieAssociations] = useState<ReturnType<typeof db.getMovieLocations>>([]);
    return (
        <>
            <SafeAreaView>
                <Modal visible={visibleModal} transparent={true} animationType={"fade"}>
                    <View style={mapTabStyles.centeredView}>
                        <View style={mapTabStyles.modalView}>
                            <Text style={mapTabStyles.modalText}>Nessun risultato trovato per "{search}"</Text>
                            <TouchableHighlight
                                style={{ ...mapTabStyles.openButton, backgroundColor: constants.colors.MAIN_GREEN }}
                                onPress={() => setModalVisibility(!visibleModal)}
                            >
                                <Text style={mapTabStyles.textStyle}>Chiudi</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>
                <SearchBar
                    style={{ margin: 20 }}
                    safeAreaProps={mapTabStyles.searchBar}
                    value={search}
                    placeholder={"Cerca luogo"}
                    onChangeText={text => {
                        setSearch(text);
                        setPins([]);
                    }}
                    onBlur={async () => {
                        if (!search) return;
                        const results = await searchLocation({ q: search.replace(/roma$/i, "") + " roma" });
                        setModalVisibility(!!results && !results.length);
                        if (!results || (results && results.length === 0)) return console.log("not found"); // todo handle
                        const filteredGeolocations = results.filter(
                            o => o.importance > constants.map.IMPORTANCE_FILTER_TRESHOLD
                        );
                        setPins(filteredGeolocations);
                        setMovieAssociations(db.getMovieLocations(search));
                        console.debug("movie associations:", movieAssociations);
                        console.debug(
                            filteredGeolocations.length,
                            results.map(v => v.display_name)
                        );
                        const altitude = 8000;
                        const zoom = altitude;
                        const [pin] = results;
                        map?.animateCamera({
                            center: { latitude: pin.lat, longitude: pin.lon },
                            altitude,
                            zoom
                        });
                    }}
                />
                <MapView
                    showsScale={true}
                    zoomControlEnabled={true}
                    showsUserLocation={true}
                    showsCompass={true}
                    ref={m => setMap(m as MapView)}
                    style={mapTabStyles.map}
                    initialRegion={{
                        latitude: romeCoordinates.lat,
                        longitude: romeCoordinates.lon,
                        latitudeDelta: constants.map.DELTA,
                        longitudeDelta: constants.map.DELTA
                    }}
                >
                    <UrlTile
                        urlTemplate={"http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"}
                        maximumZ={19}
                        flipY={false}
                    />
                    {pins.map(pin => (
                        <Marker
                            key={pin.display_name + pin.lat}
                            coordinate={{ latitude: pin.lat, longitude: pin.lon }}
                            title={pin.display_name}
                            onPress={() =>
                                navigation.navigate("Film nel luogo", {
                                    pin,
                                    associations: db.getLocationMovies(pin.place_id)
                                })
                            }
                        />
                    ))}
                </MapView>
            </SafeAreaView>
        </>
    );
}
