import React, { useState } from "react";
import { ComponentProps } from "../routeTypings";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import constants from "../../lib/utils/constants";
import { TextInput } from "react-native-paper";
import { CinePinButton } from "../../lib/components/CinePinButton";

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        marginBottom: 20
    },
    container: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: "30%"
    },
    input: {
        height: 50,
        backgroundColor: "white",
        marginBottom: 20
    },
    submitButton: {
        marginTop: 30
    }
});

export function CreateNewScene(props: ComponentProps<"Aggiungi scena">) {
    const pin = props.route.params;
    const [sceneTitle, setSceneTitle] = useState("");
    const [sceneLink, setSceneLink] = useState("");
    return (
        <SafeAreaView style={styles.container}>
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
            <View>
                <CinePinButton
                    style={styles.submitButton}
                    onPress={() => console.log("Pressed")}
                    message={"Conferma"}
                    disabled={!sceneTitle || !sceneLink}
                />
            </View>
        </SafeAreaView>
    );
}
