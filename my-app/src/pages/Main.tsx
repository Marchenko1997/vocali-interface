import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut, Heart, Mic, Settings, Loader2, Mail, User } from "lucide-react";
import { getProfile, logout } from "../redux/slices/authSlice";
import type { RootState, AppDispatch } from "../redux/store";
import Logo from "../components/Logo";
import { useEffect, useRef } from "react";


const Main = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { user, isAuthenticated, token, loading } = useSelector(
    (state: RootState) => state.auth
  );
  const hasFetchedProfile = useRef(false);
  console.log("Main component state:", {
    user,
    isAuthenticated,
    token,
    loading,
  });

  useEffect(() => {
    if (
      token &&
      token !== "undefined" &&
      token !== "null" &&
      isAuthenticated &&
      !user &&
      !hasFetchedProfile.current
    ) {
      console.log("Fetching profile...");
      hasFetchedProfile.current = true;
      dispatch(getProfile());
    }
  }, [token, isAuthenticated, dispatch]);

  useEffect(() => {
    if (
      !isAuthenticated ||
      !token ||
      token === "undefined" ||
      token === "null"
    ) {
      console.log("Redirecting to login...");
      hasFetchedProfile.current = false;
      navigate("/auth#login");
    }
  }, [isAuthenticated, token, navigate]);

  const handleLogout = () => {
    hasFetchedProfile.current = false;
    dispatch(logout());
    navigate("/auth#login");
  };

  if (loading && !user && isAuthenticated && token && token !== "undefined") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !token || token === "undefined") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
  
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
        
            <div className="flex items-center space-x-4">
              <Logo size="md" />
              <h1 className="text-2xl font-bold text-gray-800">Vocali</h1>
            </div>

  
            <div className="flex items-center space-x-6">
              {user && (
                <div className="flex items-center space-x-3">
          
                  <div className="flex items-center space-x-2 text-gray-600">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{user.name}</span>
                  </div>

             
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                </div>
              )}

              {/* Кнопка выхода */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>


      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
   
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Mic className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Voice Interface
            </h3>
            <p className="text-gray-600 mb-4">
              Start your voice interaction with Vocali. Click the microphone to
              begin.
            </p>
            <button className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200">
              Start Voice Session
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <Heart className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Favorites
            </h3>
            <p className="text-gray-600 mb-4">
              Access your saved voice commands and favorite interactions.
            </p>
            <button
              onClick={() => navigate("/favorites")}
              className="w-full bg-red-500 text-white font-semibold py-3 px-6 rounded-lg"
            >
              View Favorites
            </button>
          </div>

    
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Settings className="h-8 w-8 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Settings
            </h3>
            <p className="text-gray-600 mb-4">
              Configure your voice preferences and account settings.
            </p>
            <button className="w-full bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg">
              Open Settings
            </button>
          </div>
        </div>

   
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Voice Status
          </h2>
          <div className="flex items-center space-x-4">
         
            <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-600">Voice recognition is ready</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Main;