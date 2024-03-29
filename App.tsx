import React from "react";
import { Keyboard, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { NavigationContainer } from "@react-navigation/native";
import { HomepageTab } from "./src/components/navbar-tabs/HomepageTab";
import { ProfileTab } from "./src/components/navbar-tabs/ProfileTab";
import { MapTab } from "./src/components/navbar-tabs/MapTab";
import constants from "./src/lib/utils/constants";
import Icons from "react-native-vector-icons/FontAwesome";
import { MovieView } from "./src/components/views/MovieView";
import { createStackNavigator } from "@react-navigation/stack";
import { AssociationsList } from "./src/components/views/AssociationsList";
import { RootStackParamList } from "./src/components/routeTypings";
import { LocationsMap } from "./src/components/views/MoviewLocationsMap";
import { SceneDetails } from "./src/components/views/SceneDetails";
import { SearchMovieToAssociateView } from "./src/components/views/SearchMovieToAssociateView";
import SearchTab from "./src/components/navbar-tabs/SearchTab";

declare const global: { HermesInternal: null | {} };

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

const TabNavigation = () => {
    const listener = {
        tabPress: e => {
            Keyboard.dismiss();
        }
    };
    return (
        <Tab.Navigator
            tabBarOptions={{
                activeTintColor: "tomato",
                inactiveTintColor: "gray"
            }}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    switch (route.name) {
                        case constants.tabs.HOME:
                            iconName = "home";
                            break;
                        case constants.tabs.MAP:
                            iconName = "map";
                            break;
                        case constants.tabs.PROFILE:
                            iconName = "user";
                            break;
                        case constants.tabs.SEARCH:
                            iconName = "search";
                            break;
                    }
                    return <Icons name={iconName} size={size} color={color} />;
                }
            })}
            initialRouteName={constants.tabs.HOME}
        >
            <Tab.Screen name={constants.tabs.HOME} component={HomepageTab} listeners={listener} />
            {/*<Tab.Screen name={constants.tabs.SEARCH} component={SearchTab} listeners={listener} />*/}
            {/*<Tab.Screen name={constants.tabs.MAP} component={MapTab} listeners={listener} />*/}
            <Tab.Screen name={constants.tabs.PROFILE} component={ProfileTab} listeners={listener} />
        </Tab.Navigator>
    );
};

const stackOpts = (title?: string) =>
    ({
        title,
        headerTintColor: constants.colors.MAIN_BUTTON,
        headerTitleAlign: "center",
        headerTitleStyle: {
            fontWeight: "bold"
            // todo: ios doesnt support monospace
            // fontFamily: "monospace"
        }
    } as any);

const App = () => {
    return (
        <>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name={"CineMap"} component={TabNavigation} options={stackOpts("CineMap")} />
                    <Stack.Screen name={"Scheda film"} component={MovieView} options={stackOpts("Film")} />
                    <Stack.Screen
                        name={"Film nel luogo"}
                        component={AssociationsList}
                        options={stackOpts("Film nel luogo")}
                    />
                    <Stack.Screen
                        name={"Luoghi nel film"}
                        component={LocationsMap}
                        options={stackOpts("Luoghi nel film")}
                    />
                    <Stack.Screen
                        name={"Dettagli Scena"}
                        component={SceneDetails}
                        options={stackOpts("Dettagli Scena")}
                    />
                    <Stack.Screen
                        name={"Cerca film"}
                        component={SearchMovieToAssociateView}
                        options={stackOpts("Cerca film")}
                    />
                    <Stack.Screen name={"Search"} component={SearchTab} options={stackOpts("Cerca film")}/>
                    <Stack.Screen name={"Map"} component={MapTab} options={stackOpts("Mappa")} />
                </Stack.Navigator>
            </NavigationContainer>
        </>
    );
};

const appStyles = StyleSheet.create({
    scrollView: {
        backgroundColor: Colors.lighter
    },
    engine: {
        position: "absolute",
        right: 0
    },
    body: {
        backgroundColor: Colors.white
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: "600",
        color: Colors.black
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: "400",
        color: Colors.dark
    },
    highlight: {
        fontWeight: "700"
    },
    footer: {
        color: Colors.dark,
        fontSize: 12,
        fontWeight: "600",
        padding: 4,
        paddingRight: 12,
        textAlign: "right"
    }
});

export default App;
