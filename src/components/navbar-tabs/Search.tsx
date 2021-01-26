import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextStyle, View } from "react-native";
import { SearchBar } from "../../lib/components/SearchBar";
import { SafeAreaView } from "../../lib/components/SafeAreaView";
import { Movie } from "../../lib/DataLayer";
import constants from "../../lib/utils/constants";
import { db } from "../../db";

const styleCard: TextStyle = {
    backgroundColor: "white",
    borderRadius: 20,
    height: 120,
    marginLeft: constants.spacing.MARGIN_LEFT,
    marginRight: constants.spacing.MARGIN_RIGHT,
    marginTop: constants.spacing.MARGIN_TOP,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3
};

const styles = StyleSheet.create({
    listItem: styleCard,
    title: {
        paddingLeft: 10,
        fontSize: constants.text.TITLE_FONT
    },
    body: {
        fontSize: constants.text.TITLE_FONT / 4
    },
    searchResult: {
        marginLeft: constants.spacing.MARGIN_LEFT * 2,
        marginRight: constants.spacing.MARGIN_RIGHT,
        paddingBottom: 10,
        fontSize: 15
    }
});

function Item(props: Movie) {
    return (
        <View style={styles.listItem}>
            <Text style={styles.title}>{props.title}</Text>
            <Text style={styles.body}>{props.description}</Text>
        </View>
    );
}

function submitSearch(text: string): Movie[] {
    return db.findMoviesByTitleText(text).map(v => v.movie);
}

export function Search() {
    const [search, setSearch] = useState("");
    const [movies, setMovies] = useState<Movie[]>([]);
    const triggerSearch = text => {
        setMovies(submitSearch(text));
    };
    useEffect(() => {
        triggerSearch("");
    }, []);
    const renderItem = ({ item }) => <Item title={item.title} />;

    return (
        <SafeAreaView>
            <SearchBar
                onChangeText={text => {
                    setSearch(text);
                    triggerSearch(text);
                }}
                value={search}
            />
            <FlatList data={movies} renderItem={renderItem} keyExtractor={v => v.title} />
            {(search && (
                <View>
                    <Text style={styles.searchResult}>Risultati ricerca: {movies.length}</Text>
                </View>
            )) ||
                null}
        </SafeAreaView>
    );
}

export default Search;
