import { remove } from 'lodash';
import React from 'react';
import { Image, ImageBackground, StyleSheet, Text, View, Animated, FlatList, Dimensions, Button } from "react-native";
import {FilmCard} from './../../lib/components/filmCard';
import constants from "./../../lib/utils/constants";


//filmList = array({id:string, Movie: Movie-object, location: geolocation})
export const newPin = ({route, navigation}) => {

    const {coordinate, filmList} = route.param;

    const titlePage = {
        empty: 'Questa location non compare in nuessun film',
        nonEmpty: 'Questa location compare nei seguenti film'
    };

    return (
        <>
            <View style={canvas.mainContainer}>
                <Text style={canvas.title}>
                    {
                        filmList.lenght>0
                            ? titlePage.nonEmpty
                            : titlePage.empty 
                    }                    
                </Text> 
                <View style={canvas.listView}>
                    {
                        filmList.map(film => {
                            (coordinate.lat === film.Geolocation.lat && 
                                coordinate.lon === film.Geolocation.lon) &&
                            <FilmCard 
                                key={film.id}
                                preview={film.Movie.Poster}
                                title={film.Movie.Poster}
                            ></FilmCard> 
                        })
                    }
                </View>
                <Button
                    onPress={() => navigation.navigate(constants.tabs.SEARCH)}
                    title='Aggiungi Scena'
                    color="#577b6d"
                />
            </View>
        </>
    );
}

const canvas = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    title: {
        flex: 1,
        fontSize: 20,
        color: 'black',
        padding: '5%',
        fontWeight: 'bold',
    },
    listView: {
        flex: 6
    }

});