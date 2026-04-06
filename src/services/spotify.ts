import api from "./api";

export const searchSpotify = async (query: string, offset = 0) => {
  const res = await api.get("/spotify/search", {
    params: { q: query, offset, limit: 10 },
  });

  return res.data;
};
