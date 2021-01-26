/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { NavigationContainer } from "@react-navigation/native";
import { Homepage } from "./src/components/navbar-tabs/Homepage";
import { Settings } from "./src/components/navbar-tabs/Settings";
import constants from "./src/lib/utils/constants";
import { Map } from "./src/components/navbar-tabs/Map";
import Icons from "react-native-vector-icons/FontAwesome";
import { Search } from "./src/components/navbar-tabs/Search";

declare const global: { HermesInternal: null | {} };

const Tab = createBottomTabNavigator();

const App = () => {
    return (
        <>
            <NavigationContainer>
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
                                case constants.tabs.SETTINGS:
                                    iconName = "cog";
                                    break;
                                case constants.tabs.SEARCH:
                                    iconName = "search";
                                    break;
                            }

                            // You can return any component that you like here!
                            return <Icons name={iconName} size={size} color={color} />;
                        }
                    })}
                    initialRouteName={constants.tabs.HOME}
                >
                    <Tab.Screen name={constants.tabs.HOME} component={Homepage} />
                    <Tab.Screen name={constants.tabs.SEARCH} component={Search} />
                    <Tab.Screen name={constants.tabs.MAP} component={Map} />
                    <Tab.Screen name={constants.tabs.SETTINGS} component={Settings} />
                </Tab.Navigator>
            </NavigationContainer>
        </>
    );
};

const styles = StyleSheet.create({
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
