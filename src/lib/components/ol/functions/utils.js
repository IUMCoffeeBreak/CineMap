export const setStateCoordinatesCb = (this_, layersWrapperName, layerName, coordinates) => state => {
    const nextState = {
        [layersWrapperName]: {
            ...state[layersWrapperName],
            [layerName]: {
                ...state[layersWrapperName][layerName],
                coordinates
            }
        }
    };
    return nextState;
};

export const coordinatesListMap = item => ({
    radius: item.radius,
    coords: [parseFloat(item.latitude), parseFloat(item.longitude)]
});

export const coordinatesListMapShort = item => ({
    radius: item.radius,
    coords: [parseFloat(item.lat), parseFloat(item.lon)]
});
