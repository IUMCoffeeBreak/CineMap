import React from "react";
import { Button } from "react-native-paper";
import { StyleProp } from "react-native";
import constants from "../utils/constants";

export function CinePinButton<T = any>(props: {
    disabled?: boolean;
    message: string;
    style?: StyleProp<T>;
    onPress?: () => void;
}) {
    return (
        <Button
            mode={"contained"}
            theme={{ colors: { primary: constants.colors.MAIN_GREEN } }}
            style={{ ...(props.style as any) }}
            onPress={props?.onPress}
            disabled={props.disabled}
        >
            {props.message}
        </Button>
    );
}
