import React, { LegacyRef } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";
import constants from "../../lib/utils/constants";
import { SearchBar } from "../../lib/components/SearchBar";
import { SafeAreaView } from "../../lib/components/SafeAreaView";
import { Geolocation, searchLocation } from "../../lib/geolocation";
import { db } from "../../db";
import { ComponentProps } from "../routeTypings";
import { CinePinButton } from "../../lib/components/CinePinButton";
import { fetchMovieTitle, Movie } from "../../lib/DataLayer";
import SegmentedControl from "@react-native-segmented-control/segmented-control";

const mapTabStyles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject
    },
    searchBar: {
        marginTop: 50,
        zIndex: 1,
        shadowColor: "#bbbbbb",
        shadowOffset: {
            width: 5,
            height: 5
        },
        shadowOpacity: 5,
        shadowRadius: 10,
        elevation: 5
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: constants.borders.RADIUS,
        padding: 10,
        elevation: 2
    },
    filterButton: {
        zIndex: 1,
        height: 40,
        width: 140
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 18
    }
});

export const romeCoordinates = {
    lat: 41.905611,
    lon: 12.482362
};

interface State {
    searchErr: string;
    locationSearchText: string;
    allLocations: Geolocation[];
    searchedLocation: Geolocation[];
    selectedLocation: Geolocation | null;
    showAllLocations: boolean;
    showUnassociatedMoviesModal: boolean;
    showUnassociatedPinModal: boolean;
    showSearchedMovieLocations: boolean;
    searchedMovieLocations: Geolocation[];
    filterByLocation: boolean;
    isSearchbarFocused: boolean;
}

export class MapTab extends React.Component<ComponentProps<"Map">, State> {
    state = {
        searchErr: "",
        locationSearchText: "",
        allLocations: [],
        searchedLocation: [],
        selectedLocation: null,
        showAllLocations: false,
        showUnassociatedMoviesModal: false,
        showUnassociatedPinModal: false,
        showSearchedMovieLocations: false,
        searchedMovieLocations: [],
        filterByLocation: true,
        isSearchbarFocused: false
    };
    componentDidMount = () => {
        db.onReady().then(() => {
            const locations = db.getAllRegisteredLocations();
            this.setState({ allLocations: locations });
        });
    };

    searchBarRef: LegacyRef<any>;
    map: MapView;

    renderMarkers = (locations: Geolocation[], cb?: (movies: Movie[]) => boolean) => {
        return locations.map((pin, i) => (
            <Marker
                key={`${i}-${pin.display_name}`}
                coordinate={{ latitude: pin.lat, longitude: pin.lon }}
                title={pin.display_name}
                onPress={() => {
                    this.setState({ selectedLocation: pin });
                    if (this.props.route.params?.movie)
                        return this.props.navigation.navigate("Scheda film", {
                            movie: this.props.route.params.movie
                        });
                    const moviesInLocation = db.getMoviesByLocation(pin.place_id);
                    if (cb && !cb(moviesInLocation)) return;
                    return this.props.navigation.navigate("Film nel luogo", {
                        pin,
                        movies: moviesInLocation
                    });
                }}
            />
        ));
    };

