import React, { useEffect, useState } from "react";
import { Alert, StyleProp, TouchableOpacity, View, ViewProps } from "react-native";
import { fetchMovieTitle, Movie } from "../DataLayer";
import { SearchBar } from "./SearchBar";
import { MovieCard } from "./MovieCard";
import constants from "../utils/constants";
import { db } from "../../db";

export function MovieSearch(props: {
    style?: StyleProp<ViewProps>;
    onMovieFound?: (err?: string, movie?: Movie) => void;
    onMovieClick?: (movie: Movie) => void;
}) {
    const [search, setSearch] = useState("");
    const [movie, setMovie] = useState<Movie>(null as any);
    const [err, setErr] = useState("");
    useEffect(() => {
        if (!err) return;
        Alert.alert("Attenzione", `Nessun film trovato per ${search}`, [
            {
                text: "Chiudi",
                onPress: () => {
                    setErr("");
                }
            }
        ]);
    }, [err]);
    return (
        <View style={props.style}>
            <SearchBar
                autoFocus={true}
                safeAreaProps={constants.componentsStyles.searchBar}
                style={constants.componentsStyles.searchBar}
                value={search}
                placeholder={"Cerca film"}
                onChangeText={text => {
                    if (!text) setMovie(null as any);
                    setSearch(text);
                }}
                onBlur={async () => {
                    if (!search) return
                    const { err, item } = await fetchMovieTitle(db, search);
                    setErr(err || "");
                    setMovie(item || (null as any));
                    props.onMovieFound?.(err, item);
                }}
            />
            {movie && (
                <TouchableOpacity onPress={() => props?.onMovieClick?.(movie)}>
                    <MovieCard movie={movie} />
                </TouchableOpacity>
            )}
            {/*{err ? (*/}
            {/*    <CinepinModal isVisible={!!err} message={err}>*/}
            {/*        <CinePinButton message={"chiudi"} onPress={() => setErr("")} />*/}
            {/*    </CinepinModal>*/}
            {/*) : null}*/}
        </View>
    );
}
