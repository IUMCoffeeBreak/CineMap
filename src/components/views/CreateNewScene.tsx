import React, { useState } from "react";
import { ComponentProps } from "../routeTypings";
import { Modal, StyleSheet, Text, View, Image, KeyboardAvoidingView, Platform } from "react-native";
import constants from "../../lib/utils/constants";
import { TextInput } from "react-native-paper";
import { CinePinButton } from "../../lib/components/CinePinButton";
import { Movie } from "../../lib/DataLayer";
import _ from "lodash";
import { db } from "../../db";
import { MovieSearch } from "../../lib/components/MovieSearch";
import { SafeAreaView } from "../../lib/components/SafeAreaView";
import { MovieCard } from "../../lib/components/MovieCard";
import { Geolocation } from "../../lib/geolocation";

export function CreateNewScene({ navigation, route }: ComponentProps<any>) {
    const routeData = route.params;
    const [sceneTitle, setSceneTitle] = useState("");
    const [sceneLink, setSceneLink] = useState("");
    const [film, setMovie] = useState<Movie>({} as any);
    const [err, setErr] = useState("");
    const [searchModal, setSearchModal] = useState(true);

    const pin: Geolocation = routeData?.pin;
    const movie: Movie = routeData?.movie;

    return (
        <SafeAreaView style={styles.mainContainer}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <View style={styles.locationContainer}>
                    <Text style={styles.text}>Dove si è svolta la scena che vuoi inserire?</Text>
                    <View style={styles.locationLabel}>
                        <Image style={styles.pinIcon} source={{ uri: "./../../assets/mapMarker.png" }} />
                        <Text style={styles.textLabel}>{pin.display_name}</Text>
                    </View>
                    <CinePinButton message={"Cambia luogo"} onPress={() => {}} style={styles.button} />
                </View>
                <View style={styles.filmContainer}>
                    <Text style={styles.text}>Da quale film è tratta la scena che vuoi inserire?</Text>
                    <View style={styles.movieSearch}>
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
                            }}
                        />
                    </View>
                    <CinePinButton message={"Cambia Film"} onPress={() => {}} style={styles.button} />
                </View>
                <View style={styles.sceneInputContainer}>
                    <Text style={styles.text}>Inserisci un titolo per la scena che vuoi inserire</Text>
                    <TextInput
                        theme={{ colors: { primary: constants.colors.MAIN_GREEN } }}
                        label={"Titolo della scena"}
                        mode={"outlined"}
                        style={styles.input}
                        value={sceneTitle}
                        onChangeText={v => setSceneLink(v)}
                    />
                </View>
                <View style={styles.sceneInputContainer}>
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
                <View style={{flex: 2}}>
                    <CinePinButton message={"Conferma"} onPress={() => {}} style={styles.mainButton} />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        margin: "0%",
        padding: "5%",
        display: "flex",
        height: "100%",
        flexDirection: "column",
        justifyContent: "space-around"
    },
    locationContainer: {
        display: "flex",
        flex: 5,
        justifyContent: "center"
    },
    locationLabel: {
        display: "flex",
        justifyContent: "space-around",
        backgroundColor: "rgba(171, 160, 159, 0.1)",
        borderRadius: 5,
        marginTop: "3%",
        flexDirection: "row"
    },
    filmContainer: {
        flex: 5,
        paddingTop: "5%"
    },
    movieSearch: {
        paddingTop: "5%"
    },
    sceneInputContainer: {
        flex: 3,
        paddingTop: "5%"
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
    pinIcon: {
        width: "auto",
        height: "100%"
    },
    button: {
        color: constants.colors.MAIN_GREEN,
        width: "75%",
        marginTop: "5%",
        alignSelf: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7
        },
        shadowOpacity: 0.41,
        shadowRadius: 9.11,

        elevation: 14
    },
    input: {
        height: 40,
        backgroundColor: "white",
        marginTop: "5%"
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
        shadowRadius: 9.11,

        elevation: 14
    }
});
