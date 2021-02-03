import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import MapView from "react-native-maps";
import { Cast, LocationPin, Preview } from "../../lib/utils/types";
import { SafeAreaView } from "../../lib/components/SafeAreaView";

export interface MovieScreenProps {
    title: string;
    descripion?: string;
    locationsPins?: LocationPin[];
    director: string;
    cast?: Cast[];
    preview: Preview;
}

export const romeCoordinates = {
    lat: 41.9028,
    lon: 12.4964
};

export function MovieView({props: MovieScreenProps, route, navigation}) {

  const {filmTitle, filmActor, filmDirector, filmPlot, filmPoster,
        filmRating, filmYear}=route.params;
  return (
      <>
          <SafeAreaView style={movieViewStyles.mainContainer}>
              <View style={movieViewStyles.headerContainer}>
                  <View style={movieViewStyles.headerInfoContainer}>
                      <Text style={movieViewStyles.title}>
                          {filmTitle}
                      </Text>
                      <Text style={movieViewStyles.headerInfo}>
                          {filmYear}{"\n"}
                          Regista: {filmDirector}
                          {"\n"}Cast: {filmActor}
                      </Text>
                  </View>
                  <Image
                      source={{uri: filmPoster}}
                      resizeMode="contain"
                      style={movieViewStyles.image}
                  />
              </View>
              <MapView
                  style={movieViewStyles.mapView}
                  initialRegion={{
                      latitude: romeCoordinates.lat,
                      longitude: romeCoordinates.lon,
                      latitudeDelta: 0.5,
                      longitudeDelta: 0.5
                  }}
              />
              <Text style={movieViewStyles.cheatSheet}>
                Rating: {filmRating}{"\n\n"}  
                {filmPlot}
              </Text>
          </SafeAreaView>
      </>
  );
}

const movieViewStyles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    headerContainer: {
        flex: 1,
        flexDirection: "row",
        marginTop: 15
    },
    headerInfoContainer: {
        flex: 1
    },
    title: {
        color: "#121212",
        width: 188,
        height: 100,
        textAlign: "center"
    },
    headerInfo: {
        color: "#121212",
        height: 100,
        width: 188,
        textAlign: "center"
    },

    image: {
        width: 188,
        height: 200
    },

    mapView: {
        width: "93%",
        height: 229,
        backgroundColor: "#E6E6E6",
        marginLeft: 15
    },
    cheatSheet: {
        color: "#121212",
        height: 229,
        width: "95%",
        marginTop: 20,
        marginLeft: 15
    }
});
