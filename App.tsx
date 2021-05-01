import React from "react";
import {Keyboard, StyleSheet} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { NavigationContainer } from "@react-navigation/native";
import { HomepageTab } from "./src/components/navbar-tabs/HomepageTab";
import { ProfileTab } from "./src/components/navbar-tabs/ProfileTab";
import { MapTab } from "./src/components/navbar-tabs/MapTab";
import constants from "./src/lib/utils/constants";
import Icons from "react-native-vector-icons/FontAwesome";
import { MovieView } from "./src/components/views/MovieView";
import { SearchTab } from "./src/components/navbar-tabs/SearchTab";
import { createStackNavigator } from "@react-navigation/stack";
import { AssociationsList } from "./src/components/views/AssociationsList";
import { RootStackParamList } from "./src/components/routeTypings";
import { CreateNewScene } from "./src/components/views/CreateNewScene";
import {LocationsMap} from "./src/components/views/MoviewLocationsMap";
import { TitleVideoLinkDetailsView } from "./src/components/views/TitleVideoLinkDetailsView";
import { SearchMovieToAssociateView } from "./src/components/views/SearchMovieToAssociateView";

declare const global: { HermesInternal: null | {} };

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

const TabNavigation = () => {
    return (
        <Tab.Navigator
            tabBarOptions={{
                activeTintColor: "tomato",
                inactiveTintColor: "gray",
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
            <Tab.Screen
                name={constants.tabs.HOME}
                component={HomepageTab}
                listeners={{tabPress: e => {
                    Keyboard.dismiss();
                    }}}
            />
            <Tab.Screen
                name={constants.tabs.SEARCH}
                component={SearchTab}
                listeners={{tabPress: e => {
                        Keyboard.dismiss();
                    }}}
            />
            <Tab.Screen
                name={constants.tabs.MAP}
                component={MapTab}
                listeners={{tabPress: e => {
                        Keyboard.dismiss();
                    }}}
            />
            <Tab.Screen
                name={constants.tabs.PROFILE}
                component={ProfileTab}
                listeners={{tabPress: e => {
                        Keyboard.dismiss();
                    }}}
            />
        </Tab.Navigator>
    );
};

const App = () => {
    return (
        <>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name={"CinePin"} component={TabNavigation}  />
                    <Stack.Screen name={"Scheda film"} component={MovieView} />
                    <Stack.Screen name={"Film nel luogo"} component={AssociationsList} />
                    {/*<Stack.Screen name={"Aggiungi scena"} component={CreateNewScene} />*/}
                    <Stack.Screen name={"Luoghi nel film"} component={LocationsMap} />
                    <Stack.Screen name={"Dettagli Scena"} component={TitleVideoLinkDetailsView} />
                    <Stack.Screen name={"Cerca film"} component={SearchMovieToAssociateView} />
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
