import React from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import Carousel from "../../lib/components/Carousel";
import { SafeAreaView } from "../../lib/components/SafeAreaView";
import { ComponentProps } from "../routeTypings";

export const romeCoordinates = {
    lat: 41.9028,
    lon: 12.4964
};

export function MovieView({ route, navigation }: ComponentProps<"Movie">) {
    // const { filmTitle, filmActor, filmDirector, filmPlot, filmPoster, filmRating, filmYear } = route.params;
    const movie = route.params;
    return (
        <>
            <SafeAreaView style={movieViewStyles.mainContainer}>
                <View style={movieViewStyles.headerContainer}>
                    <View style={movieViewStyles.headerInfoContainer}>
                        <Text style={movieViewStyles.title}>{movie.Title}</Text>
                        <Text style={movieViewStyles.headerInfo}>
                            {movie.Year} - {movie.imdbRating} / 10 {"\n"}
                            Regista: {movie.Director}
                            {"\n"}
                            Cast: {movie.Actors}
                        </Text>
                    </View>
                    <ImageBackground
                        style={movieViewStyles.image}
                        source={{ uri: movie.Poster }}
                        resizeMode="contain"
                    />
                </View>
                <Carousel />
                <View style={movieViewStyles.cheatSheetContainer}>
                    <Text style={movieViewStyles.cheatSheet}>{movie.Plot}</Text>
                </View>
            </SafeAreaView>
        </>
    );
}

const movieViewStyles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    headerContainer: {
        flex: 1,
        flexDirection: "row",
        marginTop: 15,
        backgroundColor: "white",
        borderRadius: 5,
        margin: 15,
        shadowOffset: {
            height: 0,
            width: 1
        },
        elevation: 5,
        shadowOpacity: 0.22,
        shadowRadius: 2.22
    },
    headerInfoContainer: {
        flex: 1
    },
    title: {
        color: "black",
        fontSize: 20,
        maxWidth: "80%",
        fontWeight: "bold",
        fontStyle: "italic",
        margin: 15
    },

    headerInfo: {
        color: "black",
        height: 100,
        width: 188,
        margin: 15,
        marginBottom: 0,
        fontStyle: "italic"
    },

    image: {
        width: 138,
        height: 200,
        marginTop: 1
    },

    CarouselView: {
        width: "93%",
        height: 230,
        borderRadius: 10,
        backgroundColor: "#E6E6E6",
        marginLeft: 15,
        shadowOffset: {
            height: 0,
            width: 1
        },
        elevation: 5,
        shadowOpacity: 0.22,
        shadowRadius: 2.22
    },

    cheatSheetContainer: {
        backgroundColor: "white",
        width: "93%",
        shadowOffset: {
            height: 0,
            width: 1
        },
        elevation: 5,
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        margin: 15,
        marginBottom: 135,
        borderRadius: 5
    },
    cheatSheet: {
        fontStyle: "italic",
        fontSize: 15,
        color: "black",
        textAlign: "center",
        margin: 15
    }
});
