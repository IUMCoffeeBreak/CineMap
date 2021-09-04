import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, View } from "react-native";
import { SearchBar } from "../../lib/components/SearchBar";
import { SafeAreaView } from "../../lib/components/SafeAreaView";
import constants from "../../lib/utils/constants";
import { db } from "../../db";
import { Movie } from "../../lib/DataLayer";
import _ from "lodash";
import { ViewProps } from "../routeTypings";
import { MovieCard } from "../../lib/components/MovieCard";
import { CinePinButton } from "../../lib/components/CinePinButton";

const searchTabStyles = StyleSheet.create({
    mainContainer: {
        borderWidth: 1,
        borderColor: "blue"
    },
    body: {
        paddingLeft: 30,
        fontSize: constants.text.BODY_FONT
    },
    headerContainer: {
        flex: 1,
        marginTop: 60
    },
    bodyContainer: {},

    map: {
        ...StyleSheet.absoluteFillObject
    },
    searchBar: {
        marginTop: 50,
        zIndex: 1,
        shadowColor: "#bbbbbb",
        shadowOffset: {
            width: 5,
            height: 5
        },
        shadowOpacity: 5,
        shadowRadius: 10,
        elevation: 5
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: constants.borders.RADIUS,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 18
    }
});

export async function submitSearch(text: string) {
    return await db.searchMovieTitle(text);
}

export function SearchTab({ navigation, route }: ViewProps<"Scheda film">) {
    const [search, setSearch] = useState("");
    const [movie, setMovie] = useState<Movie>({} as any);
    const [err, setErr] = useState("");
    const triggerSearch = async text => {
        if (!text) return;
        const { item, err } = await submitSearch(text);
        setErr(err || "");
        setMovie(((!err && item) || {}) as any);
    };
    return (
        <SafeAreaView>
            <View style={searchTabStyles.headerContainer}>
                <SearchBar
                    safeAreaProps={constants.componentsStyles.searchBar}
                    style={constants.componentsStyles.searchBar}
                    placeholder={"Cerca film"}
                    value={search}
                    onChangeText={text => {
                        if (!text) {
                            setErr("");
                            setMovie({} as any);
                        }
                        setSearch(text);
                    }}
                    onBlur={() => {
                        triggerSearch(search);
                    }}
                />

                {!_.isEmpty(movie) ? (
                    <MovieCard movie={movie} onPress={() => navigation.navigate("Scheda film", { movie })} />
                ) : null}
            </View>
        </SafeAreaView>
    );
}

export default SearchTab;
