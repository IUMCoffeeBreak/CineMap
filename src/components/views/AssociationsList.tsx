import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { FilmCard } from "../../lib/components/FilmCard";
import { ComponentProps } from "../routeTypings";
import { CinePinButton } from "../../lib/components/CinePinButton";
import constants from "../../lib/utils/constants";

const styles = StyleSheet.create({
    addButton: {
        marginRight: constants.spacing.MARGIN_RIGHT,
        marginLeft: constants.spacing.MARGIN_LEFT
    }
});

export function AssociationsList({ route, navigation }: ComponentProps<"Film nel luogo">) {
    const { associations, pin } = route.params;

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
                    <CinePinButton
                        message={"Aggiungi Scena"}
                        style={styles.addButton}
                        onPress={() => navigation.navigate("Aggiungi scena", pin)}
                    />
                </View>
            </View>
        </>
    );
}

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
