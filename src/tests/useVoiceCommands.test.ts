import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useVoiceCommands } from "../hooks/useVoiceCommands";

/**
 * Drives parseCommand by mocking MediaRecorder + getUserMedia + fetch.
 * After startListening, the recording cycle calls fetch with mocked transcripts;
 * those flow through cleanTranscript → parseCommand → callbacks.
 */

interface MockRecorderInstance {
  state: string;
  ondataavailable: ((e: { data: Blob }) => void) | null;
  onstop: (() => void) | null;
  start: () => void;
  stop: () => void;
}

let recorderInstances: MockRecorderInstance[] = [];

class MockMediaRecorder {
  state = "inactive";
  ondataavailable: ((e: { data: Blob }) => void) | null = null;
  onstop: (() => void) | null = null;
  static isTypeSupported() {
    return true;
  }
  constructor() {
    recorderInstances.push(this as unknown as MockRecorderInstance);
  }
  start() {
    this.state = "recording";
  }
  stop() {
    this.state = "inactive";
  }
}

beforeEach(() => {
  recorderInstances = [];
  vi.useFakeTimers();
  // @ts-expect-error – test mock
  globalThis.MediaRecorder = MockMediaRecorder;

  Object.defineProperty(globalThis.navigator, "mediaDevices", {
    value: {
      getUserMedia: vi.fn().mockResolvedValue({
        getTracks: () => [{ stop: vi.fn() }],
      }),
    },
    configurable: true,
  });
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

/**
 * Helper: feeds a transcript through the recording cycle.
 * Returns once the parseCommand callback chain has completed.
 */
async function feedTranscript(transcript: string) {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ text: transcript }),
  }) as unknown as typeof fetch;

  // Wait for at least one recorder to be registered
  await vi.advanceTimersByTimeAsync(0);

  // Push a chunk through the most recently constructed recorder (last in array).
  const recorder = recorderInstances[recorderInstances.length - 1];
  if (!recorder) throw new Error("No recorder instance available");
  // Blob size > 15000 to pass minimum chunk threshold
  const blob = new Blob([new Uint8Array(20000)]);
  recorder.ondataavailable?.({ data: blob });

  // Flush microtasks for fetch + parseCommand
  await vi.advanceTimersByTimeAsync(0);
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}

function makeHandlers() {
  return {
    onPlay: vi.fn(),
    onPause: vi.fn(),
    onNext: vi.fn(),
    onPrevious: vi.fn(),
    onFavorite: vi.fn(),
    onUnfavorite: vi.fn(),
    onRecord: vi.fn(),
    onGeneratePlaylist: vi.fn(),
    onMoodChange: vi.fn(),
    onTranscript: vi.fn(),
  };
}

describe("useVoiceCommands integration", () => {
  test("'chill mode' transcript → onMoodChange('chill') called", async () => {
    const handlers = makeHandlers();
    const { result } = renderHook(() => useVoiceCommands(handlers));

    await act(async () => {
      await result.current.startListening();
    });
    await act(async () => {
      await feedTranscript("chill mode");
    });

    expect(handlers.onMoodChange).toHaveBeenCalledWith("chill");
    expect(handlers.onTranscript).toHaveBeenCalledWith("chill mode");
  });

  test("'Hello!' transcript → noise filtered, no callbacks fire", async () => {
    const handlers = makeHandlers();
    const { result } = renderHook(() => useVoiceCommands(handlers));

    await act(async () => {
      await result.current.startListening();
    });
    await act(async () => {
      await feedTranscript("Hello!");
    });

    expect(handlers.onTranscript).not.toHaveBeenCalled();
    expect(handlers.onPlay).not.toHaveBeenCalled();
    expect(handlers.onPause).not.toHaveBeenCalled();
    expect(handlers.onNext).not.toHaveBeenCalled();
    expect(handlers.onMoodChange).not.toHaveBeenCalled();
  });

  test("'play Radiohead' transcript → onPlay('radiohead') called", async () => {
    const handlers = makeHandlers();
    const { result } = renderHook(() => useVoiceCommands(handlers));

    await act(async () => {
      await result.current.startListening();
    });
    await act(async () => {
      await feedTranscript("play Radiohead");
    });

    expect(handlers.onPlay).toHaveBeenCalledWith("radiohead");
    expect(handlers.onTranscript).toHaveBeenCalledWith("play Radiohead");
  });

  test("'next' transcript → onNext() called", async () => {
    const handlers = makeHandlers();
    const { result } = renderHook(() => useVoiceCommands(handlers));

    await act(async () => {
      await result.current.startListening();
    });
    await act(async () => {
      await feedTranscript("next");
    });

    expect(handlers.onNext).toHaveBeenCalledTimes(1);
  });

  test("'pause' transcript → onPause() called", async () => {
    const handlers = makeHandlers();
    const { result } = renderHook(() => useVoiceCommands(handlers));

    await act(async () => {
      await result.current.startListening();
    });
    await act(async () => {
      await feedTranscript("pause");
    });

    expect(handlers.onPause).toHaveBeenCalledTimes(1);
  });

  test("'remove from favorites' transcript → onUnfavorite() called", async () => {
    const handlers = makeHandlers();
    const { result } = renderHook(() => useVoiceCommands(handlers));

    await act(async () => {
      await result.current.startListening();
    });
    await act(async () => {
      await feedTranscript("remove from favorites");
    });

    expect(handlers.onUnfavorite).toHaveBeenCalledTimes(1);
  });
});
