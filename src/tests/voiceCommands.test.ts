import { describe, test, expect } from "vitest";
import {
  PLAY_REGEX,
  PLAY_TRIGGER_ONLY_REGEX,
  PAUSE_REGEX,
  NEXT_REGEX,
  PREVIOUS_REGEX,
  FAVORITE_REGEX,
  UNFAVORITE_REGEX,
  RECORD_REGEX,
  PLAYLIST_REGEX,
  MOOD_REGEX,
  MOOD_ID_MAP,
  normalizeText,
  cleanTranscript,
} from "../constants/voiceCommands";

const norm = (s: string) => normalizeText(s);

describe("normalizeText", () => {
  test("lowercases", () => {
    expect(norm("PLAY Drake")).toBe("play drake");
    expect(norm("Play Drake")).toBe("play drake");
  });

  test("strips punctuation", () => {
    expect(norm("play, drake.")).toBe("play drake");
    expect(norm("play! drake?")).toBe("play drake");
    expect(norm("play—drake")).toBe("playdrake");
  });

  test("collapses whitespace", () => {
    expect(norm("play   drake")).toBe("play drake");
    expect(norm("  play drake  ")).toBe("play drake");
  });
});

describe("PLAY_REGEX", () => {
  test("matches 'play <query>'", () => {
    expect(norm("play drake").match(PLAY_REGEX)?.[1]).toBe("drake");
  });

  test("matches 'turn on <query>'", () => {
    expect(norm("turn on madonna").match(PLAY_REGEX)?.[1]).toBe("madonna");
  });

  test("matches 'put on <query>'", () => {
    expect(norm("put on radiohead").match(PLAY_REGEX)?.[1]).toBe("radiohead");
  });

  test("matches 'launch <query>'", () => {
    expect(norm("launch beatles").match(PLAY_REGEX)?.[1]).toBe("beatles");
  });

  test("matches 'i want to hear <query>'", () => {
    expect(norm("i want to hear queen").match(PLAY_REGEX)?.[1]).toBe("queen");
  });

  test("matches 'play me <query>' (longest trigger first)", () => {
    expect(norm("play me beatles").match(PLAY_REGEX)?.[1]).toBe("beatles");
  });

  test("case insensitive", () => {
    expect(norm("PLAY DRAKE").match(PLAY_REGEX)?.[1]).toBe("drake");
    expect(norm("Play Drake").match(PLAY_REGEX)?.[1]).toBe("drake");
  });

  test("matches Russian 'играй'", () => {
    expect(norm("играй мадонна").match(PLAY_REGEX)?.[1]).toBe("мадонна");
  });

  test("matches Ukrainian 'грай'", () => {
    expect(norm("грай мадонна").match(PLAY_REGEX)?.[1]).toBe("мадонна");
  });

  test("does NOT match bare query without trigger", () => {
    expect(norm("madonna").match(PLAY_REGEX)).toBeNull();
  });

  test("does NOT match standalone trigger (no query)", () => {
    expect(norm("play").match(PLAY_REGEX)).toBeNull();
  });
});

describe("PLAY_TRIGGER_ONLY_REGEX", () => {
  test("matches standalone 'play'", () => {
    expect(PLAY_TRIGGER_ONLY_REGEX.test("play")).toBe(true);
  });

  test("matches standalone 'launch'", () => {
    expect(PLAY_TRIGGER_ONLY_REGEX.test("launch")).toBe(true);
  });

  test("does NOT match 'play drake'", () => {
    expect(PLAY_TRIGGER_ONLY_REGEX.test("play drake")).toBe(false);
  });
});

describe("PAUSE_REGEX", () => {
  test("matches 'pause'", () => {
    expect(PAUSE_REGEX.test("pause")).toBe(true);
  });

  test("matches 'stop'", () => {
    expect(PAUSE_REGEX.test("stop")).toBe(true);
  });

  test("matches 'mute'", () => {
    expect(PAUSE_REGEX.test("mute")).toBe(true);
  });

  test("matches Russian 'пауза'", () => {
    expect(PAUSE_REGEX.test("пауза")).toBe(true);
  });

  test("matches Ukrainian 'зупини'", () => {
    expect(PAUSE_REGEX.test("зупини")).toBe(true);
  });

  test("does NOT match substring of longer phrase", () => {
    expect(PAUSE_REGEX.test("please pause")).toBe(false);
    expect(PAUSE_REGEX.test("pause now")).toBe(false);
  });

  test("case insensitive", () => {
    expect(PAUSE_REGEX.test("PAUSE")).toBe(true);
    expect(PAUSE_REGEX.test("Pause")).toBe(true);
  });
});