    render = () => {
        return (
            <SafeAreaView>
                <Modal visible={!!this.state.searchErr} transparent={true} animationType={"fade"}>
                    <View style={mapTabStyles.centeredView}>
                        <View style={mapTabStyles.modalView}>
                            <Text style={mapTabStyles.modalText}>{this.state.searchErr}</Text>
                            <CinePinButton message={"Chiudi"} onPress={() => this.setState({ searchErr: "" })} />
                        </View>
                    </View>
                </Modal>
                <Modal visible={this.state.showUnassociatedPinModal} transparent={true} animationType={"fade"}>
                    <View style={mapTabStyles.centeredView}>
                        <View style={mapTabStyles.modalView}>
                            <View>
                                <Text style={mapTabStyles.modalText}>
                                    Questo luogo non è ancora stato associato ad un film
                                </Text>
                                <View style={{ flexDirection: "row" }}>
                                    <CinePinButton
                                        message={"Aggiungi scena"}
                                        style={{ margin: 10 }}
                                        onPress={() => {
                                            this.setState({ showUnassociatedPinModal: false }, () => {
                                                this.props.navigation.push("Aggiungi scena", {
                                                    pin: this.state.selectedLocation
                                                });
                                            });
                                        }}
                                    />
                                    <CinePinButton
                                        style={{ margin: 10 }}
                                        message={"Chiudi"}
                                        onPress={() => this.setState({ showUnassociatedPinModal: false })}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal visible={this.state.showUnassociatedMoviesModal} transparent={true} animationType={"fade"}>
                    <View style={mapTabStyles.centeredView}>
                        <View style={mapTabStyles.modalView}>
                            <View>
                                <Text style={mapTabStyles.modalText}>
                                    Questo film non è ancora stato inserito sulla mappa
                                </Text>
                                <View style={{ flexDirection: "row" }}>
                                    <CinePinButton
                                        message={"Aggiungi scena"}
                                        style={{ margin: 10 }}
                                        onPress={() => {
                                            this.setState({ showUnassociatedMoviesModal: false }, () => {
                                                this.props.navigation.push("Aggiungi scena", {
                                                    movie: this.props.route.params.movie
                                                });
                                            });
                                        }}
                                    />
                                    <CinePinButton
                                        style={{ margin: 10 }}
                                        message={"Chiudi"}
                                        onPress={() => this.setState({ showUnassociatedMoviesModal: false })}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
                <SearchBar
                    // editable={filterByLocation}
                    ref={r => (this.searchBarRef = r as any)}
                    style={{ marginLeft: 20, marginRight: 20, marginTop: 0, marginBottom: 10 }}
                    safeAreaProps={mapTabStyles.searchBar}
                    value={this.state.locationSearchText}
                    placeholder={`Cerca ${this.state.filterByLocation ? "luogo" : "film"}`}
                    onChangeText={text => {
                        this.setState({ locationSearchText: text });
                        // setReadRwiteSearchBarText(text);
                        if (!text) {
                            this.setState({ showAllLocations: true, searchErr: "" });
                        } else {
                            this.setState({ showAllLocations: false, showSearchedMovieLocations: false });
                        }
                        this.setState({ searchedLocation: [] });
                    }}
                    onBlur={async () => {
                        // todo: should hide after clicking on it? prototype doesn't
                        // setShowMovieCard(false);
                        this.setState({ isSearchbarFocused: false });
                        const altitude = 8000;
                        const zoom = altitude;
                        if (this.state.filterByLocation) {
                            const locations =
                                (await searchLocation({
                                    q: this.state.locationSearchText.replace(/roma$/i, "") + " roma"
                                })) || [];
                            // if (!locations || (locations && locations.length === 0)) return console.log("not found"); // todo handle
                            const filteredGeolocations = locations.filter(
                                o => o.importance > constants.map.IMPORTANCE_FILTER_TRESHOLD
                            );
                            if (filteredGeolocations.length === 0) {
                                this.setState({
                                    searchErr: `Nessun luogo trovato per "${this.state.locationSearchText}"`
                                });
                                return;
                            }
                            this.setState({
                                searchedMovieLocations: filteredGeolocations,
                                showSearchedMovieLocations: true
                            });
                            const [pin] = locations;
                            (this.map as any)?.animateCamera({
                                center: { latitude: pin.lat, longitude: pin.lon },
                                altitude,
                                zoom
                            });
                        } else {
                            const { err, item: m } = await fetchMovieTitle(db, this.state.locationSearchText);
                            this.setState({ searchErr: err || "" });
                        }
                    }}
                    onFocus={() => {
                        if (!this.state.filterByLocation) return this.props.navigation.navigate("CercaFilm");
                        this.setState({ isSearchbarFocused: true });
                        // bottomSheetComponent?.open();
                        // setShowSearchBottomSheet(true);
                    }}
                />
                <SegmentedControl
                    enabled={!this.state.isSearchbarFocused || !this.state.filterByLocation}
                    values={["Film", "Luogo"]}
                    style={{ zIndex: 1, backgroundColor: "#ccc", margin: 20, marginTop: 10 }}
                    selectedIndex={this.state.filterByLocation ? 1 : 0}
                    onChange={e => {
                        const isLocationSelected = e.nativeEvent.selectedSegmentIndex === 1;
                        this.setState({ filterByLocation: isLocationSelected });
                    }}
                />
                <MapView
                    showsScale={true}
                    zoomControlEnabled={true}
                    showsUserLocation={true}
                    showsCompass={true}
                    ref={m => (this.map = m as any)}
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
                    {this.renderMarkers(this.state.searchedLocation, movies => {
                        if (!movies.length) {
                            this.setState({ showUnassociatedPinModal: true });
                            return false;
                        }
                        return true;
                    })}
                    {this.state.showSearchedMovieLocations
                        ? this.renderMarkers(this.state.searchedMovieLocations)
                        : null}
                    {this.state.showAllLocations ? this.renderMarkers(this.state.allLocations) : null}
                </MapView>
            </SafeAreaView>
        );
    };
}

