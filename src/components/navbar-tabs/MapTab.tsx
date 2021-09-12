import React, { LegacyRef } from "react";
import { Alert, Keyboard, StyleSheet, TouchableWithoutFeedback } from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";
import constants from "../../lib/utils/constants";
import { SearchBar } from "../../lib/components/SearchBar";
import { SafeAreaView } from "../../lib/components/SafeAreaView";
import { Geolocation, searchLocation } from "../../lib/geolocation";
import { db } from "../../db";
import { ViewProps } from "../routeTypings";
import { Movie } from "../../lib/DataLayer";
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
    searchText: string;
    allLocations: Geolocation[];
    searchedLocations: Geolocation[];
    /**
     * location ottenute a partire dalla ricerca di un luogo
     */
    selectedLocation: Geolocation | null;
    showAllLocations: boolean;
    /**
     * true quando un film (cercato) non e' stato associato a un pin
     */
    showUnassociatedMoviesModal: boolean;
    /**
     * true quando un pin (cercato) non e' stato associato a un film
     */
    showUnassociatedPinModal: boolean;
    showSearchedMovieLocations: boolean;
    /**
     * luoghi associati al film ricercato a partire dalla ricerca per film
     */
    searchedMovieLocations: Geolocation[];
    filterByLocation: boolean;
    searchedMovie?: Movie | null;
    isSearchbarFocused: boolean;
}

export class MapTab extends React.Component<ViewProps<"Map">, State> {
    state = {
        searchErr: "",
        searchText: "",
        allLocations: [],
        searchedLocations: [],
        selectedLocation: null,
        showAllLocations: true,
        showUnassociatedMoviesModal: false,
        showUnassociatedPinModal: false,
        showSearchedMovieLocations: false,
        searchedMovieLocations: [],
        filterByLocation: true,
        isSearchbarFocused: false,
        searchedMovie: null
    };
    componentDidMount = () => {
        db.onReady().then(() => {
            const locations = db.getAllRegisteredLocations();
            this.setState({ allLocations: locations });
        });
    };

    searchBarRef: LegacyRef<any>;
    map: MapView;

    /**
     * binds an array of movies to each one of the locations specified, so that
     * for every pin you click, you already have movies to show
     * @param locations
     * @param cb funtion to call
     */
    renderMarkers = (locations?: Geolocation[], cb?: (movies: Movie[]) => boolean | void) => {
        if (!locations) return;
        return locations.map((pin, i) => (
            <Marker
                key={`${i}-${pin.display_name}`}
                coordinate={{ latitude: pin.lat, longitude: pin.lon }}
                title={pin.display_name}
                onPress={() => {
                    this.setState({ selectedLocation: pin }, () => {
                        if (this.props.route.params?.movie)
                            return this.props.navigation.push("Scheda film", {
                                movie: this.props.route.params.movie
                            });
                        const moviesInLocation = db.getMoviesByLocation(pin.place_id);
                        if (cb) cb(moviesInLocation);
                        if (moviesInLocation.length === 0) return;
                        return this.props.navigation.push("Film nel luogo", {
                            pin,
                            movies: moviesInLocation
                        });
                    });
                }}
            />
        ));
    };

    locationWithoutAssociatedMoviesAlert = () => {
        if (!this.state.selectedLocation) return;
        const location = (this.state.selectedLocation as any) as Geolocation;
        if (!location) return;
        Alert.alert("Attenzione", "Questo luogo non è ancora stato associato ad un film", [
            {
                text: "Aggiungi scena",
                onPress: () => {
                    this.setState({ showUnassociatedPinModal: false }, () => {
                        this.props.navigation.push("Aggiungi scena", {
                            pin: this.state.selectedLocation
                        });
                    });
                }
            },
            {
                text: "Chiudi",
                onPress: () => this.setState({ showUnassociatedPinModal: false, selectedLocation: null })
            }
        ]);
    };

    errModal = () => {
        if (!this.state.searchErr) return;
        Alert.alert("Attenzione", this.state.searchErr, [
            {
                onPress: () => {
                    this.setState({ searchErr: "" });
                }
            }
        ]);
    };

    /**
     * cerca by film
     */
    unassociatedMoviesModal = () => {
        if (!this.state.searchedMovie) return;
        Alert.alert("Attenzione", "Questo film non è ancora stato inserito sulla mappa", [
            {
                text: "Aggiungi scena",
                onPress: () => {
                    this.setState({ showUnassociatedMoviesModal: false }, () => {
                        this.props.navigation.push("Aggiungi scena", {
                            movie: this.state.searchedMovie as any
                        });
                    });
                }
            },
            {
                text: "Chiudi",
                onPress: () => this.setState({ showUnassociatedPinModal: false, selectedLocation: null })
            }
        ]);
    };

