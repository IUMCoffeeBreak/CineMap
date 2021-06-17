import constants from "./utils/constants";
import { Geolocation } from "./geolocation";
import RNFS, { readFile, writeFile } from "react-native-fs";
import EventEmitter from "events";

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
    thumbnail?: string;
    movie_id: string;
    location_id: number;
}

export interface MovieLocationRelationShipJoin {
    id: string;
    movie: Movie | null;
    location: Geolocation | null;
    scene_name: string;
    scene_video_link: string;
    thumbnail?: string;
}

export interface Location {
    lat: number;
    lon: number;
}

const notFoundError: Response<any> = { err: "Film non trovato" };
const encoding = "utf8";
const randID = () => Math.random().toString(32).slice(2);

export async function fetchMovieTitle(db: DataLayer, title: string): Promise<Response<Movie>> {
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

export class DataLayer extends EventEmitter {
    public locationModel = new LocationModel({});
    public movieModel = new MovieModel({});
    public movieLocAssocModel = new MovieLocationRelationshipModel([]);
    protected ready = false;

    constructor(writePollInterval?: number) {
        super();
        this.loadDbFromDisk()
            .then(data => {
                this.movieLocAssocModel.setData(data.movieLocationAssoc);
                this.movieModel.setData(data.movie);
                this.locationModel.setData(data.locations);
                this.ready = false;
                this.emit("ready");
            })
            .catch(e => {
                console.debug("db init error", e.message);
            });
        setInterval(this.writeToDisk.bind(this), writePollInterval || 60000);
    }

    async onReady() {
        if (this.ready) return;
        return new Promise<void>(res => this.once("ready", res));
    }

    async searchMovieTitle(text: string): Promise<Response<Movie>> {
        console.log(`searching ${text} ...`);
        const dbSearch = this.movieModel.searchTitle(text);
        if (dbSearch) return { item: dbSearch };
        console.debug("movie not found in internal db...");
        const result = await fetchMovieTitle(this, text);
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
        const list = this.movieLocAssocModel.list().map(record => {
            return {
                id: record.id,
                scene_video_link: record.scene_video_link,
                scene_name: record.scene_name,
                thumbnail: record.thumbnail,
                movie: this.movieModel.readById(record.movie_id),
                location: this.locationModel.readById(record.location_id)
            };
        });
        return list.filter(item => item.movie !== null);
    }

    getScenesFromMovie(movie_id: string) {
        return this.getAssociations().filter(a => a.movie?.imdbID === movie_id);
    }

    getLocationsFromMovieTitle(title: string) {
        return this.getAssociations().filter(a => a.movie?.Title === title);
    }

    getLocationsFromMovieId(id: string) {
        return this.getAssociations().filter(ass => {
            ass.movie?.imdbID === id
        }).map(ass => ass.location).filter(Boolean) as Geolocation[]
    }

    getAllRegisteredLocations() {
        const dupMap = new Map()
        return this.getAssociations().map(ass => {
            if (dupMap.has(ass.location?.place_id)) return null
            dupMap.set(ass.location?.place_id, true)
            return ass.location
        }).filter(Boolean) as Geolocation[]
    }

    getMoviesByLocation(place_id: number) {
        const associations = this.getAssociations();
        const map = new Map();
        return associations
            .filter(a => a.location?.place_id === place_id)
            .map(v => {
                if (map.has(v.movie?.imdbID)) return null;
                map.set(v.movie?.imdbID, true);
                return v.movie;
            })
            .filter(Boolean) as Movie[];
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
            "scene_name" | "scene_video_link" | "thumbnail"
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