describe("NEXT_REGEX", () => {
  test("matches 'next'", () => {
    expect(NEXT_REGEX.test("next")).toBe(true);
  });

  test("matches 'skip'", () => {
    expect(NEXT_REGEX.test("skip")).toBe(true);
  });

  test("matches 'next track'", () => {
    expect(NEXT_REGEX.test("next track")).toBe(true);
  });

  test("matches 'next one'", () => {
    expect(NEXT_REGEX.test("next one")).toBe(true);
  });

  test("matches Ukrainian 'наступний'", () => {
    expect(NEXT_REGEX.test("наступний")).toBe(true);
  });

  test("matches Ukrainian 'давай далі'", () => {
    expect(NEXT_REGEX.test("давай далі")).toBe(true);
  });

  test("does NOT fire on 'thank you for watching' (Bug #3)", () => {
    expect(NEXT_REGEX.test("thank you for watching")).toBe(false);
  });

  test("does NOT match substring of longer sentence", () => {
    expect(NEXT_REGEX.test("the next chapter")).toBe(false);
    expect(NEXT_REGEX.test("forward direction")).toBe(false);
  });
});

describe("PREVIOUS_REGEX", () => {
  test("matches 'previous'", () => {
    expect(PREVIOUS_REGEX.test("previous")).toBe(true);
  });

  test("matches 'go back'", () => {
    expect(PREVIOUS_REGEX.test("go back")).toBe(true);
  });

  test("matches 'last one'", () => {
    expect(PREVIOUS_REGEX.test("last one")).toBe(true);
  });

  test("matches Russian 'назад'", () => {
    expect(PREVIOUS_REGEX.test("назад")).toBe(true);
  });
});

describe("FAVORITE_REGEX", () => {
  test("matches 'favorite'", () => {
    expect(FAVORITE_REGEX.test("favorite")).toBe(true);
  });

  test("matches 'like'", () => {
    expect(FAVORITE_REGEX.test("like")).toBe(true);
  });

  test("matches 'save to favorite'", () => {
    expect(FAVORITE_REGEX.test("save to favorite")).toBe(true);
  });

  test("matches 'bookmark'", () => {
    expect(FAVORITE_REGEX.test("bookmark")).toBe(true);
  });

  test("matches Ukrainian 'до улюблених'", () => {
    expect(FAVORITE_REGEX.test("до улюблених")).toBe(true);
  });
});

describe("UNFAVORITE_REGEX", () => {
  test("matches 'remove from favorites'", () => {
    expect(UNFAVORITE_REGEX.test("remove from favorites")).toBe(true);
  });

  test("matches British 'remove from favourites'", () => {
    expect(UNFAVORITE_REGEX.test("remove from favourites")).toBe(true);
  });

  test("matches 'unlike'", () => {
    expect(UNFAVORITE_REGEX.test("unlike")).toBe(true);
  });

  test("matches 'delete favorites'", () => {
    expect(UNFAVORITE_REGEX.test("delete favorites")).toBe(true);
  });

  test("matches Ukrainian short 'видали'", () => {
    expect(UNFAVORITE_REGEX.test("видали")).toBe(true);
  });

  test("does NOT match favorite-only command", () => {
    expect(UNFAVORITE_REGEX.test("favorite")).toBe(false);
    expect(UNFAVORITE_REGEX.test("like")).toBe(false);
  });
});

describe("RECORD_REGEX", () => {
  test("matches 'record'", () => {
    expect(RECORD_REGEX.test("record")).toBe(true);
  });

  test("matches 'start recording'", () => {
    expect(RECORD_REGEX.test("start recording")).toBe(true);
  });

  test("matches 'stop recording'", () => {
    expect(RECORD_REGEX.test("stop recording")).toBe(true);
  });
});

describe("PLAYLIST_REGEX", () => {
  test("matches 'create playlist'", () => {
    expect(PLAYLIST_REGEX.test("create playlist")).toBe(true);
  });

  test("matches 'create chill playlist'", () => {
    expect(PLAYLIST_REGEX.test("create chill playlist")).toBe(true);
  });

  test("matches 'generate jazz playlist'", () => {
    expect(PLAYLIST_REGEX.test("generate jazz playlist")).toBe(true);
  });

  test("matches Russian 'создай плейлист'", () => {
    expect(PLAYLIST_REGEX.test("создай плейлист")).toBe(true);
  });
});

describe("MOOD_REGEX + MOOD_ID_MAP", () => {
  test("matches 'chill mode'", () => {
    expect(MOOD_REGEX.test("chill mode")).toBe(true);
    expect(MOOD_ID_MAP["chill mode"]).toBe("chill");
  });

  test("matches 'party mood'", () => {
    expect(MOOD_REGEX.test("party mood")).toBe(true);
    expect(MOOD_ID_MAP["party mood"]).toBe("party");
  });

  test("matches 'focus'", () => {
    expect(MOOD_REGEX.test("focus")).toBe(true);
    expect(MOOD_ID_MAP["focus"]).toBe("focus");
  });

  test("matches 'dark'", () => {
    expect(MOOD_REGEX.test("dark")).toBe(true);
    expect(MOOD_ID_MAP["dark"]).toBe("dark");
  });

  test("matches Russian 'режим чилл'", () => {
    expect(MOOD_REGEX.test("режим чилл")).toBe(true);
    expect(MOOD_ID_MAP["режим чилл"]).toBe("chill");
  });

  test("matches Ukrainian 'темний режим'", () => {
    expect(MOOD_REGEX.test("темний режим")).toBe(true);
    expect(MOOD_ID_MAP["темний режим"]).toBe("dark");
  });

  test("does NOT match unknown mood like 'sad' (not in codebase)", () => {
    expect(MOOD_REGEX.test("sad")).toBe(false);
  });
});

