import React, { useState } from "react";
import { ViewProps } from "../routeTypings";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import constants from "../../lib/utils/constants";
import { TextInput } from "react-native-paper";
import { CinePinButton } from "../../lib/components/CinePinButton";
import { Movie } from "../../lib/DataLayer";
import _ from "lodash";
import { db } from "../../db";
import { MovieSearch } from "../../lib/components/MovieSearch";
import { SafeAreaView } from "../../lib/components/SafeAreaView";
import { MovieCard } from "../../lib/components/MovieCard";
import { Geolocation, searchLocation } from "../../lib/geolocation";
import Modal from "react-native-modal";
import { SearchBar } from "../../lib/components/SearchBar";
import MapView, { Marker, UrlTile } from "react-native-maps";

export const romeCoordinates = {
    lat: 41.9028,
    lon: 12.4964
};

export function CreateNewScene({ navigation, route }: ViewProps<"Aggiungi scena">) {
    const routeData = route.params;
    const [sceneTitle, setSceneTitle] = useState("");
    const [sceneLink, setSceneLink] = useState("");
    const [movieFromRoute, setFromRoute] = useState(false);

    const [err, setErr] = useState("");
    const [searchModal, setSearchModal] = useState(true);
    const [movie, setMovie] = useState<Movie | null>(routeData?.movie || null);
    const [selectedMovie, setSelectedMovie] = useState(!!routeData?.movie);

    const [pin, setPin] = useState<Geolocation>(routeData?.pin as any);

    const [isModalPinVisible, setModalPinVisible] = useState(false);
    const [isModalMovieVisible, setModalMovieVisible] = useState(false);
    const [search, setSearch] = useState("");
    const [pins, setPins] = useState<Geolocation[]>([]);
    const [movieAssociations, setMovieAssociations] = useState<ReturnType<typeof db.getMoviesByLocation>>([]);
    const [map, setMap] = useState<MapView>();

    const toggleModal = () => {
        setModalPinVisible(!isModalPinVisible);
    };

    const toggleModalMovie = () => {
        setModalMovieVisible(!isModalMovieVisible);
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{}}>
                <View>
                    <Modal
                        isVisible={isModalPinVisible}
                        avoidKeyboard={true}
                        onBackdropPress={() => setModalPinVisible(false)}
                        style={{ backgroundColor: "white", borderRadius: 10, justifyContent: "space-between" }}
                    >
                        {/*<KeyboardAvoidingView*/}
                        {/*    behavior={Platform.OS === "ios" ? "padding" : "height"}*/}
                        {/*    style={{ flex: 1, justifyContent: "space-between" }}*/}
                        {/*/>*/}
                        <MapView
                            showsScale={true}
                            zoomControlEnabled={true}
                            showsUserLocation={true}
                            showsCompass={true}
                            ref={m => setMap(m as MapView)}
                            style={styles.map}
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
                                    onPress={() => {
                                        setPin(pin);
                                        setModalPinVisible(false);
                                    }}
                                />
                            ))}
                        </MapView>
                        <SearchBar
                            safeAreaProps={styles.searchBar}
                            value={search}
                            style={{ margin: 20 }}
                            placeholder={"Cerca luogo"}
                            onChangeText={text => {
                                setSearch(text);
                                setPins([]);
                            }}
                            onBlur={async () => {
                                if (!search) return;
                                const results = await searchLocation({ q: search.replace(/roma$/i, "") + " roma" });
                                if (!results || (results && results.length === 0)) return console.log("not found"); // todo handle
                                const filteredGeolocations = results.filter(
                                    o => o.importance > constants.map.IMPORTANCE_FILTER_TRESHOLD
                                );
                                setPins(filteredGeolocations);
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
                        <View>
                            <CinePinButton
                                message={"chiudi"}
                                onPress={toggleModal}
                                style={{ margin: 20 }}
                                // style={{ ...styles.button, width: "100%" }}
                            />
                        </View>

                        {/*<KeyboardAvoidingView />*/}
                    </Modal>

                    <Modal isVisible={isModalMovieVisible}>
                        <View style={{ backgroundColor: "white", padding: "5%", borderRadius: 10 }}>
                            <MovieSearch
                                onMovieFound={(e, item) => {
                                    if (e) setErr(e);
                                    else if (item) {
                                        setMovie(item);
                                    }
                                }}
                                onMovieClick={movie => {
                                    if (movie) setMovie(movie);
                                    setSearchModal(false);
                                    setModalMovieVisible(false);
                                    setSelectedMovie(true);
                                }}
                            />
                            <CinePinButton
                                message={"chiudi"}
                                onPress={toggleModalMovie}
                                style={{ ...styles.button, width: "100%" }}
                            />
                        </View>
                    </Modal>
                </View>
                <View style={styles.locationContainer}>
                    <Text style={styles.text}>Dove si è svolta la scena che vuoi inserire?</Text>
                    <View style={styles.locationLabel}>
                        <Text style={styles.textLabel}>{pin?.display_name}</Text>
                    </View>
                    <CinePinButton
                        message={pin ? "Cambia luogo" : "aggiungi luogo"}
                        onPress={toggleModal}
                        style={styles.button}
                    />
                </View>
                <View style={styles.filmContainer}>
                    <Text style={styles.text}>Da quale film è tratta la scena che vuoi inserire?</Text>
                    <View style={styles.movieSearch}>
                        {selectedMovie && <MovieCard movie={movie} />}
                        <CinePinButton
                            message={!selectedMovie ? "Cerca film" : "cambia film"}
                            onPress={toggleModalMovie}
                            style={styles.button}
                        />
                    </View>
                </View>
                <View style={styles.sceneInputContainer}>
                    <Text style={styles.text}>Inserisci un titolo per la scena che vuoi inserire</Text>
                    <TextInput
                        theme={{ colors: { primary: constants.colors.MAIN_GREEN } }}
                        label={"Titolo della scena"}
                        mode={"outlined"}
                        style={styles.input}
                        value={sceneTitle}
                        onChangeText={v => setSceneTitle(v)}
                    />
                </View>
                <View style={{ ...styles.sceneInputContainer }}>
                    <Text style={styles.text}>Inserisci il link della scena che vuoi aggiungere</Text>
                    <TextInput
                        theme={{ colors: { primary: constants.colors.MAIN_GREEN } }}
                        label={"Link al video della scena"}
                        mode={"outlined"}
                        style={styles.input}
                        value={sceneLink}
                        onChangeText={v => setSceneLink(v)}
                    />
                </View>
                <View style={{}}>
                    <CinePinButton
                        message={"Conferma"}
                        onPress={() => {
                            if (pin && movie) {
                                db.createMovieLocationAssociation({
                                    movie,
                                    location: pin,
                                    scene_name: sceneTitle,
                                    scene_video_link: sceneLink
                                });
                                navigation.navigate("Film nel luogo", {
                                    pin,
                                    movies: db.getMoviesByLocation(pin.place_id)
                                });
                            }
                        }}
                        style={styles.mainButton}
                        disabled={!sceneTitle || !sceneLink || _.isEmpty(movie)}
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        margin: "3%",
        // padding: "5%",
        justifyContent: "space-around"
    },
    locationContainer: {
        justifyContent: "center"
    },
    locationLabel: {
        justifyContent: "space-around",
        backgroundColor: "rgba(171, 160, 159, 0.1)",
        borderRadius: 5,
        marginTop: "3%",
        padding: "2%"
    },
    filmContainer: {
        marginTop: "5%",
        height: 245
        // marginBottom: "20%"
    },
    movieSearch: {
        // paddingTop: "5%"
    },
    sceneInputContainer: {
        // paddingTop: "5%",
        marginTop: "3%"
    },
    text: {
        alignSelf: "center",
        fontSize: 20,
        fontWeight: "bold"
    },
    textLabel: {
        alignSelf: "center",
        fontSize: 15
    },
    button: {
        color: constants.colors.MAIN_GREEN,
        width: "75%",
        margin: 10,
        alignSelf: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7
        },
        shadowOpacity: 0.41,
        shadowRadius: 9.11,
        elevation: 14,
        marginTop: "3%"
    },
    input: {
        height: 40,
        backgroundColor: "white",
        marginTop: "3%"
    },
    mainButton: {
        color: constants.colors.MAIN_GREEN,
        width: "100%",
        marginTop: "5%",
        alignSelf: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7
        },
        shadowOpacity: 0.41,
        shadowRadius: 9.11

        // elevation: 14
    },
    searchBar: {
        zIndex: 1,
        shadowColor: "#bbbbbb",
        shadowOffset: {
            width: 5,
            height: 5
        },
        shadowOpacity: 5,
        shadowRadius: 10,
        elevation: 5
        // marginBottom: "100%"
    },
    map: {
        ...StyleSheet.absoluteFillObject
    }
});
