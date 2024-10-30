import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './auth/LoginPage';
import Users from './Auth/Users';
import Header from "./pages/Header";
import UserDetails from './Auth/UserDetails';
import DashboardPage from './Home/DashboardPage';
import TransferHistory from './Transaction/TransferHistory';
import RegisterForm from './Auth/Registre';

function AppRoutes() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/trunsuctionhistory" element={<TransferHistory />} />

                <Route path="/users" element={<Users />} />
                <Route path="/regitre" element={<RegisterForm />} />

                {/* Fix: Use dynamic userId in the path */}
                <Route path="/usersDetails/:userId" element={<UserDetails />} />
            </Routes>
        </Router>
    );
}

export default AppRoutes;
