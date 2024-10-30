import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './auth/LoginPage';
import Users from './Auth/Users';
import Header from "./pages/Header"
import UserDetails from './Auth/UserDetails';
function AppRoutes() {
    return (
        <Router>
            <Header/>
            <Routes>
                <Route path="/login" element={< Login/>} />
                <Route path="/users" element={< Users/>} />
                <Route path="/usersDetails" element={< UserDetails/>} />

            </Routes>
        </Router>
    );
}

export default AppRoutes;
