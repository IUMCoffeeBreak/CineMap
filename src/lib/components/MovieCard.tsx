import { Image, StyleProp, StyleSheet, Text, View, ViewProps } from "react-native";
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
        resizeMode: "contain",
        width: 200,
        height: 200,
        // marginLeft: "15%",
        borderRadius: 10
    }
});

export function MovieCard(props: { movie: Movie , container?: StyleProp<ViewProps>}) {
    if (!props || !props?.movie) return null;
    return (
        // <View
        //     style={{
        //         ...constants.componentsStyles.card,
        //         flex: 2,
        //         justifyContent: "space-around",
        //         flexDirection: "row",
        //     }}
        // >
        //     <View style={{ flex: 1, flexDirection: "column" }}>
        //         <Text style={{ fontSize: constants.text.TITLE_FONT }}>{props.movie.Title}</Text>
        //         <Text style={style.info}>Anno: {props.movie.Year}</Text>
        //         <Text style={style.info}>Rating: {props.movie.imdbRating} / 10</Text>
        //         <Text style={style.info}>Regista: {props.movie.Director}</Text>
        //         <Text style={style.info}>Cast: {props.movie.Actors}</Text>
        //     </View>
        //     <View style={{ flex: 1 }}>
        //         <Image style={style.poster} source={{ uri: props.movie.Poster }} />
        //     </View>
        // </View>
        <View style={{ ...constants.componentsStyles.card, flexDirection: "row" }} {...props.container}>
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
