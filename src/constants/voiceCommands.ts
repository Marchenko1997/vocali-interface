

export const VOICE_COMMANDS = {
  play: ["play", "играй", "включи", "поставь", "грай", "увімкни", "постав"],
  pause: ["pause", "stop", "пауза", "стоп", "зупини", "зупинити"],
  next: [
    "next",
    "следующий",
    "следующая",
    "далее",
    "наступний",
    "наступна",
    "далі",
  ],
  previous: [
    "previous",
    "back",
    "назад",
    "предыдущий",
    "предыдущая",
    "попередній",
    "попередня",
  ],
  favorite: [
    "add to favorites",
    "favorite",
    "добавить в избранное",
    "в избранное",
    "додати до улюблених",
    "до улюблених",
  ],
  record: [
    "start recording",
    "stop recording",
    "начать запись", 
    "остановить запись", 
    "почати запис", 
    "зупинити запис", 
  ],
};

export const PLAY_REGEX = new RegExp(
  `^(?:${VOICE_COMMANDS.play.join("|")})\\s+(.+)`,
);
