import React from "react";
import { SearchBar as RNSearchBar, SearchBarProps } from "react-native-elements";
import { SafeAreaView, StyleProp, ViewStyle } from "react-native";
import constants from "../utils/constants";

export interface CustomSearchProps extends SearchBarProps {
    safeAreaProps?: StyleProp<ViewStyle>;
}

export function SearchBar(props: CustomSearchProps) {
    const borderColor = "rgba(0, 0, 0, 0.5)";
    const borderWidth = 0.5;
    return (
        <SafeAreaView style={{ marginTop: 100, ...(props.safeAreaProps as any) }}>
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
