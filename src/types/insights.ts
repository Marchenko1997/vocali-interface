export interface TopArtist {
  name: string;
  playcount: string;
  listeners: string;
  image: { "#text": string; size: string }[];
  url: string;
}

export interface TopTrack {
  name: string;
  artist: { name: string };
  playcount: string;
  listeners: string;
  image: { "#text": string; size: string }[];
  spotifyImage?: string;
}

export interface Tag {
  name: string;
  count: number;
}

export interface ArtistAlbum {
  name: string;
  playcount: number;
  url: string;
  image: Array<{ "#text": string; size: string }>;
  artist: { name: string };
}

export interface TagArtist {
  name: string;
  url: string;
  image: Array<{ "#text": string; size: string }>;
  mbid?: string;
  wikiImage?: string;
}