import React, { useState } from "react";
import { StyleProp, Text, View, ViewProps } from "react-native";
import { fetchMovieTitle, Movie } from "../DataLayer";
import { SearchBar } from "./SearchBar";
import { MovieCard } from "./MovieCard";
import constants from "../utils/constants";

export function MovieSearch(props: { style?: StyleProp<ViewProps>, cb?: (err?: string, movie?: Movie) => void }) {
    const [search, setSearch] = useState("");
    const [movie, setMovie] = useState<Movie>(null as any);
    const [err, setErr] = useState("");
    return (
        <View style={props.style}>
            <SearchBar
                safeAreaProps={constants.componentsStyles.searchBar}
                style={constants.componentsStyles.searchBar}
                value={search}
                placeholder={"Cerca film  "}
                onChangeText={text => {
                    if (!text) setMovie(null as any);
                    setSearch(text);
                }}
                onBlur={async () => {
                    const { err, item } = await fetchMovieTitle(search);
                    setErr(err || "");
                    setMovie(item || (null as any));
                    props.cb?.(err, item);
                }}
            />
            {movie && <MovieCard movie={movie} />}
            <Text> {err || ""} </Text>
        </View>
    );
}
