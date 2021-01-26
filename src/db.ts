import { DataLayer, Schema } from "./lib/DataLayer";

const exampleDb: Schema = {
    movies: {
        movid: {
            title: "La dolce vita",
            description: "Descrizione del film 1",
            locationIds: ["locid"]
        },
        movid2: {
            title: "Totòtruffa",
            description: "Descrizione del film 1",
            locationIds: ["locid"]
        }
    },
    locations: {
        locid: {
            lat: Math.random(),
            lon: Math.random()
        }
    }
};

export const db = new DataLayer(exampleDb);
