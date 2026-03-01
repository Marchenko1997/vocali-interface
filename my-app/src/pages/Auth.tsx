import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'      
import { useSelector } from 'react-redux'            
import Login from './Login'
import Register from './Register'
import Confirmation from './Confirmation'
import type { RootState } from '../redux/store'
import ForgotPassword from './ForgotPassword'



const Auth = () => {
    const location = useLocation()
const [currentView, setCurrentView] = useState<"login" | "register" | "forgot">(
  "login",
);
    
    const { needsConfirmation } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash === "register") setCurrentView("register");
    else if (hash === "forgot") setCurrentView("forgot");
    else setCurrentView("login");
  }, [location.hash]);

    if (needsConfirmation) {
        return <Confirmation/>
    }

return (
  <>
    {currentView === "login" && <Login />}
    {currentView === "register" && <Register />}
    {currentView === "forgot" && <ForgotPassword />}
  </>
);
}
 export default Auth