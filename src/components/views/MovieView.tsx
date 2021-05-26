import React from "react";
import { Dimensions, Image, Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "../../lib/components/SafeAreaView";
import { ComponentProps } from "../routeTypings";
import { CinePinButton } from "../../lib/components/CinePinButton";
import { db } from "../../db";
import constants from "../../lib/utils/constants";
import CCarousel from "react-native-snap-carousel";
import { MovieCard } from "../../lib/components/MovieCard";
import { MovieLocationRelationShipJoin } from "../../lib/DataLayer";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp (percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const slideHeight = viewportHeight * 0.36;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

export const romeCoordinates = {
    lat: 41.9028,
    lon: 12.4964
};

function randint(max = 100) {
    return Math.floor(Math.random() * Math.floor(max));
}
const { height, width } = Dimensions.get('window');
export function MovieView({ route, navigation }: ComponentProps<"Scheda film">) {
    const movie = route.params.movie;
    const associations = db.getScenesFromMovie(movie.imdbID);
    // console.log(associations.length);
    return (
        <>
            <SafeAreaView style={style.mainContainer}>
                <MovieCard movie={movie} />
                <View style={style.card}>
                    <Text style={style.plot}>{movie.Plot}</Text>
                </View>

                <View style={style.bodyContainer}>
                    <CCarousel<MovieLocationRelationShipJoin>
                        data={associations}
                        renderItem={ass => <Image source={{uri: ass.item.thumbnail}} />}
                        sliderWidth={width}
                        itemWidth={itemWidth}
                        sliderHeight={height}
                        // windowSize={1}
                        // inactiveSlideScale={0.94}
                        // inactiveSlideOpacity={0.7}
                    />
                    {/*<ScrollView style={style.scrollTabs}>*/}
                    {/*    {associations.map(movieProps => {*/}
                    {/*        return (*/}
                    {/*            <Text*/}
                    {/*                style={style.sceneLink}*/}
                    {/*                onPress={() => Linking.openURL(movieProps.scene_video_link)}*/}
                    {/*                key={movieProps.id}*/}
                    {/*            >*/}
                    {/*                {movieProps.scene_name}*/}
                    {/*            </Text>*/}
                    {/*        );*/}
                    {/*    })}*/}
                    {/*</ScrollView>*/}
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
    scrollTabs: {
        padding: "2%",
        textAlign: "center"
    },
    sceneLink: {
        marginBottom: "2%",
        fontSize: 25,
        color: "white",
        textAlign: "center",
        backgroundColor: constants.colors.MAIN_BUTTON,
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
    }
});
