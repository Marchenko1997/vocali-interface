export const VOICE_COMMANDS = {
  play: [
    // English
    "play",
    "start",
    "launch",
    "longe",
    "lunge",
    "lunch",
    "lange",
    "open",
    "put on",
    "turn on",
    "search for",
    "find",
    "i want to hear",
    "play me",
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
    "mute",
    "quiet",
    "silence",
    "be quiet",
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
    "next one",
    "another one",
    "change song",
    "change track",
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
    "last one",
    "that one again",
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
    "save to favorite",
    "save to favorites",
    "add to favorite",
    "favorite",
    "like",
    "save",
    "heart",
    "heart this",
    "bookmark",
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

  unfavorite: [
    // English
    "remove from favorites",
    "remove from favorite",
    "remove favorite",
    "delete from favorites",
    "delete favorite",
    "remove from favourites",
    "remove favourite",
    "delete from favourites",
    "delete favourite",
    "unfavorite",
    "unlike",
    "unheart",
    "remove bookmark",
    "unsave",
    // Russian
    "удалить из избранного",
    "убрать из избранного",
    "удали из избранного",
    "убери из избранного",
    "не нравится",
    "разлюбить",
    // Ukrainian
    "видалити з улюблених",
    "прибрати з улюблених",
    "видали з улюблених",
    "не подобається",
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

function buildAlternation(words: string[]): string {
  return [...words]
    .sort((a, b) => b.length - a.length)
    .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
}


export const PLAY_REGEX = new RegExp(
  `^(?:${playWords})[,.:;!?\\s]+(.+)$`,
  "i",
);

export const PLAY_TRIGGER_ONLY_REGEX = new RegExp(
  `^(?:${playWords})$`,
  "i",
);

export const NEXT_REGEX = new RegExp(
  `^(?:${buildAlternation(VOICE_COMMANDS.next)})$`,
  "i",
);

export const PAUSE_REGEX = new RegExp(
  `^(?:${buildAlternation(VOICE_COMMANDS.pause)})$`,
  "i",
);

export const PREVIOUS_REGEX = new RegExp(
  `^(?:${buildAlternation(VOICE_COMMANDS.previous)})$`,
  "i",
);

export const FAVORITE_REGEX = new RegExp(
  `^(?:${buildAlternation(VOICE_COMMANDS.favorite)})$`,
  "i",
);

export const UNFAVORITE_REGEX = new RegExp(
  `^(?:${buildAlternation(VOICE_COMMANDS.unfavorite)})$`,
  "i",
);

export const RECORD_REGEX = new RegExp(
  `^(?:${buildAlternation(VOICE_COMMANDS.record)})$`,
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

const NOISE_PATTERNS: RegExp[] = [
  /^thanks?(\s+you)?\s+for\s+(watching|listening)\b.*/i,
  /^teksting\s+av\s+\S+.*/i,
  /^subtitles?\s+by\s+\S+.*/i,
  /^takk\s+for\s+at\s+du\s+så\s+med\b.*/i,
  /^obrigado\b.*/i,
  /^gracias\b.*/i,
  /^merci\b.*/i,
  /^(hello|hi|hey|bye|okay|ok|yeah|yes|no|hmm+|uh+|oh|wow|nice|good|sorry|please|thanks|thank\s+you|welcome|excuse\s+me|olá|ola|hola|bonjour|ciao|привет|пока|ладно|да|нет|ну)$/i,
];

export function cleanTranscript(text: string): string {
  for (const pattern of NOISE_PATTERNS) {
    if (pattern.test(text)) return "";
  }
  return text;
}