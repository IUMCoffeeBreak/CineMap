import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { SearchBar } from "../../lib/components/SearchBar";
import { SafeAreaView } from "../../lib/components/SafeAreaView";
import constants from "../../lib/utils/constants";
import { db } from "../../db";
import { Movie } from "../../lib/DataLayer";
import _ from "lodash";

const styles = StyleSheet.create({
    card: {
        backgroundColor: "white",
        borderRadius: 20,
        marginLeft: constants.spacing.MARGIN_LEFT * 2,
        marginRight: constants.spacing.MARGIN_RIGHT * 2,
        marginTop: constants.spacing.MARGIN_TOP * 2,
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
    cardTitleText: {
        paddingLeft: 10,
        fontSize: constants.text.TITLE_FONT,
        color: "black", // TODO change palette
        fontWeight: "bold"
    },
    cardBodyText: {
        fontSize: constants.text.BODY_FONT,
        paddingLeft: 10,
        paddingTop: 20,
        paddingBottom: 20
    },
    body: {
        paddingLeft: 30,
        fontSize: constants.text.BODY_FONT
    },
    separator: {
        borderBottomColor: "#cccccc",
        borderBottomWidth: 0.4,
        paddingTop: 10
    },
    searchResult: {
        marginLeft: constants.spacing.MARGIN_LEFT * 2,
        marginRight: constants.spacing.MARGIN_RIGHT,
        paddingBottom: 10,
        fontSize: 15
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

function Item(props: Partial<Movie>) {
    const [animation] = useState(new Animated.Value(0));
    useEffect(() => {
        Animated.timing(animation, {
            toValue: 1,
            useNativeDriver: true,
            duration: 300
        }).start();
    }, []);
    return (
        <Animated.View style={{ ...styles.card, opacity: animation }}>
            <Text style={styles.cardTitleText}>{props.Title}</Text>
            <View style={styles.separator} />
            <Text style={styles.cardBodyText}>{props.Plot}</Text>
        </Animated.View>
    );
}

async function submitSearch(text: string) {
    return await db.searchMovieTitle(text);
}

export function SearchTab() {
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
            <SearchBar safeAreaProps={styles.searchBar} onChangeText={setSearch} onBlur={() => triggerSearch(search)} value={search} />
            {(!_.isEmpty(movie) && <Item Title={movie.Title} Plot={movie.Plot} />) || (
                <Text style={styles.body}>{err}</Text>
            )}
        </SafeAreaView>
    );
}

export default SearchTab;
