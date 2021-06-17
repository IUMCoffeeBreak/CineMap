import { StackNavigationProp } from "@react-navigation/stack";
import { Movie, MovieLocationRelationShipJoin } from "../lib/DataLayer";
import { RouteProp } from "@react-navigation/native";
import { Geolocation } from "../lib/geolocation";

export type RootStackParamList = {
    CineMap: undefined;
    "Scheda film": { movie: Movie };
    "Film nel luogo": { pin: Geolocation; movies: Movie[] };
    Search: undefined;
    Home: undefined;
    Map: { navigatedFromHome?: boolean };
    "Aggiungi scena": {pin?: Geolocation | null, movie?: Movie | null};
    "Luoghi nel film": MovieLocationRelationShipJoin[];
    "Dettagli Scena": { pin?: Geolocation; movie?: Movie };
    "Cerca film": { pin: Geolocation };
};

export type ComponentProps<T extends keyof RootStackParamList> = {
    route: RouteProp<RootStackParamList, T>;
    navigation: StackNavigationProp<RootStackParamList, T>;
};
