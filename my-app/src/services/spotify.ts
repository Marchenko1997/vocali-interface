import api from "./api";

export const searchSpotify = async (query: string) => {
  const res = await api.get("/spotify/search", {
    params: { q: query },
  });

  return res.data;
};
