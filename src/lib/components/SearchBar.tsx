import React from "react";
import { SearchBarProps } from "react-native-elements";
import { SafeAreaView, StyleProp, ViewStyle } from "react-native";
import constants from "../utils/constants";
import { Searchbar as PaperSearchBar } from "react-native-paper";

export interface CustomSearchProps extends SearchBarProps {
    safeAreaProps?: StyleProp<ViewStyle>;
    style?: StyleProp<any>;
}

//
// export function SearchBar(props: CustomSearchProps) {
//     const borderColor = "rgba(0, 0, 0, 0.5)";
//     const borderWidth = 0.5;
//
// }

export class SearchBar extends React.Component<any, any> {
    render = () => {
        return (
            <SafeAreaView style={{ marginTop: 0, ...(this.props.safeAreaProps as any) }}>
                <PaperSearchBar
                    theme={{ colors: { primary: constants.colors.MAIN_GREEN } }}
                    {...(this.props as any)}
                    style={{ marginLeft: 10, marginRight: 10, ...this.props?.style }}
                />
            </SafeAreaView>
        );
    };
}
