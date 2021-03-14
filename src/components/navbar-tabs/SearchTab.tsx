import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SearchBar } from "../../lib/components/SearchBar";
import { SafeAreaView } from "../../lib/components/SafeAreaView";
import constants from "../../lib/utils/constants";
import { db } from "../../db";
import { Movie } from "../../lib/DataLayer";
import _ from "lodash";
import { ComponentProps } from "../routeTypings";
import { MovieCard } from "../../lib/components/MovieCard";

const searchTabStyles = StyleSheet.create({
    mainContainer: {
        borderWidth: 1,
        borderColor: "blue"
    },
    body: {
        paddingLeft: 30,
        fontSize: constants.text.BODY_FONT
    },
    searchBar: {
        shadowColor: "#bbbbbb",
        shadowOffset: {
            width: 5,
            height: 5
        },
        shadowOpacity: 5,
        shadowRadius: 10
    },
    headerContainer: {
        flex: 1,
        marginTop: 60
    },
    bodyContainer: {}
});

export async function submitSearch(text: string) {
    return await db.searchMovieTitle(text);
}

export function SearchTab({ navigation, route }: ComponentProps<"Scheda film">) {
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
                    safeAreaProps={searchTabStyles.searchBar}
                    style={searchTabStyles.searchBar}
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

                {(!_.isEmpty(movie) && (
                    <MovieCard
                        movie={movie}
                        container={{
                            onTouchEnd: () => {
                                navigation.navigate("Scheda film", { movie });
                            }
                        }}
                    />
                )) || <Text style={searchTabStyles.body}>{err}</Text>}
            </View>
        </SafeAreaView>
    );
}

export default SearchTab;
