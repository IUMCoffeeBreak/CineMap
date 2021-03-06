import { StackNavigationProp } from "@react-navigation/stack";
import { Movie, MovieLocationRelationShipJoin } from "../lib/DataLayer";
import { RouteProp } from "@react-navigation/native";

export type RootStackParamList = {
    CinePin: undefined;
    Movie: Movie;
    AddPin: { associations: MovieLocationRelationShipJoin[] };
    Search: undefined;
    Home: undefined;
    Map: undefined;
};

export type ComponentProps<T extends keyof RootStackParamList> = {
    route: RouteProp<RootStackParamList, T>;
    navigation: StackNavigationProp<RootStackParamList, T>;
};
