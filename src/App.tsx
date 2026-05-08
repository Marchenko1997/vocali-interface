import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import ProtectedRoute from "./components/ProtectedRoute";
import Auth from "./pages/Auth";
import Main from "./pages/Main";
import Studio from "./pages/Studio";
;
import Insights from "./pages/Insights";


function App() {
  return (
    <Provider store={store}>
      <Router>
    
        <Routes>
          {/* Public routes */}
          <Route path="/auth" element={<Auth />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Main />
              </ProtectedRoute>
            }
          />
          <Route
            path="/studio"
            element={
              <ProtectedRoute>
                <Studio />
              </ProtectedRoute>
            }
          />
          <Route
            path="/insights"
            element={
              <ProtectedRoute>
                <Insights />
              </ProtectedRoute>
            }
          />

          {/* Redirect to auth if no route matches */}
          <Route path="*" element={<Navigate to="/auth#login" replace />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
