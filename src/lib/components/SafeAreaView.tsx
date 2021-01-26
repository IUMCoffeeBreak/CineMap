import React from "react";
import { SafeAreaView as SAV } from "react-native";
import constants from "../utils/constants";

export function SafeAreaView(props) {
    return (
        <SAV
            style={{ flex: 1, backgroundColor: constants.colors.GLOBAL_BACKGROUND_COLOR, ...props.style }}
            {...props}
        />
    );
}
