import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "../../lib/components/SafeAreaView";
import { ComponentProps } from "../routeTypings";
import { CinePinButton } from "../../lib/components/CinePinButton";
import { db } from "../../db";
import constants from "../../lib/utils/constants";
import CCarousel from "react-native-snap-carousel";
import { MovieCard } from "../../lib/components/MovieCard";

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
    return (
        <>
            <SafeAreaView style={style.mainContainer}>
                <MovieCard movie={movie}/>
                <View style={style.bodyContainer}>
                    <View style={style.carouselContainer}>
                        <CCarousel<number>
                            data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                            renderItem={item => (
                                <View key={item} style={style.slide}>
                                    <Image
                                        source={{ uri: `https://picsum.photos/1440/2842?random=${randint()}` }}
                                        style={style.slideImage}
                                    />
                                </View>
                            )}
                            sliderWidth={windowWidth}
                            itemWidth={windowWidth}
                            sliderHeight={windowHeight}
                            windowSize={1}
                        />
                    </View>
                </View>
                <View style={style.card}>
                    <Text style={style.plot}>{movie.Plot}</Text>
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
        flex: 1,
        flexDirection: "column"
    },
    carouselContainer: {
        flex: 1,
        marginTop: "3%"
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
    }
});
