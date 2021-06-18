import React, { useEffect, useState } from "react";
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

function renderMarkers(locations: Geolocation[], navigation: any) {
    return locations.map((pin, i) => (
        <Marker
            key={`${i}-${pin.display_name}`}
            coordinate={{ latitude: pin.lat, longitude: pin.lon }}
            title={pin.display_name}
            onPress={() =>
                navigation.navigate("Film nel luogo", {
                    pin,
                    movies: db.getMoviesByLocation(pin.place_id)
                })
            }
        />
    ));
}

export function MapTab({ navigation, route }: ComponentProps<"Map">) {
    const [search, setSearch] = useState("");
    const [map, setMap] = useState<MapView>();
    const [searchErr, setSearchErr] = useState("");
    const [allLocations, setAllLocations] = useState<Geolocation[]>([]);
    const [searchedLocation, setSearchedLocations] = useState<Geolocation[]>([]);
    const [showAllLocations, setShowAllLocations] = useState(true);
    const [showMovieCard, setShowMovieCard] = useState(false);
    const [showUnassociatedMoviesModal, setShowUnassociatedMoviesModal] = useState(false);
    const [showFilterButtons, setShowFilterButtons] = useState(false);
    const [searchedMovieLocations, setSearchedMovieLocations] = useState<Geolocation[]>([]);
    const [showSearchedMovieLocations, setShowSearchedMovieLocations] = useState(false);
    const [filterByLocation, setFilterByLocation] = useState<boolean>(false);
    const [movie, setMovie] = useState<Movie | null>(null);

    useEffect(() => {
        db.onReady().then(() => {
            const locations = db.getAllRegisteredLocations()
            setAllLocations(locations);
        });
    }, []);

    return (
        <>
            <SafeAreaView>
                <Modal visible={!!searchErr} transparent={true} animationType={"fade"}>
                    <View style={mapTabStyles.centeredView}>
                        <View style={mapTabStyles.modalView}>
                            <Text style={mapTabStyles.modalText}>{searchErr}</Text>
                            <CinePinButton message={"Chiudi"} onPress={() => setSearchErr("")} />
                        </View>
                    </View>
                </Modal>
                <Modal visible={showUnassociatedMoviesModal} transparent={true} animationType={"fade"}>
                    <View style={mapTabStyles.centeredView}>
                        <View style={mapTabStyles.modalView}>
                            <View>
                                <Text style={mapTabStyles.modalText}>
                                    Questo film non è ancora stato inserito sulla mappa
                                </Text>
                                <View style={{ flexDirection: "row" }}>
                                    <CinePinButton
                                        message={"Aggiungi scena"}
                                        style={{ margin: 10 }}
                                        onPress={() => {
                                            setShowUnassociatedMoviesModal(false);
                                            navigation.push("Aggiungi scena", { movie });
                                        }}
                                    />
                                    <CinePinButton
                                        style={{ margin: 10 }}
                                        message={"Chiudi"}
                                        onPress={() => setShowUnassociatedMoviesModal(false)}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
                <SearchBar
                    style={{ marginLeft: 20, marginRight: 20, marginTop: 0, marginBottom: 10 }}
                    safeAreaProps={mapTabStyles.searchBar}
                    value={search}
                    placeholder={showFilterButtons ? `Cerca ${filterByLocation ? "luogo" : "film"}` : "Cerca luogo o film"}
                    onChangeText={text => {
                        setSearch(text);
                        if (!text) {
                            setMovie(null);
                            setSearchErr("");
                            setShowFilterButtons(true);
                            setShowAllLocations(true);
                        } else {
                            setShowAllLocations(false);
                            setShowFilterButtons(false);
                            setShowSearchedMovieLocations(false);
                        }
                        setSearchedLocations([]);
                    }}
                    onFocus={() => {
                        setShowFilterButtons(true);
                    }}
                    onBlur={async () => {
                        setShowFilterButtons(false);
                        if (!search) return;
                        // todo: should hide after clicking on it? prototype doesn't
                        // setShowMovieCard(false);
                        const altitude = 8000;
                        const zoom = altitude;
                        if (filterByLocation) {
                            const locations =
                                (await searchLocation({ q: search.replace(/roma$/i, "") + " roma" })) || [];
                            // if (!locations || (locations && locations.length === 0)) return console.log("not found"); // todo handle
                            const filteredGeolocations = locations.filter(
                                o => o.importance > constants.map.IMPORTANCE_FILTER_TRESHOLD
                            );
                            if (filteredGeolocations.length === 0) {
                                setSearchErr(`Nessun luogo trovato per "${search}"`);
                                setMovie(null);
                                return;
                            }
                            setSearchedLocations(filteredGeolocations);
                            const [pin] = locations;
                            map?.animateCamera({
                                center: { latitude: pin.lat, longitude: pin.lon },
                                altitude,
                                zoom
                            });
                        } else {
                            const { err, item: m } = await fetchMovieTitle(db, search);
                            setMovie(m || null);
                            setShowMovieCard(true);
                            setSearchErr(err || "");
                        }
                    }}
                />
                {showFilterButtons && !movie && searchedLocation.length === 0 ? (
                    <SafeAreaView style={{ zIndex: 1, flex: 2, flexDirection: "row", justifyContent: "space-around" }}>
                        <CinePinButton
                            icon={"film"}
                            style={mapTabStyles.filterButton}
                            message={"film"}
                            disabled={!filterByLocation}
                            onPress={() => {
                                setFilterByLocation(false);
                                setSearchErr("");
                            }}
                        />
                        <CinePinButton
                            icon={"map"}
                            style={mapTabStyles.filterButton}
                            message={"luogo"}
                            disabled={filterByLocation}
                            onPress={() => {
                                setFilterByLocation(true);
                                setSearchErr("");
                                setMovie(null);
                            }}
                        />
                    </SafeAreaView>
                ) : null}
                {showMovieCard && movie ? (
                    <MovieCard
                        onPress={() => {
                            const locations = db.getLocationsFromMovieId(movie.imdbID);
                            setSearchedMovieLocations(locations);
                            setShowSearchedMovieLocations(true);
                            if (!locations.length) return setShowUnassociatedMoviesModal(true);
                            setShowMovieCard(false);
                        }}
                        container={{ zIndex: 1 }}
                        movie={movie}
                    />
                ) : null}
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
                    {renderMarkers(searchedLocation, navigation)}
                    {showSearchedMovieLocations ? renderMarkers(searchedMovieLocations, navigation) : null}
                    {showAllLocations ? renderMarkers(allLocations, navigation) : null}
                </MapView>
            </SafeAreaView>
        </>
    );
}
