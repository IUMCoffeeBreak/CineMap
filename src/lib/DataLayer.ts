import constants from "./utils/constants";
import { Geolocation } from "./geolocation";
import RNFS, { readFile, writeFile } from "react-native-fs";
import { db } from "../db";

interface Response<T> {
    err?: string;
    item?: T;
}

export interface Movie {
    imdbID: string;
    Title: string;
    Plot: string;
    Actors: string;
    Director: string;
    Poster: string;
    imdbRating: string;
    Year: string;
}

export interface MovieLocationRelationship {
    id: string;
    scene_name: string;
    scene_video_link: string;
    movie_id: string;
    location_id: number;
}

export interface MovieLocationRelationShipJoin {
    id: string;
    movie: Movie | null;
    location: Geolocation | null;
    scene_name: string;
    scene_video_link: string;
}

export interface Location {
    lat: number;
    lon: number;
}

const notFoundError: Response<any> = { err: "Film non trovato" };
const encoding = "utf8";
const randID = () => Math.random().toString(32).slice(2);

export async function fetchMovieTitle(title: string): Promise<Response<Movie>> {
    try {
        const url = `http://www.omdbapi.com?apikey=${constants.omdbApiKey}&t=${encodeURIComponent(title)}`;
        const resp = await fetch(url);
        const movie = (await resp.json()) as Movie;
        if (!(movie as any).Error) {
            if (!db.movieModel.readById(movie.imdbID)) db.movieModel.write(movie);
            return { item: movie };
        }
    } catch (e) {
        console.error("error feching movie", e);
    }
    return notFoundError;
}

export type IndexedObject<T = any> = { [key: string]: T };

export interface IModel<T> {
    data: IndexedObject<T>;

    write(item: T): void;

    readById(id: string): T | null;

    list(): IndexedObject<T>;

    setData(data: IndexedObject<T>): void;
}

export interface Table<T> {
    data: T[];

    write(item: T): void;

    readById(id: string): T | null;

    list(): T[];

    setData(data: T[]): void;
}

export class LocationModel implements IModel<Geolocation> {
    data: IndexedObject<Geolocation>;

    constructor(data) {
        this.data = data;
    }

    setData(data) {
        this.data = data;
    }

    list(): IndexedObject<Geolocation> {
        return this.data;
    }

    readById(id): Geolocation | null {
        return this.data[id] || null;
    }

    write(item: Geolocation): void {
        this.data[item.place_id] = item;
    }
}

export class MovieModel implements IModel<Movie> {
    data: IndexedObject<Movie>;

    constructor(data) {
        this.data = data;
    }

    setData(data) {
        this.data = data;
    }

    list(): IndexedObject<Movie> {
        return this.data;
    }

    readById(id: string): Movie | null {
        return this.data[id] || null;
    }

    write(item: Movie): void {
        this.data[item.imdbID] = item;
    }

    searchTitle(text: string) {
        return (
            Object.entries(this.data)
                .map(([, v]) => v)
                .find(v => v.Title.match(new RegExp(text, "gi"))) || null
        );
    }
}

export class MovieLocationRelationshipModel implements Table<MovieLocationRelationship> {
    data: MovieLocationRelationship[];

    constructor(data) {
        this.data = data;
    }

    list(): MovieLocationRelationship[] {
        return this.data;
    }

    readById(id: string): MovieLocationRelationship | null {
        return this.data.find(v => v.id === id) || null;
    }

    readByLocationId(id: number) {
        return this.data.find(v => v.location_id === id) || null;
    }

    readByMovieId(id: string) {
        return this.data.find(v => v.movie_id === id) || null;
    }

    write(item: Omit<MovieLocationRelationship, "id">): void {
        this.data.push({ ...item, id: randID() });
    }

    setData(data: MovieLocationRelationship[]) {
        this.data = data;
    }
}

const fileNames = {
    locations: `${RNFS.DocumentDirectoryPath}/locations.json`,
    movie: `${RNFS.DocumentDirectoryPath}/movies.json`,
    movieLocationAssoc: `${RNFS.DocumentDirectoryPath}/movieLocAssoc.json`
};

export class DataLayer {
    public locationModel = new LocationModel({});
    public movieModel = new MovieModel({});
    public movieLocAssocModel = new MovieLocationRelationshipModel([]);

    constructor(writePollInterval?: number) {
        this.loadDbFromDisk()
            .then(data => {
                this.movieLocAssocModel.setData(data.movieLocationAssoc);
                this.movieModel.setData(data.movie);
                this.locationModel.setData(data.locations);
            })
            .catch(e => {
                console.debug("db init error", e.message);
            });
        setInterval(this.writeToDisk.bind(this), writePollInterval || 30000);
    }

    async searchMovieTitle(text: string): Promise<Response<Movie>> {
        console.log(`searching ${text} ...`);
        const dbSearch = this.movieModel.searchTitle(text);
        if (dbSearch) return { item: dbSearch };
        console.debug("movie not found in internal db...");
        const result = await fetchMovieTitle(text);
        if (!result.item) {
            console.debug("movie not found:", text);
            return { err: "Film non trovato" };
        }
        // save it in db
        this.movieModel.write(result.item);
        console.debug("movie found");
        return { item: result.item };
    }

    getAssociations(): MovieLocationRelationShipJoin[] {
        const seenMap = new Set();
        const list = this.movieLocAssocModel.list().map(record => {
            const id = `${record.movie_id}:${record.location_id}`
            if (seenMap.has(id)) return null;
            seenMap.add(id);
            return {
                id: record.id,
                scene_video_link: record.scene_video_link,
                scene_name: record.scene_name,
                movie: this.movieModel.readById(record.movie_id),
                location: this.locationModel.readById(record.location_id)
            };
        });
        return (list as any[]).filter(item => item !== null && item.movie !== null);
    }

    getMovieLocations(title: string) {
        return this.getAssociations().filter(a => a.movie?.Title === title);
    }

    getLocationMovies(id: number) {
        const associations = this.getAssociations();
        return associations.filter(a => a.location?.place_id === id);
    }

    protected async loadDbFromDisk() {
        return {
            locations: JSON.parse(await readFile(fileNames.locations, encoding)),
            movie: JSON.parse(await readFile(fileNames.movie, encoding)),
            movieLocationAssoc: JSON.parse(await readFile(fileNames.movieLocationAssoc, encoding))
        };
    }

    protected async writeToDisk() {
        console.debug("writing to disk...");
        await writeFile(fileNames.locations, JSON.stringify(this.locationModel.data), encoding);
        await writeFile(fileNames.movie, JSON.stringify(this.movieModel.data), encoding);
        await writeFile(fileNames.movieLocationAssoc, JSON.stringify(this.movieLocAssocModel.data), encoding);
    }

    createMovieLocationAssociation(
        opts: { movie: Movie; location: Geolocation } & Pick<
            MovieLocationRelationship,
            "scene_name" | "scene_video_link"
        >
    ) {
        this.movieLocAssocModel.write({
            movie_id: opts.movie.imdbID,
            location_id: opts.location.place_id,
            scene_video_link: opts.scene_video_link,
            scene_name: opts.scene_name
        });
        this.locationModel.write(opts.location);
    }
}
