import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const Navbar = () => {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            Spearo
          </Link>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/feed" className="text-gray-600 hover:text-primary-600">
                  Feed
                </Link>
                <Link to="/new-session" className="text-gray-600 hover:text-primary-600">
                  New Session
                </Link>
                <Link to="/profile" className="text-gray-600 hover:text-primary-600">
                  Profile
                </Link>
                <div className="flex items-center space-x-2">
                  {user?.picture && (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <button
                    onClick={() => logout({ returnTo: window.location.origin })}
                    className="btn btn-secondary"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <button onClick={() => loginWithRedirect()} className="btn btn-primary">
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 