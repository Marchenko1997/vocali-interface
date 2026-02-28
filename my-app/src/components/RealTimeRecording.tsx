import { useState, useRef, useEffect } from "react";
import {
  Mic,
  Square,
  Loader2,
  AlertCircle,
  Play,
  Pause,
  Save,
  RotateCcw,
} from "lucide-react";
import type {
  RealTimeRecordingProps,
  RecordingInterfaceProps,
} from "../types/real_time_recording";
import { createSpeechmaticsJWT } from "@speechmatics/auth";

const RealTimeRecording: React.FC<RealTimeRecordingProps> = ({
  onTranscriptionComplete,
  onError,
  isSaving = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [finalTranscription, setFinalTranscription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [connectionStatus, setConnectionStatus] =
    useState<string>("disconnected");
  const [showPlayback, setShowPlayback] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [accumulatedTranscript, setAccumulatedTranscript] = useState("");

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);
  const recognitionStartedRef = useRef(false);
  const audioChunkCountRef = useRef(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);



  const startRecording = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      setTranscription("");
      setFinalTranscription("");
      setShowPlayback(false);
      setAudioBlob(null);
      setAudioUrl(null);
      setConnectionStatus("connecting");

      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
        },
      });

      streamRef.current = stream;

      // Set up MediaRecorder for audio capture
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
        setShowPlayback(true);
      };

      // Start MediaRecorder
      mediaRecorderRef.current.start();

      // Set up audio context and processing
     audioContextRef.current = new AudioContext();
     console.log("Real sample rate:", audioContextRef.current.sampleRate);
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current =
        audioContextRef.current.createMediaStreamSource(stream);

      // Connect microphone to analyser for level meter
      microphoneRef.current.connect(analyserRef.current);

      // Set up analyser for level meter
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateAudioLevel = () => {
        if (analyserRef.current && isRecording) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / bufferLength;
          setAudioLevel(average / 255);
          animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
        }
      };

      // Create AudioWorklet for processing audio data
      const workletCode = `
        class AudioProcessor extends AudioWorkletProcessor {
          process(inputs, outputs, parameters) {
            const input = inputs[0];
            if (input.length > 0) {
              const inputChannel = input[0];
              // Send audio data to main thread
              this.port.postMessage({
                audioData: inputChannel
              });
            }
            return true;
          }
        }
        registerProcessor('audio-processor', AudioProcessor);
      `;

      const workletBlob = new Blob([workletCode], {
        type: "application/javascript",
      });
      const workletUrl = URL.createObjectURL(workletBlob);

      await audioContextRef.current.audioWorklet.addModule(workletUrl);

      workletNodeRef.current = new AudioWorkletNode(
        audioContextRef.current,
        "audio-processor",
      );

    workletNodeRef.current.port.onmessage = (event) => {
      if (
        websocketRef.current &&
        recognitionStartedRef.current &&
        websocketRef.current.readyState === WebSocket.OPEN
      ) {
        try {
          const float32 = event.data.audioData; 

          const int16 = new Int16Array(float32.length);

          for (let i = 0; i < float32.length; i++) {
            let s = Math.max(-1, Math.min(1, float32[i]));
            int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
          }

          websocketRef.current.send(int16.buffer);
          audioChunkCountRef.current++;
        } catch (error) {
          console.warn("Failed to send audio data:", error);
        }
      }
    };

      // Connect the audio processing chain
      microphoneRef.current.connect(workletNodeRef.current);
     

      setIsRecording(true);
      setIsConnecting(false);
      setConnectionStatus("connected");
      updateAudioLevel();
    } catch (error: any) {
      setError(error.message || "Failed to start recording");
      onError(error.message || "Failed to start recording");
      setIsConnecting(false);
      setConnectionStatus("error");
    }
  };

  const stopRecording = () => {
    // Stop MediaRecorder
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }

    // Wait a moment for any final transcript segments before sending EndOfStream
    setTimeout(() => {
      // Send EndOfStream message
      if (
        websocketRef.current &&
        websocketRef.current.readyState === WebSocket.OPEN
      ) {
        websocketRef.current.send(
          JSON.stringify({
            message: "EndOfStream",
            last_seq_no: audioChunkCountRef.current,
          }),
        );

        // Wait a moment for the message to be sent before closing
        setTimeout(() => {
          if (websocketRef.current) {
            websocketRef.current.close(1000, "Normal closure");
            websocketRef.current = null;
          }
        }, 100);
      } else if (websocketRef.current) {
        websocketRef.current.close(1000, "Normal closure");
        websocketRef.current = null;
      }
    }, 3000); // Wait 3 seconds for final transcript segments

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (workletNodeRef.current) {
      workletNodeRef.current.disconnect();
      workletNodeRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    setIsRecording(false);
    setConnectionStatus("disconnected");
    setAudioLevel(0);
  };

  const handlePlayPause = () => {
    if (audioElementRef.current) {
      if (isPlaying) {
        audioElementRef.current.pause();
        setIsPlaying(false);
      } else {
        audioElementRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleSave = async () => {
    if (audioBlob && finalTranscription) {
      await onTranscriptionComplete(finalTranscription, audioBlob);
    }
  };

  const handleRerecord = () => {
    setTranscription("");
    setFinalTranscription("");
    setShowPlayback(false);
    setAudioBlob(null);
    setAudioUrl(null);
    setAccumulatedTranscript("");
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          Real-Time Recording
        </h3>
        <p className="text-gray-600 text-sm sm:text-base">
          Record audio with live transcription
        </p>
      </div>

      <RecordingInterface
        isRecording={isRecording}
        isConnecting={isConnecting}
        transcription={transcription}
        finalTranscription={finalTranscription}
        error={error}
        audioLevel={audioLevel}
        connectionStatus={connectionStatus}
        showPlayback={showPlayback}
        isPlaying={isPlaying}
        audioUrl={audioUrl}
        onStartRecording={startRecording}
        onStopRecording={stopRecording}
        onTranscriptionComplete={onTranscriptionComplete}
        onError={onError}
        onPlayPause={handlePlayPause}
        onSave={handleSave}
        onRerecord={handleRerecord}
        setFinalTranscription={setFinalTranscription}
        setIsPlaying={setIsPlaying}
     
        websocketRef={websocketRef}
        recognitionStartedRef={recognitionStartedRef}
        audioChunkCountRef={audioChunkCountRef}
        setTranscription={setTranscription}
        setConnectionStatus={setConnectionStatus}
        audioElementRef={audioElementRef}
        accumulatedTranscript={accumulatedTranscript}
        setAccumulatedTranscript={setAccumulatedTranscript}
        isSaving={isSaving}
      />
    </div>
  );
};

const RecordingInterface: React.FC<RecordingInterfaceProps> = ({
  isRecording,
  transcription,
  finalTranscription,
  error,
  audioLevel,
  connectionStatus,
  showPlayback,
  isPlaying,
  audioUrl,
  onStartRecording,
  onStopRecording,
  onError,
  onPlayPause,
  onSave,
  onRerecord,
  setFinalTranscription,
  setIsPlaying,

  websocketRef,
  recognitionStartedRef,
  setTranscription,
  setConnectionStatus,
  audioElementRef,
  setAccumulatedTranscript,
  isSaving = false,
}) => {
  const [isConnectingToSpeechmatics, setIsConnectingToSpeechmatics] =
    useState(false);

  const handleStartRecording = async () => {


    setIsConnectingToSpeechmatics(true);
    setConnectionStatus("connecting");

    try {
 const jwt = await getSpeechmaticsJWT();

 const wsUrl = `wss://eu2.rt.speechmatics.com/v2?jwt=${jwt}`;
 const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("WebSocket connected to Speechmatics");
        setConnectionStatus("connected");
        setIsConnectingToSpeechmatics(false);

        // Send configuration message
        ws.send(
          JSON.stringify({
            message: "StartRecognition",
            audio_format: {
              type: "raw",
              encoding: "pcm_s16le",
              sample_rate: 48000,
            },
            transcription_config: {
              language: "en",
              enable_partials: true,
              max_delay: 2,
              enable_entities: true,
              diarization: "speaker",
              operating_point: "enhanced",
            },
          }),
        );

     
      };

ws.onmessage = (event) => {
  if (typeof event.data !== "string") return;

  const data = JSON.parse(event.data);
  console.log("Speechmatics message:", data);

 
  if (data.message === "RecognitionStarted") {
    recognitionStartedRef.current = true;
    onStartRecording();
    return;
  }

 
  if (data.message === "AddPartialTranscript") {
    const text = data.metadata?.transcript || "";
    setTranscription(text);
    return;
  }


  if (data.message === "AddTranscript") {
    const text = data.metadata?.transcript || "";

    setAccumulatedTranscript((prev) => (prev ? prev + " " + text : text));

    setFinalTranscription((prev) => (prev ? prev + " " + text : text));

    return;
  }

  if (data.message === "EndOfTranscript") {
    console.log("Transcript finished");
    return;
  }

  if (data.message === "Error") {
    console.error("Speechmatics error:", data);
    return;
  }
};

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setConnectionStatus("error");
        setIsConnectingToSpeechmatics(false);
        onError("Failed to connect to Speechmatics");
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
        setConnectionStatus("disconnected");
        recognitionStartedRef.current = false;
      };

      websocketRef.current = ws;
    } catch (error: any) {
      console.error("Failed to start recording:", error);
      setConnectionStatus("error");
      setIsConnectingToSpeechmatics(false);
      onError(error.message || "Failed to start recording");
    }
  };

  const handleStopRecording = () => {
    onStopRecording();
  };

 const getSpeechmaticsJWT = async () => {
   const apiKey = import.meta.env.VITE_SPEECHMATICS_API_KEY;

   const jwt = await createSpeechmaticsJWT({
     type: "rt",
     apiKey,
     ttl: 60,
   });

   return jwt;
 };

  const cleanTranscriptText = (text: string) => {
    return text.replace(/\s+/g, " ").trim();
  };

  const handleSave = async () => {
    await onSave();
  };

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Connection Status */}
      <div className="flex items-center justify-center">
        <div
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium ${
            connectionStatus === "connected"
              ? "bg-green-50 text-green-700 border border-green-200"
              : connectionStatus === "connecting"
                ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                : connectionStatus === "error"
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-gray-50 text-gray-700 border border-gray-200"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              connectionStatus === "connected"
                ? "bg-green-500 animate-pulse"
                : connectionStatus === "connecting"
                  ? "bg-yellow-500 animate-pulse"
                  : connectionStatus === "error"
                    ? "bg-red-500"
                    : "bg-gray-500"
            }`}
          ></div>
          <span>
            {connectionStatus === "connected" && "Connected"}
            {connectionStatus === "connecting" && "Connecting..."}
            {connectionStatus === "error" && "Connection Error"}
            {connectionStatus === "disconnected" && "Disconnected"}
          </span>
        </div>
      </div>

      {/* Audio Level Meter */}
      {isRecording && (
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-2">
            <Mic className="h-5 w-5 text-red-500 animate-pulse" />
            <span className="text-sm font-medium text-gray-700">
              Recording...
            </span>
          </div>
          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-red-500 transition-all duration-100"
              style={{ width: `${audioLevel * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Recording Controls */}
      <div className="flex items-center justify-center space-x-4">
        {!isRecording ? (
          <button
            onClick={handleStartRecording}
            disabled={isConnectingToSpeechmatics}
            className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] min-w-[120px] justify-center"
          >
            {isConnectingToSpeechmatics ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm">Connecting...</span>
              </>
            ) : (
              <>
                <Mic className="h-5 w-5" />
                <span>Start Recording</span>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleStopRecording}
            className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 min-h-[48px] min-w-[120px] justify-center"
          >
            <Square className="h-5 w-5" />
            <span>Stop Recording</span>
          </button>
        )}
      </div>

      {/* Live Transcription */}
      {transcription && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-800">
              Live Transcription
            </span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            "{transcription}"
          </p>
        </div>
      )}

      {/* Final Transcription */}
      {finalTranscription && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-800">
                Final Transcription
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            "{finalTranscription}"
          </p>

          {/* Playback Controls */}
          {showPlayback && audioUrl && (
            <div className="flex items-center space-x-2">
              <button
                onClick={onPlayPause}
                className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                <span className="text-sm">{isPlaying ? "Pause" : "Play"}</span>
              </button>
              <audio
                ref={audioElementRef}
                src={audioUrl}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {finalTranscription && (
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] min-w-[120px] justify-center"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm">Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                <span>Save Recording</span>
              </>
            )}
          </button>

          <button
            onClick={onRerecord}
            className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 min-h-[48px] min-w-[120px] justify-center"
          >
            <RotateCcw className="h-5 w-5" />
            <span>Record Again</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default RealTimeRecording;
