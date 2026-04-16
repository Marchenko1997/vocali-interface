export const VOICE_COMMANDS = {
  play: [
    // English
    "play",
    "start",
    "launch",
    "open",
    "put on",
    "turn on",
    // Russian
    "играй",
    "включи",
    "поставь",
    "запусти",
    "воспроизведи",
    "поиграй",
    // Ukrainian
    "грай",
    "увімкни",
    "постав",
    "запусти",
    "відтвори",
    "поставь",
  ],

  pause: [
    // English
    "pause",
    "stop",
    "halt",
    "freeze",
    // Russian
    "пауза",
    "стоп",
    "остановить",
    "остановись",
    "стоп музыка",
    "тишина",
    // Ukrainian
    "пауза",
    "стоп",
    "зупини",
    "зупинити",
    "стоп музика",
  ],

  next: [
    // English
    "next",
    "skip",
    "forward",
    "next track",
    "next song",
    // Russian
    "следующий",
    "следующая",
    "следующий трек",
    "дальше",
    "далее",
    "вперёд",
    "пропусти",
    "другой",
    // Ukrainian
    "наступний",
    "наступна",
    "наступний трек",
    "далі",
    "вперед",
    "пропусти",
  ],

  previous: [
    // English
    "previous",
    "back",
    "rewind",
    "last track",
    "go back",
    "prev",
    // Russian
    "предыдущий",
    "предыдущая",
    "предыдущий трек",
    "назад",
    "вернись",
    "прошлый",
    "прошлая",
    // Ukrainian
    "попередній",
    "попередня",
    "попередній трек",
    "назад",
    "поверни",
  ],

  favorite: [
    // English
    "add to favorites",
    "favorite",
    "like",
    "save",
    "heart this",
    // Russian
    "добавить в избранное",
    "в избранное",
    "нравится",
    "лайк",
    "добавь в избранное",
    "сохранить",
    "запомни",
    // Ukrainian
    "додати до улюблених",
    "до улюблених",
    "подобається",
    "лайк",
    "зберегти",
  ],

  record: [
    // English
    "start recording",
    "stop recording",
    "record",
    "begin recording",
    // Russian
    "начать запись",
    "остановить запись",
    "запись",
    "начни запись",
    "записать",
    "начать записывать",
    // Ukrainian
    "почати запис",
    "зупинити запис",
    "запис",
    "почни запис",
    "записати",
  ],

  playlist: [
    // English
    "create playlist",
    "make playlist",
    "generate playlist",
    "new playlist",
    "build playlist",
    // Russian
    "создай плейлист",
    "сделай плейлист",
    "сгенерируй плейлист",
    "новый плейлист",
    // Ukrainian
    "зроби плейлист",
    "створи плейлист",
    "згенеруй плейлист",
    "новий плейлист",
  ],
};

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,!?«»""''—():;…-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}



const playWords = [...VOICE_COMMANDS.play]
  .sort((a, b) => b.length - a.length)
  .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) 
  .join("|");


export const PLAY_REGEX = new RegExp(
  `^(?:${playWords})[,.:;!?\\s]+(.+)$`,
  "i",
);


export const PLAYLIST_REGEX = new RegExp(
  [
 
    "(?:create|make|generate|build|new)\\s+(?:\\w+\\s+)*playlist",
   
    "(?:создай|сделай|сгенерируй|новый)\\s+(?:\\w+\\s+)*плейлист",
   
    "(?:зроби|створи|згенеруй|новий)\\s+(?:\\w+\\s+)*плейлист",
  ].join("|"),
  "i",
);