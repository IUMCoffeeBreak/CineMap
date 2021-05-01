import React, { useState } from "react";
import { ComponentProps } from "../routeTypings";
import { Modal, StyleSheet, Text, View } from "react-native";
import constants from "../../lib/utils/constants";
import { TextInput } from "react-native-paper";
import { CinePinButton } from "../../lib/components/CinePinButton";
import { Movie } from "../../lib/DataLayer";
import _ from "lodash";
import { db } from "../../db";
import { MovieSearch } from "../../lib/components/MovieSearch";
import { SafeAreaView } from "../../lib/components/SafeAreaView";
import { MovieCard } from "../../lib/components/MovieCard";

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: "bold"
    },
    filmContainer: {
        flex: 1,
        justifyContent: "space-around",
        margin: 20
    },
    film: {
        padding: 8,
        borderRadius: 10,
        fontSize: constants.text.TITLE_FONT,
        fontWeight: "bold",
        textAlign: "center",
        color: "black"
    },
    mainContainer: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: "10%"
        // flex: 1,
        // justifyContent: "space-around"
    },
    input: {
        height: 45,
        backgroundColor: "white",
        marginBottom: 20
    },
    submitButton: {
        marginTop: 1,
        marginBottom: "10%"
    }
});

export function CreateNewScene({ navigation, route }: ComponentProps<"Aggiungi scena">) {
    const pin = route.params;
    const [sceneTitle, setSceneTitle] = useState("");
    const [sceneLink, setSceneLink] = useState("");
    const [movie, setMovie] = useState<Movie>({} as any);
    const [err, setErr] = useState("");
    const [searchModal, setSearchModal] = useState(true);

    // const triggerSearch = async text => {
    //     if (!text) return;
    //     const { item, err } = await submitSearch(text);
    //     setErr(err || "");
    //     setMovie(((!err && item) || {}) as any);
    // };

    return (
        <SafeAreaView style={{margin: 30}}>
            <Modal animated animationType={"slide"} visible={searchModal}>
                <View style={{ flex: 1 , marginTop: "30%", margin: 30}}>
                    <MovieSearch onMovieFound={(err, item) => {
                        if (err) setErr(err);
                        else if (item) {
                            setMovie(item);
                        }
                    }} onMovieClick={movie=>{
                        if (movie) setMovie(movie)
                        setSearchModal(false)
                    }}/>
                    <CinePinButton
                        message={"Chiudi"}
                        onPress={() => {
                            setSearchModal(false);
                        }}
                    />
                </View>
            </Modal>
            <CinePinButton
                message={movie ? "cambia film" : "apri"}
                onPress={() => {
                    setSearchModal(true);
                }}
            />
            {movie? <MovieCard movie={movie}/> : null}
            {/*<View>*/}
            {/*<Text style={styles.title}>Fornisci il nome del film</Text>*/}
            {/*<TextInput*/}
            {/*    theme={{ colors: { primary: constants.colors.MAIN_GREEN } }}*/}
            {/*    label={"Cerca nome del film"}*/}
            {/*    mode={"outlined"}*/}
            {/*    style={styles.input}*/}
            {/*    onChangeText={setSearch}*/}
            {/*    onBlur={() => {*/}
            {/*        triggerSearch(search);*/}
            {/*        if (!search) setMovie({} as any);*/}
            {/*    }}*/}
            {/*    value={search}*/}
            {/*/>*/}
            {/*<View style={styles.filmContainer}>*/}
            {/*    {(!_.isEmpty(movie) && <MovieCard movie={movie} />) || (*/}
            {/*        <Text style={{ ...styles.film, color: "#cc0000" }}>{err}</Text>*/}
            {/*    )}*/}
            {/*</View>*/}
            {/*</View>*/}
            <View>
                <Text style={styles.title}>Fornisci il titolo della scena e il link al video YouTube</Text>
                <TextInput
                    theme={{ colors: { primary: constants.colors.MAIN_GREEN } }}
                    label={"Titolo"}
                    mode={"outlined"}
                    style={styles.input}
                    value={sceneTitle}
                    onChangeText={v => setSceneTitle(v)}
                />
                <TextInput
                    theme={{ colors: { primary: constants.colors.MAIN_GREEN } }}
                    label={"Link al video della scena"}
                    mode={"outlined"}
                    style={styles.input}
                    value={sceneLink}
                    onChangeText={v => setSceneLink(v)}
                />
            </View>
            <View>
                <CinePinButton
                    style={styles.submitButton}
                    onPress={() => {
                        db.createMovieLocationAssociation({
                            movie,
                            location: pin,
                            scene_name: sceneTitle,
                            scene_video_link: sceneLink
                        });
                        // db.movieLocAssocModel.write({
                        //     scene_name: sceneTitle,
                        //     scene_video_link: sceneLink,
                        //     movie_id: movie.imdbID,
                        //     location_id: pin.place_id
                        // });
                        // db.locationModel.write(pin);
                        console.log("[from CreateNewScene]:", db.getLocationMovies(pin.place_id));
                        navigation.navigate("Film nel luogo", {
                            pin,
                            associations: db.getLocationMovies(pin.place_id)
                        });
                    }}
                    message={"Conferma"}
                    disabled={!sceneTitle || !sceneLink || _.isEmpty(movie)}
                />
            </View>
        </SafeAreaView>
    );
}
