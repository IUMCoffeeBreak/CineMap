import React from "react";
import { SearchBar as RNSearchBar, SearchBarProps } from "react-native-elements";
import { SafeAreaView } from "react-native";
import constants from "../utils/constants";

export function SearchBar(props: SearchBarProps) {
    const borderColor = "rgba(0, 0, 0, 0.5)";
    const borderWidth = 0.5;
    return (
        <SafeAreaView style={{ marginTop: 100 }}>
            <RNSearchBar
                containerStyle={{
                    backgroundColor: constants.colors.TRANSPARENT,
                    borderTopColor: constants.colors.TRANSPARENT,
                    borderBottomColor: constants.colors.TRANSPARENT,
                    marginLeft: constants.spacing.MARGIN_LEFT,
                    marginRight: constants.spacing.MARGIN_RIGHT
                }}
                inputContainerStyle={{
                    backgroundColor: constants.cards.BACKGROUND_COLOR,
                    borderColor: borderColor,
                    borderRadius: constants.cards.RADIUS,
                    borderWidth: borderWidth,
                    borderBottomWidth: borderWidth
                }}
                placeholder={"Cerca..."}
                cancelButtonTitle={"Cancella"}
                {...props}
            />
        </SafeAreaView>
    );
}