describe("cleanTranscript — noise filter", () => {
  test("filters 'Hello!' (with trailing punctuation)", () => {
    expect(cleanTranscript("Hello!")).toBe("");
  });

  test("filters bare 'Hello'", () => {
    expect(cleanTranscript("Hello")).toBe("");
  });

  test("filters 'Hello everyone!'", () => {
    expect(cleanTranscript("Hello everyone!")).toBe("");
  });

  test("filters 'Thanks.'", () => {
    expect(cleanTranscript("Thanks.")).toBe("");
  });

  test("filters 'Bye!'", () => {
    expect(cleanTranscript("Bye!")).toBe("");
  });

  test("filters 'Okay'", () => {
    expect(cleanTranscript("Okay")).toBe("");
  });

  test("filters 'thank you for watching'", () => {
    expect(cleanTranscript("Thank you for watching")).toBe("");
  });

  test("filters 'obrigado'", () => {
    expect(cleanTranscript("Obrigado.")).toBe("");
  });

  test("filters Portuguese feminine 'obrigada'", () => {
    expect(cleanTranscript("Obrigada")).toBe("");
  });

  test("filters '[Music]' bracket annotation", () => {
    expect(cleanTranscript("[Music]")).toBe("");
  });

  test("filters '(silence)' paren annotation", () => {
    expect(cleanTranscript("(silence)")).toBe("");
  });

  test("filters dot-only", () => {
    expect(cleanTranscript("...")).toBe("");
  });

  test("filters known hallucination 'enlightenment'", () => {
    expect(cleanTranscript("enlightenment")).toBe("");
  });

  test("filters known hallucination 'agglomeration'", () => {
    expect(cleanTranscript("agglomeration")).toBe("");
  });

  test("filters Russian 'спасибо'", () => {
    expect(cleanTranscript("спасибо")).toBe("");
  });

  test("filters Ukrainian 'дякую'", () => {
    expect(cleanTranscript("дякую")).toBe("");
  });

  test("does NOT filter legitimate 'play drake'", () => {
    expect(cleanTranscript("play drake")).toBe("play drake");
  });

  test("does NOT filter legitimate 'next track'", () => {
    expect(cleanTranscript("next track")).toBe("next track");
  });

  test("does NOT filter 'hello darkness my old friend' (multi-word, not noise)", () => {
    expect(cleanTranscript("hello darkness my old friend")).toBe("");
  });
});

describe("no-match cases", () => {
  test("random gibberish does not match any command", () => {
    const t = normalizeText("xyzqwerty");
    expect(t.match(PLAY_REGEX)).toBeNull();
    expect(NEXT_REGEX.test(t)).toBe(false);
    expect(PAUSE_REGEX.test(t)).toBe(false);
    expect(PREVIOUS_REGEX.test(t)).toBe(false);
    expect(FAVORITE_REGEX.test(t)).toBe(false);
    expect(RECORD_REGEX.test(t)).toBe(false);
    expect(MOOD_REGEX.test(t)).toBe(false);
  });

  test("single random letter does not match", () => {
    const t = normalizeText("a");
    expect(NEXT_REGEX.test(t)).toBe(false);
    expect(PAUSE_REGEX.test(t)).toBe(false);
  });

  test("'random short words' do not match commands", () => {
    expect(NEXT_REGEX.test(normalizeText("foo"))).toBe(false);
    expect(PAUSE_REGEX.test(normalizeText("bar"))).toBe(false);
    expect(FAVORITE_REGEX.test(normalizeText("baz"))).toBe(false);
  });
});

describe("normalization + case + punctuation robustness", () => {
  test("'PLAY Drake' / 'Play Drake' / 'play drake' all yield same query", () => {
    const a = normalizeText("PLAY Drake").match(PLAY_REGEX)?.[1];
    const b = normalizeText("Play Drake").match(PLAY_REGEX)?.[1];
    const c = normalizeText("play drake").match(PLAY_REGEX)?.[1];
    expect(a).toBe("drake");
    expect(b).toBe("drake");
    expect(c).toBe("drake");
  });

  test("extra spaces collapse without breaking matching", () => {
    expect(normalizeText("play   drake").match(PLAY_REGEX)?.[1]).toBe("drake");
  });

  test("punctuation stripped does not break matching", () => {
    expect(normalizeText("play, drake!").match(PLAY_REGEX)?.[1]).toBe("drake");
  });
});
