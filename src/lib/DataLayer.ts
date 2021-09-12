import constants from "./utils/constants";
import { Geolocation, searchLocation } from "./geolocation";
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
            .then(
                data => {
                    this.movieLocAssocModel.setData(data.movieLocationAssoc);
                    this.movieModel.setData(data.movie);
                    this.locationModel.setData(data.locations);
                    this.ready = true;
                    this.emit("ready");
                },
                async e => {
                    console.error("db init error", e.toString());
                    await this.initDemoData();
                }
            )
            .catch(e => {
                console.error("init demo data error:", e.toString());
            });
        setInterval(this.writeToDisk.bind(this), writePollInterval || 60000);
    }

    async initDemoData() {
        //la dolce vita
        const { item: laDolceVita } = await this.searchMovieTitle("la dolce vita");
        const { item: angelsAndDemons } = await this.searchMovieTitle("Angels & Demons");
        const { item: theTalentedMrRipley } = await this.searchMovieTitle("The talented Mr. Ripley");
        const { item: romanHoliday } = await this.searchMovieTitle("Roman Holiday");
        const { item: totoTruffa } = await this.searchMovieTitle("totòtruffa 62");
        const { item: habemusPapam } = await this.searchMovieTitle("habemus papam");
        const { item: smettoQuandoVoglio } = await this.searchMovieTitle("smetto quando voglio");
        const { item: smettoQuandoVoglioAdHonorem } = await this.searchMovieTitle("smetto quando voglio: ad Honorem");
        const { item: smettoQuandoVoglioMasterclass } = await this.searchMovieTitle(
            "smetto quando voglio: Masterclass"
        );
        const { item: laGrandeBellezza } = await this.searchMovieTitle("the Great Beauty");
        const { item: nonEssereCattivo } = await this.searchMovieTitle("Non essere cattivo");

        const [piazzaDelPopolo] = await searchLocation({ q: "piazza del popolo roma" });
        const [fontanaDiTrevi] = await searchLocation({ q: "fontana di trevi roma" });
        const [pantheon] = await searchLocation({ q: "pantheon roma" });
        const [vaticano] = await searchLocation({ q: "basilica san pietro roma" });
        const [boccaDellaVerita] = await searchLocation({ q: "bocca della verita" });
        const [galleriaColonna] = await searchLocation({ q: "galleria colonna" });
        const [piazzaDellaMinerva] = await searchLocation({ q: "piazzale della Minerva" });
        const [facolataChimica] = await searchLocation({ q: "sapienza universita" });
        const [villaAdriana] = await searchLocation({ q: "villa adriana tivoli" });
        const [ostiaLido] = await searchLocation({ q: "ostia lido" });
        const [piazzaNavona] = await searchLocation({ q: "piazza Navona" });
        const [piazzaDiSpagna] = await searchLocation({ q: "piazza di spagna" });

        this.createMovieLocationAssociation({
            movie: laDolceVita as Movie,
            location: fontanaDiTrevi,
            scene_name: "Marcello come here",
            scene_video_link: "https://youtu.be/hiBcONS1HVI"
        });
        this.createMovieLocationAssociation({
            movie: laDolceVita as Movie,
            location: piazzaDelPopolo,
            scene_name: "Marcello e Maddalena",
            scene_video_link: "https://youtu.be/g145TIVjMjM"
        });
        this.createMovieLocationAssociation({
            movie: angelsAndDemons as Movie,
            location: pantheon,
            scene_name: "La rivelazione del professor Langdon",
            scene_video_link: "https://youtu.be/99dOPdlLIw0"
        });
        this.createMovieLocationAssociation({
            movie: angelsAndDemons as Movie,
            location: vaticano,
            scene_name: "Esplosione a Piazza San Pietro",
            scene_video_link: "https://youtu.be/0VJDUOkbLa4"
        });
        this.createMovieLocationAssociation({
            movie: theTalentedMrRipley as Movie,
            location: piazzaDiSpagna,
            scene_name: "Tom e Marge",
            scene_video_link: "https://youtu.be/8XFaJzA7S7o"
        });
        this.createMovieLocationAssociation({
            movie: romanHoliday as Movie,
            location: piazzaDiSpagna,
            scene_name: "La principessa",
            scene_video_link: "https://youtu.be/mUZ8lgaBoSU"
        });
        this.createMovieLocationAssociation({
            movie: romanHoliday as Movie,
            location: pantheon,
            scene_name: "Champagne a colazione",
            scene_video_link: "https://youtu.be/MpyXOFJHZHY"
        });
        this.createMovieLocationAssociation({
            movie: romanHoliday as Movie,
            location: boccaDellaVerita,
            scene_name: "Joe spaventa la principessa",
            scene_video_link: "https://youtu.be/None37_vatw"
        });
        this.createMovieLocationAssociation({
            movie: romanHoliday as Movie,
            location: galleriaColonna,
            scene_name: "La scelta della principessa",
            scene_video_link: "https://youtu.be/ZDlrDueT-mg"
        });
        this.createMovieLocationAssociation({
            movie: totoTruffa as Movie,
            location: fontanaDiTrevi,
            scene_name: "Il cavalier Trevi vende la fontana di Trevi",
            scene_video_link: "https://youtu.be/0BybcKpxdS8"
        });
        this.createMovieLocationAssociation({
            movie: habemusPapam as Movie,
            location: vaticano,
            scene_name: "Conecetto di anima e inconscio",
            scene_video_link: "https://youtu.be/0VJDUOkbLa4"
        });
        this.createMovieLocationAssociation({
            movie: smettoQuandoVoglio as Movie,
            location: piazzaDellaMinerva,
            scene_name: "Ricercatori",
            scene_video_link: "https://youtu.be/qgWBm_je-ug"
        });
        this.createMovieLocationAssociation({
            movie: smettoQuandoVoglioAdHonorem as Movie,
            location: piazzaDellaMinerva,
            scene_name: "Bomba alla Sapienza",
            scene_video_link: "https://youtu.be/VMhjcZs7AgA"
        });
        this.createMovieLocationAssociation({
            movie: smettoQuandoVoglioAdHonorem as Movie,
            location: facolataChimica,
            scene_name: "Confronto tra Pietro e Walter",
            scene_video_link: "https://youtu.be/jNuycD08rCY"
        });
        this.createMovieLocationAssociation({
            movie: smettoQuandoVoglioMasterclass as Movie,
            location: villaAdriana,
            scene_name: "Ma che sono strade di Roma queste?",
            scene_video_link: "https://www.youtube.com/watch?v=KigfN2WYfHE"
        });
        this.createMovieLocationAssociation({
            movie: laGrandeBellezza as Movie,
            location: piazzaNavona,
            scene_name: "Il monologo di Jep",
            scene_video_link: "https://youtu.be/IiJgy6Xst7I"
        });
        this.createMovieLocationAssociation({
            movie: nonEssereCattivo as Movie,
            location: ostiaLido,
            scene_name: "Io sto incazzato fracico e te te stai a magna il gelato",
            scene_video_link: "https://youtu.be/ItgwJy4U9hM"
        });
    }

    async onReady() {
        if (this.ready) return;
        return new Promise<void>(res => this.once("ready", res));
    }

    async searchMovieTitle(text: string): Promise<Response<Movie>> {
        console.log(`searching movie ${text} ...`);
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
        return this.getAssociations()
            .filter(ass => {
                return ass.movie?.imdbID === id;
            })
            .map(ass => ass.location)
            .filter(Boolean) as Geolocation[];
    }

    getAllRegisteredLocations() {
        const dupMap = new Map();
        return this.getAssociations()
            .map(ass => {
                if (dupMap.has(ass.location?.place_id)) return null;
                dupMap.set(ass.location?.place_id, true);
                return ass.location;
            })
            .filter(Boolean) as Geolocation[];
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
