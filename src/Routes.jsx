import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './auth/LoginPage';
import Users from './Auth/Users';
import Header from "./pages/Header";
import UserDetails from './Auth/UserDetails';
import DashboardPage from './Home/DashboardPage';
import TransferHistory from './Transaction/TransferHistory';
import RegisterForm from './Auth/Registre';
import { AuthProvider, useAuth } from './providers/AuthContext';

// Composant pour les routes protégées (vérifie uniquement l'authentification)
function ProtectedRoute({ element, redirectPath = "/login" }) {
    const { user } = useAuth();
    const isAuthenticated = !!user;

    return isAuthenticated ? element : <Navigate to={redirectPath} replace />;
}

function AppRoutes() {
    return (
        <AuthProvider>
            <Router>
                <Header />
                <Routes>
                    {/* Route publique pour la page de connexion */}
                    <Route path="/login" element={<Login />} />

                    {/* Routes protégées qui nécessitent uniquement une authentification */}
                    <Route 
                        path="/" 
                        element={<ProtectedRoute element={<DashboardPage />} />} 
                    />
                    <Route 
                        path="/trunsuctionhistory" 
                        element={<ProtectedRoute element={<TransferHistory />} />} 
                    />
                    <Route 
                        path="/users" 
                        element={<ProtectedRoute element={<Users />} />} 
                    />
                    <Route 
                        path="/regitre" 
                        element={<ProtectedRoute element={<RegisterForm />} />} 
                    />
                    <Route 
                        path="/usersDetails/:userId" 
                        element={<ProtectedRoute element={<UserDetails />} />} 
                    />
                    
                    {/* Fallback route pour toute autre route non définie */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default AppRoutes;
