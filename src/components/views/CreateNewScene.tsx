import React, { useState } from "react";
import { ComponentProps } from "../routeTypings";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import constants from "../../lib/utils/constants";
import { TextInput } from "react-native-paper";
import { CinePinButton } from "../../lib/components/CinePinButton";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SearchBar } from "../../lib/components/SearchBar";
import { Movie, MovieLocationRelationshipModel } from "../../lib/DataLayer";
import {submitSearch} from "./../navbar-tabs/SearchTab";
import _ from "lodash";
import { db } from "../../../src/db";


const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    filmContainer:{
        flex: 1,
        justifyContent: "space-around",
        margin: 20
    },
    film:{
        padding: 8, 
        borderRadius: 10,
        fontSize: constants.text.BODY_FONT *1.2,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'black'
    },
    mainContainer: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: "10%",
        flex: 1,
        justifyContent: 'space-between'
    },
    innerContainer: {
        justifyContent: "space-around"
    },
    input: {
        height: 50,
        backgroundColor: "white",
        marginBottom: 20
    },
    submitButton: {
        marginTop: 1,
        marginBottom: "10%"
    },
});

export function CreateNewScene(props: ComponentProps<"Aggiungi scena">) {
    const pin = props.route.params;
    const [sceneTitle, setSceneTitle] = useState("");
    const [sceneLink, setSceneLink] = useState("");
    const [search, setSearch] = useState("");
    
    const [movie, setMovie] = useState<Movie>({} as any);
    const [err, setErr] = useState("");
    const triggerSearch = async text => {
        if (!text) return;
        const { item, err } = await submitSearch(text);
        setErr(err || "");
        setMovie(((!err && item) || {}) as any);
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.innerContainer}>
                <Text style={styles.title}>Fornisci il nome del film</Text>
                <TextInput
                    theme={{ colors: { primary: constants.colors.MAIN_GREEN } }}
                    label={"Search film name"}
                    mode={"outlined"}
                    style={styles.input}
                    onChangeText={setSearch}
                    onBlur={() => triggerSearch(search)}
                    value={search}
                />
                <View style={styles.filmContainer}>
                    {(!_.isEmpty(movie) && <Text style={styles.film}>{movie.Title as string}</Text>) || (
                        <Text style={styles.film}>{err}</Text>
                    )}
                </View>
            </View>
            <View style={styles.innerContainer}>
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
                    onPress={() => 
                        {  
                            db.movieLocAssocModel.write({
                                scene_name: sceneTitle,
                                scene_video_link: sceneLink,
                                movie_id: movie.imdbID,
                                location_id: pin.place_id
                            });
                        }
                    }
                    message={"Conferma"}
                    disabled={!sceneTitle || !sceneLink || !search}
                />
            </View>
        </SafeAreaView>
    );
}
