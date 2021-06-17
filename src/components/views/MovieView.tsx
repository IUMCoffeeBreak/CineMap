import React from "react";
import { Dimensions, Image, StyleSheet, Text, View, ScrollView, Linking } from "react-native";
import { SafeAreaView } from "../../lib/components/SafeAreaView";
import { ComponentProps } from "../routeTypings";
import { CinePinButton } from "../../lib/components/CinePinButton";
import { db } from "../../db";
import constants from "../../lib/utils/constants";
import CCarousel from "react-native-snap-carousel";
import { MovieCard } from "../../lib/components/MovieCard";
import { map } from "lodash";
import { Link } from "@react-navigation/native";
import { color } from "react-native-reanimated";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

export const romeCoordinates = {
    lat: 41.9028,
    lon: 12.4964
};

function randint(max = 100) {
    return Math.floor(Math.random() * Math.floor(max));
}

export function MovieView({ route, navigation }: ComponentProps<"Scheda film">) {
    const movie = route.params.movie;
    const associations = db
        .getScenesFromMovie(movie.imdbID)
        .map((association, id) => ({ id, scene: association.scene_name, link: association.scene_video_link }));
    return (
        <>
            <SafeAreaView style={style.mainContainer}>
                <View style={{ ...constants.componentsStyles.card, flexDirection: "row" }}>
                    <View style={{ flex: 2, marginRight: '2%' }}>
                        <Text style={style.title}>{movie.Title}</Text>
                        <Text style={style.info}>Anno: {movie.Year}</Text>
                        <Text style={style.info}>Rating: {movie.imdbRating} / 10</Text>
                        <Text style={style.info}>Regista: {movie.Director}</Text>
                        <Text style={style.info}>Cast: {movie.Actors}</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: '3%' }}>
                        <Image style={style.poster} source={{ uri: movie.Poster }} />
                    </View>
                </View>
                <View style={style.card}>
                    <Text style={style.plot}>{movie.Plot}</Text>
                </View>

                <View style={style.bodyContainer}>
                    <ScrollView style={style.scrollTabs}>
                        {associations.map(movieProps => {
                            return (
                                <Text
                                    style={style.sceneLink}
                                    onPress={() => Linking.openURL(movieProps.link)}
                                    key={movieProps.id}
                                >
                                    {movieProps.scene}
                                </Text>
                            );
                        })}
                    </ScrollView>
                </View>
                <View style={style.buttonContainer}>
                    <CinePinButton
                        message={"Location di questo film"}
                        onPress={() => navigation.navigate("Luoghi nel film", db.getMovieLocations(movie.Title))}
                    />
                </View>
            </SafeAreaView>
        </>
    );
}

const style = StyleSheet.create({
    mainContainer: {
        flex: 4,
        flexDirection: "column",
        justifyContent: "space-between",
        margin: 10
    },
    headerContainer: {
        flex: 2,
        margin: "3%",
        marginBottom: "1%",
        padding: "3%",
        justifyContent: "space-around",
        borderRadius: 5,
        backgroundColor: "white",
        elevation: 5,
        flexDirection: "row"
    },
    slide: {
        height: windowHeight,
        width: windowWidth,
        justifyContent: "center",
        alignItems: "center"
    },
    slideImage: {
        width: windowWidth * 0.9,
        height: "100%"
    },
    infoContainer: {
        flex: 1
    },
    imageContainer: {
        flex: 1
    },
    bodyContainer: {
        flex: 1,
        flexDirection: "column"
    },
    scrollTabs: {
        padding: "2%",
        textAlign: "center"
    },
    sceneLink: {
        marginBottom: "2%",
        fontSize: 25,
        color: "white",
        textAlign: "center",
        backgroundColor: constants.colors.MAIN_GREEN,
        borderRadius: 5,
        padding: "1%"
    },
    card: {
        backgroundColor: "white",
        borderRadius: constants.borders.RADIUS,
        marginLeft: constants.spacing.MARGIN_LEFT,
        marginRight: constants.spacing.MARGIN_RIGHT,
        marginTop: constants.spacing.MARGIN_TOP,
        marginBottom: constants.spacing.MARGIN_BOTTOM,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3
    },
    plotContainer: {
        margin: "3%",
        marginTop: "4%",
        marginBottom: "1%",
        padding: "3%",
        justifyContent: "space-around",
        borderRadius: 5,
        backgroundColor: "white",
        elevation: 5
    },
    plot: {
        fontSize: 17,
        textAlign: "center"
    },
    footerContainer: {
        flex: 1
    },
    buttonContainer: {
        margin: "3%",
        marginTop: "7%"
    },
    info: {
        fontSize: constants.text.BODY_FONT
    },
    title: {
        fontSize: constants.text.TITLE_FONT
    },
    poster: {
        aspectRatio: 2 / 3,
        borderRadius: 10,
    }
});
