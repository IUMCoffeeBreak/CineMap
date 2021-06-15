import React, { useState } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";
import constants from "../../lib/utils/constants";
import { SearchBar } from "../../lib/components/SearchBar";
import { SafeAreaView } from "../../lib/components/SafeAreaView";
import { Geolocation, searchLocation } from "../../lib/geolocation";
import { db } from "../../db";
import { ComponentProps } from "../routeTypings";
import { CinePinButton } from "../../lib/components/CinePinButton";
import { fetchMovieTitle, Movie } from "../../lib/DataLayer";
import { MovieCard } from "../../lib/components/MovieCard";

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
    filterButton: {
        zIndex: 1,
        height: 40,
        width: 140
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 18
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
    const [err, setErr] = useState("");
    const [filterByMovie, setFilterByMovie] = useState<boolean>(false);
    const [showFilterButtons, setShowFilterButtons] = useState(true);
    const [movie, setMovie] = useState<Movie | null>(null);
    return (
        <>
            <SafeAreaView>
                <Modal visible={!!err} transparent={true} animationType={"fade"}>
                    <View style={mapTabStyles.centeredView}>
                        <View style={mapTabStyles.modalView}>
                            <Text style={mapTabStyles.modalText}>{err}</Text>
                            <CinePinButton message={"Chiudi"} onPress={() => setErr("")} />
                        </View>
                    </View>
                </Modal>
                <SearchBar
                    style={{ margin: 20 }}
                    safeAreaProps={mapTabStyles.searchBar}
                    value={search}
                    placeholder={`Cerca ${filterByMovie ? "luogo" : "film"}`}
                    onChangeText={text => {
                        setSearch(text);
                        if (!text) {
                            setMovie(null);
                            setErr("");
                            setShowFilterButtons(true);
                        }
                        setPins([]);
                    }}
                    onFocus={() => {
                        setShowFilterButtons(true);
                    }}
                    onBlur={async () => {
                        setShowFilterButtons(false);
                        if (!search) return;
                        const altitude = 8000;
                        const zoom = altitude;
                        if (filterByMovie) {
                            const locations =
                                (await searchLocation({ q: search.replace(/roma$/i, "") + " roma" })) || [];
                            // if (!locations || (locations && locations.length === 0)) return console.log("not found"); // todo handle
                            const filteredGeolocations = locations.filter(
                                o => o.importance > constants.map.IMPORTANCE_FILTER_TRESHOLD
                            );
                            if (filteredGeolocations.length === 0) {
                                setErr(`Nessun luogo trovato per "${search}"`);
                                setMovie(null);
                                return;
                            }
                            setPins(filteredGeolocations);
                            const [pin] = locations;
                            map?.animateCamera({
                                center: { latitude: pin.lat, longitude: pin.lon },
                                altitude,
                                zoom
                            });
                        } else {
                            const { err, item: m } = await fetchMovieTitle(db, search);
                            setMovie(m || null);
                            setErr(err || "");
                        }
                    }}
                />
                {showFilterButtons && !movie && pins.length === 0 && !search ? (
                    <SafeAreaView style={{ zIndex: 1, flex: 2, flexDirection: "row", justifyContent: "space-around" }}>
                        <CinePinButton
                            icon={"film"}
                            style={mapTabStyles.filterButton}
                            message={"film"}
                            disabled={!filterByMovie}
                            onPress={() => {
                                setFilterByMovie(false);
                                setErr("");
                            }}
                        />
                        <CinePinButton
                            icon={"map"}
                            style={mapTabStyles.filterButton}
                            message={"luogo"}
                            disabled={filterByMovie}
                            onPress={() => {
                                setFilterByMovie(true);
                                setErr("");
                                setMovie(null);
                            }}
                        />
                    </SafeAreaView>
                ) : null}
                {movie ? <MovieCard container={{ zIndex: 11 }} movie={movie} /> : null}
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
                                    movies: db.getMoviesByLocation(pin.place_id)
                                })
                            }
                        />
                    ))}
                </MapView>
            </SafeAreaView>
        </>
    );
}
