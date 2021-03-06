import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { FilmCard } from "../../lib/components/FilmCard";
import { ComponentProps } from "../routeTypings";

export const AssociationsList = ({ route, navigation }: ComponentProps<"AddPin">) => {
    const { associations } = route.params;

    const titlePage = {
        empty: "Questa location non compare in nessun film",
        nonEmpty: "Questa location compare nei seguenti film"
    };

    return (
        <>
            <View style={canvas.mainContainer}>
                <Text style={canvas.title}>{associations.length > 0 ? titlePage.nonEmpty : titlePage.empty}</Text>
                <View style={canvas.listView}>
                    {associations.map(association => (
                        <FilmCard title={association.movie!.Title} preview={association.movie!.Poster} />
                    ))}
                </View>
                <Button onPress={() => navigation.navigate("Search")} title="Aggiungi Scena" color="#577b6d" />
            </View>
        </>
    );
};

const canvas = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    title: {
        flex: 1,
        fontSize: 20,
        color: "black",
        padding: "5%",
        fontWeight: "bold"
    },
    listView: {
        flex: 6
    }
});
