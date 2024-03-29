import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
    const { movies, pin } = route.params;

    const titlePage = {
        empty: "Questa location non compare in nessun film",
        nonEmpty: "Questa location compare nei seguenti film"
    };

    return (
        <>
            <SafeAreaView style={style.mainContainer}>
                <View style={style.headerContainer}>
                    <Text style={style.title}>{movies.length > 0 ? titlePage.nonEmpty : titlePage.empty}</Text>
                </View>
                <View style={style.bodyContainer}>
                    <ScrollView>
                        {movies.map((movie, id) => {
                            return (
                                <TouchableOpacity
                                    key={id}
                                    onPress={() => navigation.navigate("Scheda film", { movie })}
                                >
                                    <FilmCard title={movie.Title} preview={movie.Poster} />
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>
                <View style={style.footerContainer}>
                    <CinePinButton
                        message={"Aggiungi Scena"}
                        style={styles.addButton}
                        onPress={() => navigation.navigate("Cerca film", { pin })}
                    />
                </View>
            </SafeAreaView>
        </>
    );
}

const style = StyleSheet.create({
    mainContainer: {
        flex: 1,
        margin: "3%"
    },
    headerContainer: {
        flex: 1,
        justifyContent: "space-around",
        padding: "5%"
    },
    title: {
        fontSize: 20,
        fontWeight: "bold"
    },
    bodyContainer: {
        flex: 5
    },
    footerContainer: {
        flex: 1,
        justifyContent: "space-around"
    }
});
