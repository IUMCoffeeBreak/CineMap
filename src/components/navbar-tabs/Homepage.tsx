import React from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import MapView, { UrlTile } from "react-native-maps";

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject
    }
});

export function Homepage() {
    return (
        <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ alignItems: "center" }}>Homepage</Text>
            {/* Native map example */}
            {/*<MapView*/}
            {/*  */}
            {/*    style={styles.map}*/}
            {/*    initialRegion={{*/}
            {/*        latitude: 41.9028,*/}
            {/*        longitude: 12.4964,*/}
            {/*        latitudeDelta: 0.5,*/}
            {/*        longitudeDelta: 0.5*/}
            {/*    }}*/}
            {/*/>*/}

            {/* OSM Example*/}
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 41.9028,
                    longitude: 12.4964,
                    latitudeDelta: 0.5,
                    longitudeDelta: 0.5
                }}
            >
                <UrlTile urlTemplate={"http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"} maximumZ={19} flipY={false} />
            </MapView>
        </SafeAreaView>
    );
}
