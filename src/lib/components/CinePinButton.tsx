import React from "react";
import { Button, IconButton } from "react-native-paper";
import { StyleProp } from "react-native";
import constants from "../utils/constants";

export function CinePinButton<T = any>(props: {
    disabled?: boolean;
    message: string;
    style?: StyleProp<T>;
    onPress?: () => void;
    icon?: string;
    color?: string;
}) {
    return (
        <Button
            mode={"contained"}
            theme={{ colors: { primary: constants.colors.MAIN_BUTTON } }}
            style={{ ...(props.style as any) }}
            onPress={props?.onPress}
            disabled={props.disabled}
            icon={props?.icon}
            color={props?.color}
        >
            {props.message}
        </Button>
    );
}

export function CinePinIconButton<T = any>(props: {
    disabled?: boolean;
    style?: StyleProp<T>;
    onPress?: () => void;
    icon: string;
    color?: string;
}) {
    return (
        <IconButton
            theme={{ colors: { primary: constants.colors.MAIN_BUTTON } }}
            style={{ ...(props.style as any) }}
            onPress={props?.onPress}
            disabled={props.disabled}
            icon={props.icon}
            color={props?.color}
        />
    );
}
