const BASE_URL = "https://ws.audioscrobbler.com/2.0";
const API_KEY = import.meta.env.VITE_LASTFM_API_KEY;

const get = (method: string, params: Record<string, string>) => {
  const url = new URL(BASE_URL);

  url.searchParams.set("method", method);
  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("format", "json");

  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  return fetch(url.toString()).then((r) => r.json());
};

export const lastfm = {
  getTopArtists: (limit = 10) =>
    get("chart.gettopartists", { limit: String(limit) }),

  getTagTopArtists: (tag: string, limit = 12) =>
    get("tag.gettopartists", { tag, limit: String(limit) }),

  getTopTracks: (limit = 10) =>
    get("chart.gettoptracks", { limit: String(limit) }),

  getArtistInfo: (artist: string) => get("artist.getinfo", { artist }),

  getArtistTopTracks: (artist: string, limit = 10) =>
    get("artist.gettoptracks", { artist, limit: String(limit) }),

  getArtistTopTags: (artist: string) => get("artist.gettoptags", { artist }),

  getSimilarTracks: (artist: string, track: string) =>
    get("track.getsimilar", { artist, track, limit: "6" }),

  getArtistTopAlbums: (artist: string, limit = 8) =>
    get("artist.gettopalbums", { artist, limit: String(limit) }),

  searchArtist: (query: string) =>
    get("artist.search", { artist: query, limit: "8" }),


  getSimilarArtists: (artist: string, limit = 10) =>
    get("artist.getsimilar", { artist, limit: String(limit) }),


  getSimilarTracksExtended: (artist: string, track: string, limit = 10) =>
    get("track.getsimilar", { artist, track, limit: String(limit) }),

  getTopArtistsByTag: (tag: string, limit = 12) =>
    get("tag.gettopartists", { tag, limit: String(limit) }),
};
