import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";
import constants from "../../lib/utils/constants";
import { SearchBar } from "../../lib/components/SearchBar";
import { SafeAreaView } from "../../lib/components/SafeAreaView";
import { Geolocation, searchLocation } from "../../lib/geolocation";

const mapTabStyles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject
    },
    searchBar: {
        marginTop: 20,
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
        borderRadius: 20,
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

export function MapTab({ navigation }) {
    const [search, setSearch] = useState("");
    const [pins, setPins] = useState<Geolocation[]>([]);
    const [map, setMap] = useState(null);
    const [visibleModal, setModalVisibility] = useState(false);
    return (
        <>
            <SafeAreaView style={{ flex: 1 }}>
                <Modal visible={visibleModal} transparent={true} animationType={"fade"}>
                    <View style={mapTabStyles.centeredView}>
                        <View style={mapTabStyles.modalView}>
                            <Text style={mapTabStyles.modalText}>Nessun risultato trovato</Text>
                            <TouchableHighlight
                                style={{ ...mapTabStyles.openButton, backgroundColor: "#2196F3" }}
                                onPress={() => {
                                    setModalVisibility(!visibleModal);
                                }}
                            >
                                <Text style={mapTabStyles.textStyle}>Hide Modal</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>
                <SearchBar
                    safeAreaProps={mapTabStyles.searchBar}
                    value={search}
                    onChangeText={setSearch}
                    onBlur={async () => {
                        const results = await searchLocation({ q: search });
                        setModalVisibility(!!results && !results.length);
                        results &&
                            setPins(results.filter(o => o.importance > constants.map.IMPORTANCE_FILTER_TRESHOLD));
                        console.debug("location query results", JSON.stringify(results, null, 2));
                    }}
                />
                <MapView
                  showsCompass={true}
                    ref={m => setMap(m as any)}
                    onLayout={() => {
                        (map as any).fitToCoordinates(
                            pins.map(o => ({
                                latitude: o.lat,
                                longitude: o.lon
                            })),
                            { edgePadding: 30, animated: true }
                        );
                    }}
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
                    {pins.map(pin => {
                        return (
                            <Marker
                                key={pin.display_name + pin.lat}
                                coordinate={{ latitude: pin.lat, longitude: pin.lon }}
                                title={pin.display_name}
                                // onPress={() => navigation.navigate(constants.views.MOVIE)}
                            />
                        );
                    })}
                    {/*<Marker*/}
                    {/*    coordinate={{ latitude: romeCoordinates.lat, longitude: romeCoordinates.lon }}*/}
                    {/*    title={"Foo Place"}*/}
                    {/*    description={"Im your first place"}*/}
                    {/*    onPress={() => navigation.navigate(constants.views.MOVIE)}*/}
                    {/*/>*/}
                </MapView>
            </SafeAreaView>
        </>
    );
}
