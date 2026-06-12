import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import MatterList from './pages/MatterList';
import MatterDetail from './pages/MatterDetail';
import DocumentEditor from './pages/DocumentEditor';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/matters" element={
            <ProtectedRoute>
              <MatterList />
            </ProtectedRoute>
          } />
          <Route path="/matters/:id" element={
            <ProtectedRoute>
              <MatterDetail />
            </ProtectedRoute>
          } />
          <Route path="/matters/:matterId/documents/new" element={
            <ProtectedRoute>
              <DocumentEditor />
            </ProtectedRoute>
          } />
          <Route path="/documents/:docId" element={
            <ProtectedRoute>
              <DocumentEditor />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;