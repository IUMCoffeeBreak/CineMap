import React from "react";
import { Text } from "react-native";
import MapView from "react-native-maps";
import { LocationPin } from "../lib/utils/types";

export interface MovieScreenProps {
    title: string;
    descripion?: string;
    locationsPins?: LocationPin[];
}

export function MovieScreen(props: MovieScreenProps) {
    return (
        <>
            <Text style={{ alignItems: "center" }}> Movie title: {props.title}</Text>
            <MapView />
        </>
    );
}
