import { Image, StyleProp, StyleSheet, Text, View, ViewProps, ViewStyle } from "react-native";
import constants from "../utils/constants";
import React from "react";
import { Movie } from "../DataLayer";

const style = StyleSheet.create({
    info: {
        fontSize: constants.text.BODY_FONT
    },
    title: {
        fontSize: constants.text.TITLE_FONT
    },
    poster: {
        aspectRatio: 2 / 3,
        borderRadius: 10
    }
});

export function MovieCard(props: { movie?: Movie | null; container?: ViewStyle }) {
    if (!props || !props?.movie) return null;
    return (
        <View style={{ ...constants.componentsStyles.card, flexDirection: "row", ...props.container }}>
            <View style={{ flex: 1 }}>
                <Text style={style.title}>{props.movie.Title}</Text>
                <Text style={style.info}>Anno: {props.movie.Year}</Text>
                <Text style={style.info}>Rating: {props.movie.imdbRating} / 10</Text>
                <Text style={style.info}>Regista: {props.movie.Director}</Text>
                <Text style={style.info}>Cast: {props.movie.Actors}</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Image style={style.poster} source={{ uri: props.movie.Poster }} />
            </View>
        </View>
    );
}
