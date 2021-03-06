import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export interface filmProps {
    title: string;
    preview: string;
}

export function FilmCard(props: filmProps) {
    return (
        <>
            <View style={card.mainContainer}>
                <Image style={card.img} source={{ uri: props.preview }} resizeMode="contain" />
                <Text style={card.text}>{props.title}</Text>
            </View>
        </>
    );
}

const card = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: "5%",
        backgroundColor: "grey"
    },
    img: {
        flex: 1,
        padding: 10
    },
    text: {
        fontSize: 20,
        flex: 2,
        padding: "5%"
    }
});
