import React from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject
    }
});

export function Homepage() {
    return (
        <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ alignItems: "center" }}>Homepage</Text>
        </SafeAreaView>
    );
}
