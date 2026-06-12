import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center">
      <Link to="/matters" className="text-xl font-bold tracking-wide">
        LexDraft
      </Link>
      <div className="flex items-center gap-4">
        {user && (
          <>
            <span className="text-sm text-blue-200">Welcome, {user.username}</span>
            <button
              onClick={handleLogout}
              className="bg-blue-700 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;