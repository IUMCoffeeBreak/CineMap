import React from "react";
import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FilmCard } from "../../lib/components/FilmCard";
import { ViewProps } from "../routeTypings";
import { CinePinButton } from "../../lib/components/CinePinButton";
import constants from "../../lib/utils/constants";

const styles = StyleSheet.create({
    addButton: {
        marginRight: constants.spacing.MARGIN_RIGHT,
        marginLeft: constants.spacing.MARGIN_LEFT
    }
});

export function AssociationsList({ route, navigation }: ViewProps<"Film nel luogo">) {
    const { movies, pin } = route.params;

    const titlePage = {
        empty: "Questo luogo non compare in nessun film",
        nonEmpty: "Questo luogo compare nei seguenti film"
    };

    return (
        <>
            <SafeAreaView style={style.mainContainer}>
                <View style={style.headerContainer}>
                    <Text style={style.title}>{movies.length > 0 ? titlePage.nonEmpty : titlePage.empty}</Text>
                </View>
                <View style={style.bodyContainer}>
                    <ScrollView>
                        <FlatList
                            data={movies}
                            ItemSeparatorComponent={() => (
                                <View
                                    style={{
                                        height: 1,
                                        width: "65%",
                                        backgroundColor: "rgba(0, 0, 0, .5)",
                                        marginLeft: "auto",
                                        marginRight: "5%"
                                    }}
                                />
                            )}
                            renderItem={({ item: movie }) => {
                                return (
                                    <TouchableOpacity
                                        key={movie.imdbID}
                                        onPress={() => navigation.navigate("Scheda film", { movie })}
                                    >
                                        <FilmCard title={movie.Title} preview={movie.Poster} />
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    </ScrollView>
                </View>
                <View style={style.footerContainer}>
                    <CinePinButton
                        message={"Aggiungi Scena"}
                        style={styles.addButton}
                        onPress={() => navigation.navigate("Aggiungi scena", { pin })}
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
