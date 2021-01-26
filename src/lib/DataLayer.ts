import { uuid } from "./utils/functions";

type ID = string;

export interface Record<T> {
    [id: string]: T;
}

export interface Movie {
    title: string;
    description?: string;
    locationIds?: ID[];
}

export interface Location {
    lat: number;
    lon: number;
}

export interface Schema {
    movies: Record<Movie>;
    locations: Record<Location>;
}

const defaultSchema: Schema = {
    movies: {},
    locations: {}
};

export class DataLayer {
    data: Schema;

    constructor(initialData: Schema = defaultSchema) {
        this.data = initialData;
    }

    addRecord<T>(record: T, where: any): ID {
        const id = uuid();
        where[id] = record;
        return id;
    }

    addMovie(movie: Movie): ID {
        return this.addRecord<Movie>(movie, this.data.movies);
    }

    addLocation(loc: Location): ID {
        return this.addRecord<Location>(loc, this.data.locations);
    }

    findMovieById(id: ID): Movie | null {
        return this.data.movies[id] || null;
    }

    findLocationById(id: ID): Location | null {
        return this.data.locations[id] || null;
    }

    findMoviesByTitleText(searchText: string): { id: string; movie: Movie }[] {
        const re = new RegExp(`${searchText.toLowerCase()}`, "g");
        return Object.entries(this.data.movies)
            .filter(([, movie]) => movie.title.toLocaleLowerCase().match(re))
            .map(([id, movie]) => ({
                id,
                movie
            }));
    }

    findMoviesByLocation(loc: ID): Movie[] {
        return Object.entries(this.data.movies)
            .filter(([, movie]) => movie?.locationIds?.includes(loc))
            .map(([, v]) => v);
    }

    addMovies(movies: Movie[]) {
        return movies.map(movie => this.addMovie(movie));
    }

    addLocations(locations: Location[]) {
        return locations.map(loc => this.addLocation(loc));
    }
}
