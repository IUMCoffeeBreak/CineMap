import React from "react";
import { SearchBarProps } from "react-native-elements";
import { SafeAreaView, StyleProp, ViewStyle } from "react-native";
import constants from "../utils/constants";
import { Searchbar as PaperSearchBar } from "react-native-paper";

export interface CustomSearchProps extends SearchBarProps {
    safeAreaProps?: StyleProp<ViewStyle>;
    style?: StyleProp<any>;
}

export function SearchBar(props: CustomSearchProps) {
    const borderColor = "rgba(0, 0, 0, 0.5)";
    const borderWidth = 0.5;
    return (
        <SafeAreaView style={{ marginTop: 0, ...(props.safeAreaProps as any) }}>
            <PaperSearchBar
                theme={{ colors: { primary: constants.colors.MAIN_BUTTON } }}
                {...(props as any)}
                style={{ marginLeft: 10, marginRight: 10, ...props?.style }}
            />
        </SafeAreaView>
    );
}
