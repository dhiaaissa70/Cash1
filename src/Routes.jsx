import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './auth/LoginPage';
import UserDetails from './Auth/UsersDetails';
import Header from "./pages/Header"
function AppRoutes() {
    return (
        <Router>
            <Header/>
            <Routes>
                <Route path="/login" element={< Login/>} />
                <Route path="/userdetails" element={< UserDetails/>} />
            </Routes>
        </Router>
    );
}

export default AppRoutes;
