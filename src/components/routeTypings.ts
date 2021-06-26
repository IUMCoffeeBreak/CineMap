import { StackNavigationProp } from "@react-navigation/stack";
import { Movie, MovieLocationRelationShipJoin } from "../lib/DataLayer";
import { RouteProp } from "@react-navigation/native";
import { Geolocation } from "../lib/geolocation";
import { MovieSearch } from "../lib/components/MovieSearch";

type MovieSearchType = Parameters<typeof MovieSearch>[0];

export type RootStackParamList = {
    CineMap: undefined;
    "Scheda film": { movie: Movie };
    "Film nel luogo": { pin: Geolocation; movies: Movie[] };
    Search: undefined;
    Home: undefined;
    CercaFilm?: { onMovieClick?: MovieSearchType["onMovieClick"]; onMovieFound?: MovieSearchType["onMovieFound"] };
    Map: { movie?: Movie; movieLocations?: Geolocation[] };
    "Aggiungi scena": { pin?: Geolocation | null; movie?: Movie | null };
    "Luoghi nel film": MovieLocationRelationShipJoin[];
    "Dettagli Scena": { pin?: Geolocation; movie?: Movie };
    "Cerca film": { pin: Geolocation };
};

export type ViewProps<T extends keyof RootStackParamList> = {
    route: RouteProp<RootStackParamList, T>;
    navigation: StackNavigationProp<RootStackParamList, T>;
};
