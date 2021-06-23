const borderRadius = 10;
const margins = {
    top: 10,
    left: 10,
    right: 10,
    bottom: 10
};
export const constants = {
    appName: "CinePin",
    omdbApiKey: "4766d9c4",
    tabs: {
        HOME: "Home",
        PROFILE: "Profile",
        MAP: "Map",
        SEARCH: "Search",
        FILMLIST: "Film nel luogo"
    },
    colors: {
        GLOBAL_BACKGROUND_COLOR: "#eeeeee",
        TRANSPARENT: "rgba(0, 0, 0, 0)",
        MAIN_GREEN: "#577b6d"
    },
    text: {
        TITLE_FONT: 18,
        BODY_FONT: 12
    },
    cards: {
        RADIUS: 10,
        BACKGROUND_COLOR: "white",
        MARGIN_BOTTOM: 10,
        MARGIN_TOP: 10
    },
    spacing: {
        MARGIN_BOTTOM: 10,
        MARGIN_TOP: 10,
        MARGIN_LEFT: 10,
        MARGIN_RIGHT: 10
    },
    borders: {
        RADIUS: borderRadius
    },
    views: {
        MOVIE: "Scheda Film",
        ADDPIN: "Aggiungi pin"
    },
    map: {
        DELTA: 0.003,
        IMPORTANCE_FILTER_TRESHOLD: 0.3
    },
    componentsStyles: {
        card: {
            backgroundColor: "white",
            borderRadius: borderRadius,
            marginLeft: margins.left,
            marginRight: margins.right,
            marginTop: margins.top,
            marginBottom: margins.bottom,
            padding: 10,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 1
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            elevation: 3
        },
        searchBar: {
            shadowColor: "#bbbbbb",
            shadowOffset: {
                width: 5,
                height: 5
            },
            shadowOpacity: 5,
            shadowRadius: 10
        }
    }
};

export default constants;
