import api from "./api";

export const searchSpotify = async (query: string, offset = 0) => {
  const res = await api.get("/spotify/search", {
    params: { q: query, offset, limit: 10 },
  });

  return res.data;
};

export const getArtistImage = async (id: string) => {
  const res = await api.get("/spotify/artist-image", {
    params: { id },
  });

  return res.data;
};

export const searchSpotifyArtist = async (query: string) => {
  const res = await api.get("/spotify/search", {
    params: {
      q: query,
      limit: 1,
    },
  });

  return res.data;
};

export const searchSpotifyTrack = async (query: string) => {
  const res = await api.get("/spotify/search", {
    params: {
      q: query,
      limit: 1,
    },
  });

  return res.data;
};