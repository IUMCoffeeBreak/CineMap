import { ComponentProps } from "../routeTypings";
import { StyleSheet, Text, View, Image } from "react-native";
import { TextInput } from "react-native-paper";
import constants from "../../lib/utils/constants";
import { CinePinButton } from "../../lib/components/CinePinButton";
import { db } from "../../db";
import _ from "lodash";
import React, { useState } from "react";
import { SafeAreaView } from "../../lib/components/SafeAreaView";
import { MovieSearch } from "../../lib/components/MovieSearch";
import { Movie } from "../../lib/DataLayer";


export function SceneDetails({ route, navigation }: ComponentProps<"Dettagli Scena">) {
    const { pin, movie } = route.params;
    const [sceneTitle, setSceneTitle] = useState("");
    const [sceneLink, setSceneLink] = useState("");
    const [film, setMovie] = useState<Movie>({} as any);
    const [err, setErr] = useState("");
    const [searchModal, setSearchModal] = useState(true);

    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.locationContainer}>
                <Text style={styles.text}>
                    Dove si è svolta la scena che vuoi inserire?
                </Text>
                <View style={styles.locationLabel}>
                    {/* <Image 
                        style={styles.pinIcon}
                        source={require('./../../assets/')}
                    /> */}
                    <Text style={styles.text}>
                        Location
                    </Text>
                </View>
            </View>
            {/* <View style={styles.filmContainer}>
                <Text style={styles.text}>
                    Da quale film è tratta la scena che vuoi inserire?
                </Text>
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
                <CinePinButton 
                    message={''}
                    onPress={()=> {}}
                />
            </View> */}
            {/* <View style={styles.sceneTitleContainer}>

            </View>
            <View style={styles.sceneLinkContainer}>

            </View> */}


            {/* <View style={{ padding: 20 }}>
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
            <View style={{ padding: 20 }}>
                <CinePinButton
                    style={styles.submitButton}
                    onPress={() => {
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
                    }}
                    message={"Conferma"}
                    disabled={!sceneTitle || !sceneLink || _.isEmpty(movie)}
                />
            </View> */}
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    mainContainer: {
        margin: '0%',
        padding: '10%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    locationContainer: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',

    },
    locationLabel: {
        backgroundColor: 'yellow',
        width: '100%',
        justifyContent: 'space-between',
    },
    filmContainer: {
        flex: 1
    },
    sceneTitleContainer: {
        flex: 1
    },
    sceneLinkContainer: {
        flex: 1
    },
    text: {
        alignSelf: 'center',
        fontSize: 18,
        fontWeight: 'bold'
    },
    pinIcon: {}
});