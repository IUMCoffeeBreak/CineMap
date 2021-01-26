import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject
    }
});

export const romeCoordinates = {
    lat: 41.9028,
    lon: 12.4964
};

export function MapTab({navigation}) {
    return (
        <>
            <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: romeCoordinates.lat,
                        longitude: romeCoordinates.lon,
                        latitudeDelta: 0.5,
                        longitudeDelta: 0.5
                    }}
                >
                    <UrlTile urlTemplate={"http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"} maximumZ={19} flipY={false} />
                    <Marker
                        coordinate={{ latitude: romeCoordinates.lat, longitude: romeCoordinates.lon }}
                        title={"Foo Place"}
                        description={"Im your first place"}
                        onPress={()=>navigation.navigate('MovieView')}

                    />
                </MapView>
            </SafeAreaView>
        </>
    );
}