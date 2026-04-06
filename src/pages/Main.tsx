import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  Upload,
  AlertCircle,
  Mic,
  Headphones,
  Heart,
} from "lucide-react";
import { Notify } from "notiflix";
import { logout, getProfile } from "../redux/slices/authSlice";
import type { RootState, AppDispatch } from "../redux/store";
import logoAnimated from "../assets/logo-vocali-animated.mp4";
import api from "../services/api";

import Header from "../components/Header";
import RealTimeRecording from "../components/RealTimeRecording";
import SpotifyPanel from "../components/SpotifyPanel";
import FavoritesPanel from "../components/FavoritesPanel";
import AudioFilesList from "../components/AudioFilesList";

import { useAudioFiles } from "../hooks/useAudioFiles";
import { useSpotify } from "../hooks/useSpotify";


const Main = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, isAuthenticated, token, loading } = useSelector(
    (state: RootState) => state.auth,
  );
  const hasFetchedProfile = useRef(false);

  const [showRealTimeRecording, setShowRealTimeRecording] = useState(false);
  const [savingRealTimeRecording, setSavingRealTimeRecording] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showSpotify, setShowSpotify] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  const audioFiles = useAudioFiles(isAuthenticated, token);
  const spotify = useSpotify();


  // Auth: fetch profile
  useEffect(() => {
    if (
      token &&
      token !== "undefined" &&
      token !== "null" &&
      isAuthenticated &&
      !user &&
      !hasFetchedProfile.current
    ) {
      hasFetchedProfile.current = true;
      dispatch(getProfile());
    }
  }, [token, isAuthenticated, dispatch]);

  // Auth: redirect if not authenticated
  useEffect(() => {
    if (
      !isAuthenticated ||
      !token ||
      token === "undefined" ||
      token === "null"
    ) {
      hasFetchedProfile.current = false;
      navigate("/auth#login");
    }
  }, [isAuthenticated, token, navigate]);

  // Splash screen timer
  useEffect(() => {
    if (isAuthenticated && token && user) {
      const timer = setTimeout(() => setShowSplash(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, token, user]);

  const handleLogout = () => {
    hasFetchedProfile.current = false;
    dispatch(logout());
    navigate("/auth#login");
  };

  const handleRealTimeTranscriptionComplete = async (
    transcriptionText: string,
    audioBlob?: Blob,
  ) => {
    try {
      console.log("Real-time transcription completed:", transcriptionText);
      if (!audioBlob) {
        console.error("No audio blob available for saving");
        return;
      }

      setSavingRealTimeRecording(true);

      const formData = new FormData();
      formData.append("file", audioBlob, "recording.wav");
      formData.append("transcription", transcriptionText);
      formData.append("recordingType", "real-time");

      const response = await api.post("/audio/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Real-time recording saved successfully:", response.data);
      await audioFiles.fetchAudioFiles(1);

      Notify.success("Recording saved successfully!", {
        position: "center-top",
        timeout: 3000,
        clickToClose: true,
        pauseOnHover: true,
        borderRadius: "12px",
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: "14px",
      });
    } catch (error: any) {
      console.error("Failed to save real-time recording:", error);
      Notify.failure(
        "Failed to save recording: " +
          (error.response?.data?.message || error.message),
        {
          position: "center-top",
          timeout: 5000,
          clickToClose: true,
          pauseOnHover: true,
          borderRadius: "12px",
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "14px",
        },
      );
    } finally {
      setSavingRealTimeRecording(false);
    }
  };

  const handleRealTimeError = (error: string) => {
    console.error("Real-time recording error:", error);
  };


  // Loading states
  if (
    loading &&
    !user &&
    isAuthenticated &&
    token &&
    token !== "undefined" &&
    token !== "null"
  ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !token || token === "undefined" || token === "null") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (showSplash && isAuthenticated && token && user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <video
            autoPlay
            muted
            loop
            className="w-48 h-48 sm:w-64 sm:h-64 mx-auto max-w-[300px] max-h-[300px]"
          >
            <source src={logoAnimated} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="mt-8">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-white text-lg mt-4 font-medium">
              Welcome to Vocali
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="space-y-6 sm:space-y-8">
          {/* Action Cards Grid */}
          <div className="cards grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {/* Upload Audio Card */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex-shrink-0">
                  <Upload className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                    Upload Audio
                  </h3>
                  <p className="text-gray-600 mb-3 text-xs sm:text-sm">
                    Upload your audio file for voice processing and analysis.
                    Maximum file size: 20 MB.
                  </p>
                </div>
              </div>

              <input
                ref={audioFiles.fileInputRef}
                type="file"
                accept="audio/*"
                onChange={audioFiles.handleFileUpload}
                className="hidden"
              />

              <div className="relative group">
                <button
                  onClick={audioFiles.handleUploadClick}
                  disabled={audioFiles.uploading}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 sm:py-3 px-4  hover:scale-[1.01]
    active:scale-[0.99]
    transition-all duration-200 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base min-h-[44px]"
                >
                  {audioFiles.uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      <span>Upload Audio</span>
                    </>
                  )}
                </button>

                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  <div className="flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>Maximum 20 MB audio files</span>
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>

              {audioFiles.uploadError && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
                    <span className="text-xs text-red-600">
                      {audioFiles.uploadError}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Real-Time Recording Card */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex-shrink-0">
                  <Mic className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                    Real-Time Recording
                  </h3>
                  <p className="text-gray-600 mb-3 text-xs sm:text-sm">
                    Record audio directly from your microphone with live
                    transcription.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowRealTimeRecording(!showRealTimeRecording)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold py-2 sm:py-3 px-4 rounded-lg hover:scale-[1.01]
    active:scale-[0.99] transition-all duration-200 hover:from-purple-600 hover:to-pink-700  flex items-center justify-center space-x-2 text-sm sm:text-base min-h-11"
              >
                <Mic className="h-4 w-4" />
                <span className="">
                  {showRealTimeRecording ? "Hide Recorder" : "Start Recording"}
                </span>
              </button>
            </div>

            {/* Music Control Card */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex-shrink-0">
                  <Headphones className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                    Music Control
                  </h3>
                  <p className="text-gray-600 mb-3 text-xs sm:text-sm">
                    Control Spotify with your voice
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSpotify(!showSpotify)}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold py-2 sm:py-3 px-4 rounded-lg  hover:scale-[1.01]
    active:scale-[0.99]
    transition-all duration-200 hover:from-emerald-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base min-h-[44px]"
              >
                <Headphones className="h-4 w-4" />
                <span>
                  {showSpotify ? "Stop Spotify Music" : "Start Spotify Music"}
                </span>
              </button>
            </div>

            {/* Favorites Card */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-pink-100 rounded-full">
                  <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-pink-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                    Favorites
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Your saved tracks
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowFavorites(!showFavorites)}
                className="
                  w-full mt-3
                  bg-gradient-to-r from-pink-500 to-rose-600
                  text-white font-semibold
                  py-2 sm:py-3 rounded-lg
                  hover:scale-[1.01]
                  active:scale-[0.99]
                  transition-all duration-200
                  flex items-center justify-center gap-2
                "
              >
                <Heart className="h-4 w-4" />
                {showFavorites ? "Hide Favorites" : "View Favorites"}
              </button>
            </div>
          </div>

          {/* Favorites Panel */}
          <div
            className={`
    transition-all duration-300 overflow-hidden will-change-transform
    ${
      showFavorites
        ? "opacity-100 translate-y-0 max-h-[500px]"
        : "opacity-0 -translate-y-2 max-h-0 pointer-events-none"
    }
  `}
          >
            <FavoritesPanel
              favorites={spotify.favorites}
              selectedTrack={spotify.selectedTrack}
              onSelectTrack={spotify.selectTrack}
              onRemoveFavorite={spotify.removeFavorite}
            />
          </div>
          {/* Spotify Panel */}
          <div
            className={`
    transition-all duration-300 overflow-hidden
    ${
      showSpotify
        ? "opacity-100 translate-y-0 max-h-[500px]"
        : "opacity-0 -translate-y-2 max-h-0 pointer-events-none"
    }
  `}
          >
            <SpotifyPanel
              spotifyQuery={spotify.spotifyQuery}
              onQueryChange={spotify.setSpotifyQuery}
              onSearch={spotify.handleSpotifySearch}
              loadingSpotify={spotify.loadingSpotify}
              spotifyResults={spotify.spotifyResults}
              hasSearched={spotify.hasSearched}
              selectedTrack={spotify.selectedTrack}
              playerSrc={spotify.playerSrc}
              isPlayerLoading={spotify.isPlayerLoading}
              onPlayerLoad={() => spotify.setIsPlayerLoading(false)}
              onSelectTrack={spotify.selectTrack}
              isFavorite={spotify.isFavorite}
              onToggleFavorite={spotify.toggleFavorite}
              loadMore={spotify.loadMore}
              hasMore={spotify.hasMore}
            />
          </div>

          {/* Real-Time Recording */}
          <div
            className={`
    transition-all duration-300 overflow-hidden will-change-transform
    ${
      showRealTimeRecording
        ? "opacity-100 translate-y-0 max-h-[500px]"
        : "opacity-0 -translate-y-2 max-h-0 pointer-events-none"
    }
  `}
          >
            <div className="max-w-2xl mx-auto">
              <RealTimeRecording
                onTranscriptionComplete={handleRealTimeTranscriptionComplete}
                onError={handleRealTimeError}
                isSaving={savingRealTimeRecording}
              />
            </div>
          </div>

          {/* Audio Files List */}
          <AudioFilesList
            audioFiles={audioFiles.audioFiles}
            loadingFiles={audioFiles.loadingFiles}
            deletingFiles={audioFiles.deletingFiles}
            activeAudio={audioFiles.activeAudio}
            setActiveAudio={audioFiles.setActiveAudio}
            pagination={audioFiles.pagination}
            currentPage={audioFiles.currentPage}
            onPageChange={audioFiles.handlePageChange}
            onDelete={audioFiles.handleDeleteAudio}
            onDownloadText={audioFiles.handleDownloadText}
          />
        </div>
      </main>
    </div>
  );
};;

export default Main;
