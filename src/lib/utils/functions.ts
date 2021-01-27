export function getDefault(prop, def) {
    return prop === undefined ? def : prop;
}

export function first(iterable) {
    if (iterable.length > 0) return iterable[0];
}

export function last(iterable) {
    if (iterable.length > 0) return iterable[iterable.length - 1];
}

export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const omitProp = (o = {}, prop) => omitProps(o, [prop]);

/**
 * Removes keys from o
 * @param o {object}
 * @param excludes {array}
 */
export function omitProps(o = {}, excludes) {
    const include = Object.keys(o).filter(p => !excludes.includes(p));
    const next = {};
    for (const prop of include) next[prop] = o[prop];
    return next;
}

// export function qs(variable, hash = true) {
//     const query = last(window.location[hash ? "hash" : "search"].split("?"));
//     const vars = query.split("&");
//     for (var i = 0; i < vars.length; i++) {
//         const [key, value] = vars[i].split("=");
//         if (decodeURIComponent(key) === variable) {
//             const v = decodeURIComponent(getDefault(value, true));
//             return v === "true" ? Boolean(v) : v;
//         }
//     }
// }

export function buildQs(o = {}) {
    return Object.keys(o)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(o[key])}`)
        .join("&");
}

// export function trimArray(array = []) {
//     for (var i = 0; i < array.length; i++) {
//         if (typeof array[i] === "string") {
//             if (!isNil(array[i])) {
//                 array[i] = array[i].trim();
//             }
//         }
//     }
//     return array;
// }

// export function trimObject(o = {}) {
//     for (const key in o) {
//         if (o.hasOwnProperty(key)) {
//             if (typeof o[key] === "string") o[key] = o[key].trim();
//             else if (Array.isArray(o[key])) o[key] = trimArray(o[key]);
//             else if (typeof o[key] === "object" && o[key]) o[key] = trimObject(o[key]);
//         }
//     }
//     return o;
// }

export const isNull = o => o === null;
export const isUndefined = o => o === undefined;
export const isNil = o => isNull(o) || isUndefined(o);

export function getNested(o = {}, s = "", isNested = true) {
    if (isNested) {
        return s.split(".").reduce((p, c) => {
            return !isNil(p) && !isNil(p[c]) ? p[c] : null;
        }, o);
    } else return o[s];
}

export const isFalsy = o => {
    return isNil(o) || o === "";
};

// TODO: add log(enabled, level, message) that only prints console[level](message) only if enabled=true

export const pick = (o, keys) => {
    const obj = {};
    for (const k of keys) {
        if (o.hasOwnProperty(k)) {
            obj[k] = o[k];
        }
    }
    return obj;
};

export function uuid(length = 8) {
    const id = Math.random().toString(16).substr(2, 4);
    if (length <= 1) return id;
    return id + uuid(length - 1);
}

export function cutStringLength(str: string, length = 24) {
    return str.length > length ? str.substr(0, length) : str;
}
