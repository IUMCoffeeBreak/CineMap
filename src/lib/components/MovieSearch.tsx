import React, { useState } from "react";
import { StyleProp, Text, TouchableOpacity, View, ViewProps } from "react-native";
import { fetchMovieTitle, Movie } from "../DataLayer";
import { SearchBar } from "./SearchBar";
import { MovieCard } from "./MovieCard";
import constants from "../utils/constants";

export function MovieSearch(props: { style?: StyleProp<ViewProps>, onMovieFound?: (err?: string, movie?: Movie) => void, onMovieClick?:(movie: Movie) =>void}) {
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
                    props.onMovieFound?.(err, item);
                }}
            />
          {movie && <TouchableOpacity onPress={() => props?.onMovieClick?.(movie)}>
            <MovieCard movie={movie}  />
          </TouchableOpacity>}
            <Text> {err || ""} </Text>
        </View>
    );
}
