import { buildQs } from "./utils/functions";

export interface SearchProps {
    q?: string;
    street?: string;
    city?: string;
    county?: string;
    state?: string;
    country?: string;
    format?: "xml" | "json" | "jsonv2" | "geojson" | "geocodejson";
    postalcode?: string;
}

export interface Geolocation {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    boundingbox: number[];
    lat: number;
    lon: number;
    display_name: string;
    class: string;
    type: string;
    importance: number;
    icon: string;
}

export async function searchLocation(props: SearchProps): Promise<Geolocation[] | null> {
    props.format = props.format || "json";
    const url = `https://nominatim.openstreetmap.org/search?${buildQs(props)}`;
    try {
        const response = await fetch(url, {
            headers: {
                "accept-language": "it"
            }
        });
        const json: Geolocation[] = await response.json();
        return json.map(geo => {
            geo.boundingbox = geo.boundingbox.map(Number);
            geo.lat = Number(geo.lat);
            geo.lon = Number(geo.lon);
            return geo;
        });
    } catch (e) {
        console.error("search location error:", e);
        return null;
    }
}
