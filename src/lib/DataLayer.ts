import constants from "./utils/constants";

interface Response<T> {
    err?: string;
    item?: T;
}

export interface Movie {
    Title: string;
    Plot: string;
}

export interface Record<T> {
    [id: string]: T;
}

export interface Location {
    lat: number;
    lon: number;
}

export interface Schema {
    locations: Record<Location>;
}

const defaultSchema: Schema = {
    locations: {}
};

const notFoundError: Response<any> = { err: "Film non trovato" };

const cache = {};

export async function fetchMovieTitle(title: string): Promise<Response<Movie>> {
    try {
        const url = `http://www.omdbapi.com?apikey=${constants.omdbApiKey}&t=${encodeURIComponent(title)}`;
        const resp = await fetch(url);
        const json = await resp.json();
        if (!json.Error) return { item: json };
        return notFoundError;
    } catch (e) {
        return notFoundError;
    }
}

export class DataLayer {
    data: Schema;

    constructor(initialData: Schema = defaultSchema) {
        this.data = initialData;
    }

    async searchMovieTitle(text: string): Promise<Response<Movie>> {
        console.log(`searching ${text} ...`);
        if (text in cache) return { item: cache[text] };
        const result = await fetchMovieTitle(text);
        console.debug(result.item || "movie not found");
        if (result.item) cache[text] = result.item;
        return result;
    }
}
