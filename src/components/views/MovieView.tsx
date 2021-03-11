import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Carousel from "../../lib/components/Carousel";
import { SafeAreaView } from "../../lib/components/SafeAreaView";
import { ComponentProps } from "../routeTypings";
import { CinePinButton } from "../../lib/components/CinePinButton";
import { db } from "../../db";

export const romeCoordinates = {
    lat: 41.9028,
    lon: 12.4964
};

export function MovieView({ route, navigation }: ComponentProps<"Scheda film">) {
    const movie = route.params;
    return (
        <>
            <SafeAreaView style={style.mainContainer}>
                <View style={style.headerContainer}>
                    <View style={style.infoContainer}>
                        <Text style={style.title}>{movie.Title}</Text>
                        <Text style={style.info}>
                            {movie.Year} - {movie.imdbRating} / 10 {"\n"}
                            Regista: {movie.Director}
                            {"\n"}
                            Cast: {movie.Actors}
                        </Text>
                    </View>
                    <View style={style.imageContainer}>
                        <Image style={style.poster} source={{ uri: movie.Poster }} />
                    </View>
                </View>
                <View style={style.bodyContainer}>
                    <View style={style.carouselContainer}>
                        <Carousel></Carousel>
                    </View>
                    <View style={style.plotContainer}>
                        <Text style={style.plot}>{movie.Plot}</Text>
                    </View>
                </View>
                <View style={style.footerContainer}>
                    <View style={style.buttonContainer}>
                        <CinePinButton
                            message={"Location di questo film"}
                            onPress={() => navigation.navigate("Luoghi nel film", db.getMovieLocations(movie.Title))}
                        />
                    </View>
                </View>
            </SafeAreaView>
        </>
    );
}

const style = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "space-between"
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
    infoContainer: {
        flex: 1
    },
    title: {
        fontWeight: "bold",
        fontSize: 20,
        marginBottom: "3%"
    },
    info: {
        fontSize: 15
    },
    imageContainer: {
        flex: 1
    },
    poster: {
        resizeMode: "contain",
        width: "80%",
        height: "100%",
        marginLeft: "15%",
        borderRadius: 10
    },
    bodyContainer: {
        flex: 4
    },
    carouselContainer: {
        height: "60%",
        marginTop: "3%"
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
    }
});
