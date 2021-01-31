import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import constants from "../utils/constants";

const searchTabStyles = StyleSheet.create({
    card: {
        backgroundColor: "white",
        borderRadius: 20,
        marginLeft: constants.spacing.MARGIN_LEFT * 2,
        marginRight: constants.spacing.MARGIN_RIGHT * 2,
        marginTop: constants.spacing.MARGIN_TOP * 2,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3
    },
    cardTitleText: {
        paddingLeft: 10,
        fontSize: constants.text.TITLE_FONT,
        color: "black", // TODO change palette
        fontWeight: "bold"
    },
    cardBodyText: {
        fontSize: constants.text.BODY_FONT,
        paddingLeft: 10,
        paddingTop: 20,
        paddingBottom: 20
    },
    separator: {
        borderBottomColor: "#cccccc",
        borderBottomWidth: 0.4,
        paddingTop: 10
    },
    searchBar: {
        shadowColor: "#bbbbbb",
        shadowOffset: {
            width: 5,
            height: 5
        },
        shadowOpacity: 5,
        shadowRadius: 10
    }
});

export interface CardItemProps {
    title: string;
    body?: string;
    separator?: boolean;
}

export function CardItem(props: CardItemProps) {
    const [animation] = useState(new Animated.Value(0));
    useEffect(() => {
        Animated.timing(animation, {
            toValue: 1,
            useNativeDriver: true,
            duration: 300
        }).start();
    }, []);
    return (
        <Animated.View style={{ ...searchTabStyles.card, opacity: animation }}>
            <Text style={searchTabStyles.cardTitleText}>{props.title}</Text>
            {(!props.separator && props.separator === undefined) ? (
                <View style={searchTabStyles.separator} />
            ) : null}
            <Text style={searchTabStyles.cardBodyText}>{props.body}</Text>
        </Animated.View>
    );
}