    render = () => {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView>
                    {this.errModal()}

                    <SearchBar
                        editable={!this.props.route.params?.movie}
                        ref={r => (this.searchBarRef = r as any)}
                        style={{ marginLeft: 20, marginRight: 20, marginTop: 0, marginBottom: 10 }}
                        safeAreaProps={mapTabStyles.searchBar}
                        value={
                            this.props.route.params?.movie ? this.props.route.params.movie.Title : this.state.searchText
                        }
                        placeholder={`Cerca ${this.state.filterByLocation ? "luogo" : "film"}`}
                        onChangeText={text => {
                            this.setState({
                                searchText: text,
                                showAllLocations: !text,
                                searchedLocations: []
                            });
                            if (text) this.setState({ showSearchedMovieLocations: false });
                        }}
                        clearButtonMode={!this.props.route.params?.movie ? 'never' : 'while-editing'}
                        onBlur={async () => {
                            this.setState({ isSearchbarFocused: false });
                            const altitude = 8000;
                            const zoom = altitude;
                            const q = this.state.searchText.replace(/roma$/i, "") + " roma";
                            const locations = (await searchLocation({ q })) || [];
                            // if (!locations || (locations && locations.length === 0)) return console.log("not found"); // todo handle
                            const filteredGeolocations = locations.filter(
                                o => o.importance > constants.map.IMPORTANCE_FILTER_TRESHOLD
                            );
                            if (filteredGeolocations.length === 0) {
                                return this.setState({
                                    searchErr: `Nessun luogo trovato per "${this.state.searchText}"`
                                });
                            }
                            this.setState({
                                searchedMovieLocations: filteredGeolocations,
                                showSearchedMovieLocations: !!this.state.searchText
                            });
                            const [pin] = locations;
                            (this.map as any)?.animateCamera({
                                center: { latitude: pin.lat, longitude: pin.lon },
                                altitude,
                                zoom
                            });
                        }}
                        onFocus={() => {
                            if (!this.state.filterByLocation)
                                return this.props.navigation.push("CercaFilm", {
                                    onMovieClick: movie => {
                                        const movieLocations = db.getLocationsFromMovieId(movie.imdbID);
                                        if (!movieLocations?.length) {
                                            this.unassociatedMoviesModal();
                                            // this.setState({ searchedMovie: null });
                                            return this.setState({ showUnassociatedMoviesModal: true });
                                        }
                                        // todo: cannot pass non serializable data structures, only json
                                        this.props.navigation.push("Map", {
                                            movie,
                                            movieLocations
                                        });
                                    },
                                    onMovieFound: (err, movie) => {
                                        if (!err) this.setState({ searchedMovie: movie as any });
                                    }
                                });
                            this.setState({ isSearchbarFocused: true });
                        }}
                    />
                    {!this.props.route.params?.movie ? (
                        <SegmentedControl
                            enabled={!this.state.isSearchbarFocused || !this.state.filterByLocation}
                            values={["Film", "Luogo"]}
                            style={{ zIndex: 1, backgroundColor: "#ccc", margin: 20, marginTop: 10 }}
                            selectedIndex={this.state.filterByLocation ? 1 : 0}
                            onChange={e => {
                                const isLocationSelected = e.nativeEvent.selectedSegmentIndex === 1;
                                this.setState({
                                    filterByLocation: isLocationSelected,
                                    searchText: "",
                                    showAllLocations: true,
                                    showSearchedMovieLocations: false
                                });
                            }}
                        />
                    ) : null}
                    <MapView
                        showsScale={true}
                        zoomControlEnabled={true}
                        showsUserLocation={true}
                        showsCompass={true}
                        onMapReady={() => {
                            const movie = this.props.route.params?.movie;
                            // todo: la discriminante dovrebbe essere la lunghezza di this.props.route.params?.movieLocations, non .movie
                            /**
                             * se viene dato movie si e' nella ricerca per film e l'array da centrare e' quello delle movieLocations dalle route props
                             */
                            if (movie) {
                                const pins = this.props.route.params.movieLocations;
                                if (!pins?.length) return;
                                const [pin] = pins;
                                const altitude = 8000;
                                const zoom = altitude;
                                (this.map as any)?.animateCamera({
                                    center: { latitude: pin.lat, longitude: pin.lon },
                                    altitude,
                                    zoom
                                });
                            }
                        }}
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
                        {this.renderMarkers(this.props.route.params?.movieLocations, movies => {
                            if (movies.length > 0) return;
                            this.setState({ showUnassociatedPinModal: true });
                        })}
                        {this.state.showSearchedMovieLocations
                            ? this.renderMarkers(this.state.searchedMovieLocations, movies => {
                                  if (!movies.length) this.locationWithoutAssociatedMoviesAlert();
                              })
                            : null}
                        {this.state.showAllLocations ? this.renderMarkers(this.state.allLocations) : null}
                    </MapView>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        );
    };
}
