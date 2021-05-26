import { ComponentProps } from "../routeTypings";
import { Image, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-paper";
import constants from "../../lib/utils/constants";
import { CinePinButton } from "../../lib/components/CinePinButton";
import { db } from "../../db";
import _ from "lodash";
import React, { useState } from "react";
import { SafeAreaView } from "../../lib/components/SafeAreaView";
import { launchImageLibrary } from "react-native-image-picker";

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: "bold"
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

export function SceneDetails({ route, navigation }: ComponentProps<"Dettagli Scena">) {
    const { pin, movie } = route.params;
    const [sceneTitle, setSceneTitle] = useState("");
    const [sceneLink, setSceneLink] = useState("");
    const [photo, setPhoto] = useState("");
    return (
        <SafeAreaView style={{ padding: constants.spacing.MARGIN_LEFT }}>
            <View style={{ padding: 20 }}>
                <Text style={styles.title}>Fornisci il titolo della scena e il link al video YouTube</Text>
                <TextInput
                    theme={{ colors: { primary: constants.colors.MAIN_BUTTON } }}
                    label={"Titolo della scena"}
                    mode={"outlined"}
                    style={styles.input}
                    value={sceneTitle}
                    onChangeText={v => setSceneTitle(v)}
                />
                <TextInput
                    theme={{ colors: { primary: constants.colors.MAIN_BUTTON } }}
                    label={"Link al video della scena"}
                    mode={"outlined"}
                    style={styles.input}
                    value={sceneLink}
                    onChangeText={v => setSceneLink(v)}
                />
                {photo ? (
                    <Image style={{ width: "100%", height: "50%", resizeMode: "contain" }} source={{ uri: photo }} />
                ) : null}
                <CinePinButton
                    icon={"image"}
                    message={photo ? "cambia foto" : "scegli foto"}
                    onPress={() => {
                        launchImageLibrary(
                            {
                                mediaType: "photo",
                                includeBase64: true,
                                quality: 0.5,
                                maxWidth: 300,
                                maxHeight: 200
                            },
                            imagePickerResponse => {
                                const image = imagePickerResponse.base64
                                    ? `data:${imagePickerResponse.type};base64,${imagePickerResponse.base64}`
                                    : "";
                                setPhoto(image);
                            }
                        );
                    }}
                />
                {/*<CinePinIconButton*/}
                {/*    icon={"delete"}*/}
                {/*    color={"white"}*/}
                {/*    style={{ borderRadius: 3, backgroundColor: constants.colors.MAIN_BUTTON }}*/}
                {/*    onPress={() => {*/}
                {/*        setPhoto("");*/}
                {/*    }}*/}
                {/*/>*/}
            </View>
            <View style={{ padding: 20 }}>
                <CinePinButton
                    style={styles.submitButton}
                    onPress={() => {
                        db.createMovieLocationAssociation({
                            movie,
                            location: pin,
                            scene_name: sceneTitle,
                            scene_video_link: sceneLink,
                            thumbnail: photo
                        });
                        navigation.navigate("Film nel luogo", {
                            pin,
                            movies: db.getMoviesByLocation(pin.place_id)
                        });
                    }}
                    message={"Conferma"}
                    disabled={!sceneTitle || !sceneLink || _.isEmpty(movie)}
                />
            </View>
        </SafeAreaView>
    );
}
