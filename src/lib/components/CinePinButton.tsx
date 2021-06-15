import React from "react";
import { Button } from "react-native-paper";
import { StyleProp } from "react-native";
import constants from "../utils/constants";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";

export function CinePinButton<T = any>(props: {
    disabled?: boolean;
    message: string;
    style?: StyleProp<T>;
    onPress?: () => void;
    icon?: IconSource;
}) {
    return (
        <Button
            mode={"contained"}
            theme={{ colors: { primary: constants.colors.MAIN_GREEN } }}
            style={{ ...(props.style as any) }}
            onPress={props?.onPress}
            disabled={props.disabled}
            icon={props.icon}
        >
            {props.message}
        </Button>
    );
}
