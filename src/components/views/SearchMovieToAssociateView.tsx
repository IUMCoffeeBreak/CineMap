import { ComponentProps } from "../routeTypings";
import { MovieSearch } from "../../lib/components/MovieSearch";
import { Modal, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Movie } from "../../lib/DataLayer";
import { CinePinButton } from "../../lib/components/CinePinButton";

const style = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 18
    }
});

export function SearchMovieToAssociateView({ route, navigation }: ComponentProps<"Cerca film">) {
    const { pin } = route.params;
    const [movie, setMovie] = useState<Movie>({} as any);
    const [err, setErr] = useState("");
    return (
        <View style={{ flex: 1, marginTop: "30%", margin: 30 }}>
            <MovieSearch
                onMovieFound={(e, _movie) => {
                    if (e) {
                        setErr(e);
                        setMovie(null as any);
                    } else if (_movie) {
                        setErr(null as any);
                        setMovie(_movie);
                    }
                }}
                onMovieClick={movie => {
                    if (movie) setMovie(movie);
                    navigation.navigate("Dettagli Scena", { pin, movie });
                }}
            />
            <Modal visible={!!err} transparent={true} animationType={"fade"}>
                <View style={style.centeredView}>
                    <View style={style.modalView}>
                        <Text style={style.modalText}>
                          {err}
                        </Text>
                        <CinePinButton message={"chiudi"} onPress={() => setErr("")} />
                    </View>
                </View>
            </Modal>
        </View>
    );
}
