import React from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { HomepageTab } from "./src/components/navbar-tabs/HomepageTab";
import { SettingsTab } from "./src/components/navbar-tabs/SettingsTab";
import { MapTab } from "./src/components/navbar-tabs/MapTab";
import constants from "./src/lib/utils/constants";
import Icons from "react-native-vector-icons/FontAwesome";
import { MovieScreen } from "./src/components/MovieScreen";
import { SearchTab } from "./src/components/navbar-tabs/SearchTab";

declare const global: { HermesInternal: null | {} };

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const App = () => {
    return (
        <>
            <NavigationContainer>
                {/* <Stack.Navigator>
                    <Stack.Screen
                        name="MapTab"
                        component={MapTab}
                    />
                    <Stack.Screen
                        name="Movie"
                        component={MovieScreen}
                    />
                </Stack.Navigator>   */}
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
                            return <Icons name={iconName} size={size} color={color} />;
                        }
                    })}
                    initialRouteName={constants.tabs.HOME}
                >
                    <Tab.Screen name={"temp-movie"} component={MovieScreen} />
                    <Tab.Screen name={constants.tabs.HOME} component={HomepageTab} />
                    <Tab.Screen name={constants.tabs.SEARCH} component={SearchTab} />
                    <Tab.Screen name={constants.tabs.MAP} component={MapTab} />
                    <Tab.Screen name={constants.tabs.SETTINGS} component={SettingsTab} />
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
