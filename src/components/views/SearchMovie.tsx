import { ComponentProps } from "../routeTypings";
import React from "react";
import { MovieSearch } from "../../lib/components/MovieSearch";
import { SafeAreaView } from "../../lib/components/SafeAreaView";

export function SearchMovie(props: ComponentProps<"CercaFilm">) {
    return (
        <SafeAreaView>
            <MovieSearch
                style={{ padding: 20 } as any}
                onMovieClick={props.route?.params?.onMovieClick}
                onMovieFound={props.route?.params?.onMovieFound}
            />
        </SafeAreaView>
    );
}
