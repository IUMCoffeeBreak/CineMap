import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import MapView from "react-native-maps";
import { Cast, LocationPin, Preview } from "../../lib/utils/types";

export interface MovieScreenProps {
    title: string;
    descripion?: string;
    locationsPins?: LocationPin[];
    director: string;
    cast?: Cast[];
    preview: Preview;
}

export function MovieView(props: MovieScreenProps) {
    return (
        <>
            <View style={styles.container}>
                <View style={styles.titoloColumnRow}>
                    <View style={styles.titoloColumn}>
                        <Text style={styles.title}>
                            {/* {props.title} */}
                            Title
                        </Text>
                        <Text style={styles.headerInfo}>
                            0000 - Diretto da{"\n"}
                            Regista: {/* {props.director} */}
                            {"\n"}Cast: {/* {props.cast} */}
                            Attore0, Attore1, Attore2, Attore3, Attore4, Attore5, Attore6
                        </Text>
                    </View>
                    <Image
                        // {props.preview}
                        source={require("../../img/IMG.png")}
                        resizeMode="contain"
                        style={styles.image}
                    />
                </View>
                <MapView style={styles.mapView}></MapView>
                <Text style={styles.cheatSheet}>
                    {/* {props.descripion} */}
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, repudiandae? Quam facilis
                    corrupti, iure odio ipsum placeat aperiam expedita accusantium, sunt nulla sapiente ullam porro
                    aliquam blanditiis consequuntur architecto delectus!
                </Text>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    title: {
        color: "#121212",
        height: 86,
        width: 188,
        textAlign: "center"
    },
    headerInfo: {
        color: "#121212",
        height: 100,
        width: 178,
        marginTop: 14,
        marginLeft: 10
    },
    titoloColumn: {
        width: 188
    },
    image: {
        width: 178,
        height: 200
    },
    titoloColumnRow: {
        height: 200,
        flexDirection: "row",
        marginTop: 53,
        marginRight: 9
    },
    mapView: {
        width: 355,
        height: 205,
        backgroundColor: "#E6E6E6",
        marginTop: 20,
        marginLeft: 10
    },
    cheatSheet: {
        color: "#121212",
        height: 270,
        width: 355,
        marginTop: 18,
        marginLeft: 10
    }
});
