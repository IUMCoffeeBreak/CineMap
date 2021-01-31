import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { SearchBar } from "../../lib/components/SearchBar";
import { SafeAreaView } from "../../lib/components/SafeAreaView";
import constants from "../../lib/utils/constants";
import { db } from "../../db";
import { Movie } from "../../lib/DataLayer";
import _ from "lodash";
import { TouchableOpacity } from "react-native-gesture-handler";
import { CardItem } from "../../lib/components/CardItem";

const searchTabStyles = StyleSheet.create({
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
    }
});

async function submitSearch(text: string) {
    return await db.searchMovieTitle(text);
}

export function SearchTab({ navigation }) {
    const [search, setSearch] = useState("");
    const [movie, setMovie] = useState<Partial<Movie>>({});
    const [err, setErr] = useState("");
    const triggerSearch = async text => {
        if (!text) return;
        const { item, err } = await submitSearch(text);
        setErr(err || "");
        setMovie((!err && item) || {});
    };
    return (
        <SafeAreaView>
            <SearchBar
                safeAreaProps={searchTabStyles.searchBar}
                onChangeText={setSearch}
                onBlur={() => triggerSearch(search)}
                value={search}
            />
            <TouchableOpacity onPress={() => navigation.navigate(constants.views.MOVIE)}>
                {(!_.isEmpty(movie) && <CardItem title={movie.Title as string} body={movie.Plot} />) || (
                    <Text style={searchTabStyles.body}>{err}</Text>
                )}
            </TouchableOpacity>
        </SafeAreaView>
    );
}

export default SearchTab;
