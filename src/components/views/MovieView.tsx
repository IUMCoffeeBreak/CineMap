import React, { useEffect, useState } from "react";
import { Image, ImageBackground, StyleSheet, Text, View, Animated } from "react-native";
import MapView from "react-native-maps";
import { SafeAreaView } from "../../lib/components/SafeAreaView";

export const romeCoordinates = {
    lat: 41.9028,
    lon: 12.4964
};

export function MovieView({route, navigation}) {

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
                          {filmYear} - {filmRating} / 10 {'\n'}
                          Regista: {filmDirector}{'\n'}
                          Cast: {filmActor}
                      </Text>
                  </View>
                    <ImageBackground
                        style={movieViewStyles.image}
                        source={{uri: filmPoster}}
                        resizeMode='contain'
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
            <View style={movieViewStyles.cheatSheetContainer}>
                <Text style={movieViewStyles.cheatSheet}> 
                    {filmPlot}
                </Text>
            </View>
        </SafeAreaView>
      </>
  );
}

const movieViewStyles = StyleSheet.create({
    mainContainer: {
        flex: 1,

    },
    headerContainer: {
        flex: 1,
        flexDirection: "row",
        marginTop: 15,
        backgroundColor: 'white',
        borderRadius: 5,
        margin: 15,
        shadowOffset: {
            height: 0,
            width: 1
          },
        elevation: 5,
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    headerInfoContainer: {
        flex: 1,

    },
    title: {
        color: 'black',
        fontSize: 20,
        maxWidth: '80%',
        fontWeight: 'bold',
        fontStyle: 'italic',
        margin: 15
    },


    headerInfo: {
        color: 'black',
        height: 100,
        width: 188,
        margin: 15,
        marginBottom: 0,
        fontStyle: 'italic'
    },

    image: {
        width: 138,
        height: 200,
        marginTop: 1,
    },

    mapView: {
        width: "93%",
        height: 230,
        borderRadius: 10,
        backgroundColor: "#E6E6E6",
        marginLeft: 15,
        shadowOffset: {
            height: 0,
            width: 1
          },
        elevation: 5,
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

    },

    cheatSheetContainer: {
        backgroundColor: 'white',
        width: "93%",
        shadowOffset: {
            height: 0,
            width: 1
          },
        elevation: 5,
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        margin: 15,
        marginBottom: 135,
        borderRadius: 5
    },
    cheatSheet: {
        fontStyle: 'italic',
        fontSize: 15,
        color: "black",
        textAlign: 'center',
        margin: 15

        
        
    }
});
