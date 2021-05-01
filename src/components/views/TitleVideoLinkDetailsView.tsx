import { ComponentProps } from "../routeTypings";
import { StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-paper";
import constants from "../../lib/utils/constants";
import { CinePinButton } from "../../lib/components/CinePinButton";
import { db } from "../../db";
import _ from "lodash";
import React, { useState } from "react";
import { SafeAreaView } from "../../lib/components/SafeAreaView";

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: "bold"
    },
    input: {
        height: 45,
        backgroundColor: "white",
        marginBottom: 20,
    },
    submitButton: {
        marginTop: 1,
        marginBottom: "10%"
    }
});

export function TitleVideoLinkDetailsView({ route, navigation }: ComponentProps<"Dettagli Scena">) {
    const { pin , movie} = route.params;
    const [sceneTitle, setSceneTitle] = useState("");
    const [sceneLink, setSceneLink] = useState("");
    return (
        <SafeAreaView style={{padding: constants.spacing.MARGIN_LEFT}}>
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
                        const associations = db.getAssociations()
                        // console.log("[from CreateNewScene]: associations",associations);
                        navigation.navigate("Film nel luogo", {
                            pin,
                            associations
                        });
                    }}
                    message={"Conferma"}
                    disabled={!sceneTitle || !sceneLink || _.isEmpty(movie)}
                />
            </View>
        </SafeAreaView>
    );
}