// export function MapTab(props: ComponentProps<"Map">) {
//     const { navigation, route } = props;
//     const [map, setMap] = useState<MapView>();
//     const [searchErr, setSearchErr] = useState("");
//     const [locationSearchText, setLocationSearchText] = useState("");
//     const [allLocations, setAllLocations] = useState<Geolocation[]>([]);
//     const [searchedLocation, setSearchedLocations] = useState<Geolocation[]>([]);
//
//     const [showAllLocations, setShowAllLocations] = useState(true);
//     const [showMovieCard, setShowMovieCard] = useState(false);
//     const [showUnassociatedMoviesModal, setShowUnassociatedMoviesModal] = useState(false);
//     const [showUnassociatedPinModal, setShowUnassociatedPinModal] = useState(false);
//     const [showSearchBottomSheet, setShowSearchBottomSheet] = useState(true); // todo
//     const [showFilterButtons, setShowFilterButtons] = useState(false);
//
//     const [bottomSheetComponent, setBottomSheetComponent] = useState<BottomSheet>();
//     const [selectedLocation, setSelectedLocation] = useState<Geolocation | null>(null);
//
//     const [readOnlySearchBarText, setReadOnlySearchBarText] = useState("");
//     const [readWriteSearchBarText, setReadRwiteSearchBarText] = useState("");
//
//     const [searchbarRef, setSearchbarRef] = useState()
//
//     const [searchedMovieLocations, setSearchedMovieLocations] = useState<Geolocation[]>([]);
//     const [showSearchedMovieLocations, setShowSearchedMovieLocations] = useState(false);
//     const [filterByLocation, setFilterByLocation] = useState<boolean>(true);
//     const [movie, setMovie] = useState<Movie | null>(null);
//
//     let ref;
//
//     function renderMarkers(locations: Geolocation[], cb?: (movies: Movie[]) => boolean) {
//         return locations.map((pin, i) => (
//             <Marker
//                 key={`${i}-${pin.display_name}`}
//                 coordinate={{ latitude: pin.lat, longitude: pin.lon }}
//                 title={pin.display_name}
//                 onPress={() => {
//                     setSelectedLocation(pin);
//                     if (route.params.movie) return navigation.navigate("Scheda film", { movie: movie as Movie });
//                     const moviesInLocation = db.getMoviesByLocation(pin.place_id);
//                     if (cb && !cb(moviesInLocation)) return;
//                     return navigation.navigate("Film nel luogo", {
//                         pin,
//                         movies: moviesInLocation
//                     });
//                 }}
//             />
//         ));
//     }
//
//     useEffect(() => {
//         db.onReady().then(() => {
//             const locations = db.getAllRegisteredLocations();
//             setAllLocations(locations);
//         });
//     }, []);
//
//     return (
//         <SafeAreaView>
//             {/*{showSearchBottomSheet ? (*/}
//             {/*    <BottomSheet*/}
//             {/*        ref={o => setBottomSheetComponent(o as BottomSheet)}*/}
//             {/*        height={800}*/}
//             {/*        openDuration={250}*/}
//             {/*        customStyles={{*/}
//             {/*            container: {*/}
//             {/*                // justifyContent: "center",*/}
//             {/*                // alignItems: "center"*/}
//             {/*            }*/}
//             {/*        }}*/}
//             {/*    >*/}
//             {/*        <SearchBar*/}
//             {/*            style={{ marginLeft: 20, marginRight: 20, marginTop: 50, marginBottom: 10 }}*/}
//             {/*            // safeAreaProps={mapTabStyles.searchBar}*/}
//             {/*            // enablesReturnKeyAutomatically={!search.length}*/}
//             {/*            autoFocus={showSearchBottomSheet}*/}
//             {/*            value={readWriteSearchBarText}*/}
//             {/*            placeholder={`Cerca ${filterByLocation ? "luogo" : "film"}`}*/}
//             {/*            onChangeText={text => {*/}
//             {/*                setReadRwiteSearchBarText(text);*/}
//             {/*                if (!text) {*/}
//             {/*                    setMovie(null);*/}
//             {/*                    setSearchErr("");*/}
//             {/*                    setShowFilterButtons(true);*/}
//             {/*                    setShowAllLocations(true);*/}
//             {/*                } else {*/}
//             {/*                    setShowAllLocations(false);*/}
//             {/*                    setShowFilterButtons(false);*/}
//             {/*                    setShowSearchedMovieLocations(false);*/}
//             {/*                }*/}
//             {/*                setSearchedLocations([]);*/}
//             {/*            }}*/}
//             {/*            onBlur={async () => {*/}
//             {/*                setShowFilterButtons(false);*/}
//             {/*                if (!readWriteSearchBarText) {*/}
//             {/*                    setShowSearchBottomSheet(false);*/}
//             {/*                    return;*/}
//             {/*                }*/}
//             {/*                // todo: should hide after clicking on it? prototype doesn't*/}
//             {/*                // setShowMovieCard(false);*/}
//             {/*                const altitude = 8000;*/}
//             {/*                const zoom = altitude;*/}
//             {/*                setShowSearchBottomSheet(false);*/}
//             {/*                if (filterByLocation) {*/}
//             {/*                    const locations =*/}
//             {/*                        (await searchLocation({*/}
//             {/*                            q: readWriteSearchBarText.replace(/roma$/i, "") + " roma"*/}
//             {/*                        })) || [];*/}
//             {/*                    // if (!locations || (locations && locations.length === 0)) return console.log("not found"); // todo handle*/}
//             {/*                    const filteredGeolocations = locations.filter(*/}
//             {/*                        o => o.importance > constants.map.IMPORTANCE_FILTER_TRESHOLD*/}
//             {/*                    );*/}
//             {/*                    if (filteredGeolocations.length === 0) {*/}
//             {/*                        setSearchErr(`Nessun luogo trovato per "${readWriteSearchBarText}"`);*/}
//             {/*                        setMovie(null);*/}
//             {/*                        return;*/}
//             {/*                    }*/}
//             {/*                    setSearchedLocations(filteredGeolocations);*/}
//             {/*                    const [pin] = locations;*/}
//             {/*                    map?.animateCamera({*/}
//             {/*                        center: { latitude: pin.lat, longitude: pin.lon },*/}
//             {/*                        altitude,*/}
//             {/*                        zoom*/}
//             {/*                    });*/}
//             {/*                } else {*/}
//             {/*                    const { err, item: m } = await fetchMovieTitle(db, readWriteSearchBarText);*/}
//             {/*                    setMovie(m || null);*/}
//             {/*                    setShowMovieCard(true);*/}
//             {/*                    setSearchErr(err || "");*/}
//             {/*                    setReadOnlySearchBarText(m?.Title as string);*/}
//             {/*                }*/}
//             {/*            }}*/}
//             {/*        />*/}
//             {/*        {showMovieCard && movie ? (*/}
//             {/*            <MovieCard*/}
//             {/*                onPress={() => {*/}
//             {/*                    const locations = db.getLocationsFromMovieId(movie.imdbID);*/}
//             {/*                    setSearchedMovieLocations(locations);*/}
//             {/*                    setShowSearchedMovieLocations(true);*/}
//             {/*                    if (!locations.length) return setShowUnassociatedMoviesModal(true);*/}
//             {/*                    setShowMovieCard(false);*/}
//             {/*                    const [pinForAnimation] = locations;*/}
//             {/*                    const altitude = 2000;*/}
//             {/*                    const zoom = altitude;*/}
//             {/*                    map?.animateCamera({*/}
//             {/*                        center: { latitude: pinForAnimation.lat, longitude: pinForAnimation.lon },*/}
//             {/*                        altitude,*/}
//             {/*                        zoom*/}
//             {/*                    });*/}
//             {/*                }}*/}
//             {/*                container={{ zIndex: 1 }}*/}
//             {/*                movie={movie}*/}
//             {/*            />*/}
//             {/*        ) : null}*/}
//             {/*        <CinePinButton*/}
//             {/*            message={"annulla"}*/}
//             {/*            onPress={() => setShowSearchBottomSheet(false)}*/}
//             {/*            style={{ margin: 20 }}*/}
//             {/*        />*/}
//             {/*    </BottomSheet>*/}
//             {/*) : null}*/}
//             <Modal visible={!!searchErr} transparent={true} animationType={"fade"}>
//                 <View style={mapTabStyles.centeredView}>
//                     <View style={mapTabStyles.modalView}>
//                         <Text style={mapTabStyles.modalText}>{searchErr}</Text>
//                         <CinePinButton message={"Chiudi"} onPress={() => setSearchErr("")} />
//                     </View>
//                 </View>
//             </Modal>
//             <Modal visible={showUnassociatedPinModal} transparent={true} animationType={"fade"}>
//                 <View style={mapTabStyles.centeredView}>
//                     <View style={mapTabStyles.modalView}>
//                         <View>
//                             <Text style={mapTabStyles.modalText}>
//                                 Questo luogo non è ancora stato associato ad un film
//                             </Text>
//                             <View style={{ flexDirection: "row" }}>
//                                 <CinePinButton
//                                     message={"Aggiungi scena"}
//                                     style={{ margin: 10 }}
//                                     onPress={() => {
//                                         setShowUnassociatedPinModal(false);
//                                         navigation.push("Aggiungi scena", { pin: selectedLocation });
//                                     }}
//                                 />
//                                 <CinePinButton
//                                     style={{ margin: 10 }}
//                                     message={"Chiudi"}
//                                     onPress={() => setShowUnassociatedPinModal(false)}
//                                 />
//                             </View>
//                         </View>
//                     </View>
//                 </View>
//             </Modal>
//             <Modal visible={showUnassociatedMoviesModal} transparent={true} animationType={"fade"}>
//                 <View style={mapTabStyles.centeredView}>
//                     <View style={mapTabStyles.modalView}>
//                         <View>
//                             <Text style={mapTabStyles.modalText}>
//                                 Questo film non è ancora stato inserito sulla mappa
//                             </Text>
//                             <View style={{ flexDirection: "row" }}>
//                                 <CinePinButton
//                                     message={"Aggiungi scena"}
//                                     style={{ margin: 10 }}
//                                     onPress={() => {
//                                         setShowUnassociatedMoviesModal(false);
//                                         navigation.push("Aggiungi scena", { movie: route.params.movie });
//                                     }}
//                                 />
//                                 <CinePinButton
//                                     style={{ margin: 10 }}
//                                     message={"Chiudi"}
//                                     onPress={() => setShowUnassociatedMoviesModal(false)}
//                                 />
//                             </View>
//                         </View>
//                     </View>
//                 </View>
//             </Modal>
//             <SearchBar
//                 // editable={filterByLocation}
//                 ref={r => setSearchbarRef(r)}
//                 style={{ marginLeft: 20, marginRight: 20, marginTop: 0, marginBottom: 10 }}
//                 safeAreaProps={mapTabStyles.searchBar}
//                 value={locationSearchText}
//                 placeholder={`Cerca ${filterByLocation ? "luogo" : "film"}`}
//                 onChangeText={text => {
//                     setLocationSearchText(text);
//                     // setReadRwiteSearchBarText(text);
//                     if (!text) {
//                         // setMovie(null);
//                         setSearchErr("");
//                         // setShowFilterButtons(true);
//                         setShowAllLocations(true);
//                     } else {
//                         setShowAllLocations(false);
//                         // setShowFilterButtons(false);
//                         setShowSearchedMovieLocations(false);
//                     }
//                     setSearchedLocations([]);
//                 }}
//                 onBlur={async () => {
//                     setShowFilterButtons(false);
//                     if (!readWriteSearchBarText) {
//                         setShowSearchBottomSheet(false);
//                         return;
//                     }
//                     // todo: should hide after clicking on it? prototype doesn't
//                     // setShowMovieCard(false);
//                     const altitude = 8000;
//                     const zoom = altitude;
//                     setShowSearchBottomSheet(false);
//                     if (filterByLocation) {
//                         const locations =
//                             (await searchLocation({
//                                 q: readWriteSearchBarText.replace(/roma$/i, "") + " roma"
//                             })) || [];
//                         // if (!locations || (locations && locations.length === 0)) return console.log("not found"); // todo handle
//                         const filteredGeolocations = locations.filter(
//                             o => o.importance > constants.map.IMPORTANCE_FILTER_TRESHOLD
//                         );
//                         if (filteredGeolocations.length === 0) {
//                             setSearchErr(`Nessun luogo trovato per "${readWriteSearchBarText}"`);
//                             setMovie(null);
//                             return;
//                         }
//                         setSearchedLocations(filteredGeolocations);
//                         const [pin] = locations;
//                         map?.animateCamera({
//                             center: { latitude: pin.lat, longitude: pin.lon },
//                             altitude,
//                             zoom
//                         });
//                     } else {
//                         const { err, item: m } = await fetchMovieTitle(db, readWriteSearchBarText);
//                         setMovie(m || null);
//                         setShowMovieCard(true);
//                         setSearchErr(err || "");
//                         setReadOnlySearchBarText(m?.Title as string);
//                     }
//                 }}
//                 onFocus={() => {
//                     if (!filterByLocation) return navigation.navigate("CercaFilm");
//                     // bottomSheetComponent?.open();
//                     // setShowSearchBottomSheet(true);
//                 }}
//             />
//             <SegmentedControl
//                 values={["Film", "Luogo"]}
//                 style={{ zIndex: 1, backgroundColor: "#ccc", margin: 20, marginTop: 10 }}
//                 selectedIndex={filterByLocation ? 1 : 0}
//                 onChange={e => {
//                     const isLocationSelected = e.nativeEvent.selectedSegmentIndex === 1;
//                     setFilterByLocation(isLocationSelected);
//
//                 }}
//             />
//             {false && !movie && searchedLocation.length === 0 ? (
//                 <SafeAreaView style={{ zIndex: 1, flex: 2, flexDirection: "row", justifyContent: "space-around" }}>
//                     <CinePinButton
//                         icon={"film"}
//                         style={mapTabStyles.filterButton}
//                         message={"film"}
//                         disabled={!filterByLocation}
//                         onPress={() => {
//                             setFilterByLocation(false);
//                             setSearchErr("");
//                         }}
//                     />
//                     <CinePinButton
//                         icon={"map"}
//                         style={mapTabStyles.filterButton}
//                         message={"luogo"}
//                         disabled={filterByLocation}
//                         onPress={() => {
//                             setFilterByLocation(true);
//                             setSearchErr("");
//                             setMovie(null);
//                         }}
//                     />
//                 </SafeAreaView>
//             ) : null}
//             <MapView
//                 showsScale={true}
//                 zoomControlEnabled={true}
//                 showsUserLocation={true}
//                 showsCompass={true}
//                 ref={m => setMap(m as MapView)}
//                 style={mapTabStyles.map}
//                 initialRegion={{
//                     latitude: romeCoordinates.lat,
//                     longitude: romeCoordinates.lon,
//                     latitudeDelta: constants.map.DELTA,
//                     longitudeDelta: constants.map.DELTA
//                 }}
//             >
//                 <UrlTile urlTemplate={"http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"} maximumZ={19} flipY={false} />
//                 {renderMarkers(searchedLocation, movies => {
//                     if (!movies.length) {
//                         setShowUnassociatedPinModal(true);
//                         return false;
//                     }
//                     return true;
//                 })}
//                 {showSearchedMovieLocations ? renderMarkers(searchedMovieLocations) : null}
//                 {showAllLocations ? renderMarkers(allLocations) : null}
//             </MapView>
//         </SafeAreaView>
//     );
// }
