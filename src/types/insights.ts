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
}

export interface Tag {
  name: string;
  count: number;
}
