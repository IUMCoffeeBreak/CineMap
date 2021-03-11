import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SearchBar } from "../../lib/components/SearchBar";
import { SafeAreaView } from "../../lib/components/SafeAreaView";
import constants from "../../lib/utils/constants";
import { db } from "../../db";
import { Movie } from "../../lib/DataLayer";
import _ from "lodash";
import { TouchableOpacity } from "react-native-gesture-handler";
import { CardItem } from "../../lib/components/CardItem";
import { ComponentProps } from "../routeTypings";

const searchTabStyles = StyleSheet.create({
    mainContainer: {
        flex: 1
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
        flex: 1
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
        <SafeAreaView style={searchTabStyles.mainContainer}>
            <View style={searchTabStyles.headerContainer}>
                <SearchBar
                    safeAreaProps={searchTabStyles.searchBar}
                    style={searchTabStyles.searchBar}
                    placeholder={"Cerca film"}
                    value={search}
                    onChangeText={setSearch}
                    onBlur={() => triggerSearch(search)}
                />
                {/*<TextInput*/}
                {/*    style={searchTabStyles.searchBar}*/}
                {/*    theme={{ colors: { primary: constants.colors.MAIN_GREEN } }}*/}
                {/*    label={"Search for film"}*/}
                {/*    mode={"outlined"}*/}
                {/*    value={search}*/}
                {/*    onBlur={() => triggerSearch(search)}*/}
                {/*    onChangeText={setSearch}*/}
                {/*/>*/}
                <TouchableOpacity onPress={() => navigation.navigate("Scheda film", movie)}>
                    {(!_.isEmpty(movie) && <CardItem title={movie.Title as string} body={movie.Plot} />) || (
                        <Text style={searchTabStyles.body}>{err}</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

export default SearchTab;
