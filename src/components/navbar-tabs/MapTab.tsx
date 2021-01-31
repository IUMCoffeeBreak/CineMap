import React, { useState } from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";
import constants from "../../lib/utils/constants";
import { SearchBar } from "../../lib/components/SearchBar";
import { SafeAreaView } from "../../lib/components/SafeAreaView";

const mapTabStyles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject
    },
    searchBar: {
        marginTop: 20,
        zIndex: 1,
        shadowColor: "#bbbbbb",
        shadowOffset: {
            width: 5,
            height: 5
        },
        shadowOpacity: 5,
        shadowRadius: 10,
        elevation: 5
    }
});

export const romeCoordinates = {
    lat: 41.9028,
    lon: 12.4964
};

export function MapTab({ navigation }) {
    const [search, setSearch] = useState("");
    return (
        <>
            <SafeAreaView style={{ flex: 1 }}>
                <SearchBar safeAreaProps={mapTabStyles.searchBar} value={search} onChangeText={setSearch} />
                <MapView
                    style={mapTabStyles.map}
                    initialRegion={{
                        latitude: romeCoordinates.lat,
                        longitude: romeCoordinates.lon,
                        latitudeDelta: constants.map.DELTA,
                        longitudeDelta: constants.map.DELTA
                    }}
                >
                    <UrlTile
                        urlTemplate={"http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"}
                        maximumZ={19}
                        flipY={false}
                    />
                    <Marker
                        coordinate={{ latitude: romeCoordinates.lat, longitude: romeCoordinates.lon }}
                        title={"Foo Place"}
                        description={"Im your first place"}
                        onPress={() => navigation.navigate(constants.views.MOVIE)}
                    />
                </MapView>
            </SafeAreaView>
        </>
    );
}
