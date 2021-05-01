import { ComponentProps } from "../routeTypings";
import { MovieSearch } from "../../lib/components/MovieSearch";
import { CinePinButton } from "../../lib/components/CinePinButton";
import { View, Text } from "react-native";
import React, { useState } from "react";
import { Movie } from "../../lib/DataLayer";

export function SearchMovieToAssociateView({route, navigation}: ComponentProps<"Cerca film">){
  const {pin}= route.params
  const [movie, setMovie] = useState<Movie>({} as any);
  const [err, setErr] = useState("");
  return <View style={{ flex: 1 , marginTop: "30%", margin: 30}}>
    <MovieSearch onMovieFound={(e, item) => {
      if (e) {
          setErr(e);
          setMovie(null as any)
      }
      else if (item) {
        setMovie(item);
      }
    }} onMovieClick={movie=>{
      if (movie) setMovie(movie)
      navigation.navigate("Dettagli Scena", {pin, movie})
    }}/>
    {err ? <Text> {err} </Text>: null}
  </View>
}
