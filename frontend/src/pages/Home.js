import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const Home = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">Track Your</span>
          <span className="block text-primary-600">Spearfishing Adventures</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Log your catches, share your experiences, and connect with the spearfishing community.
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          {isAuthenticated ? (
            <Link to="/feed" className="btn btn-primary">
              Go to Feed
            </Link>
          ) : (
            <button onClick={() => loginWithRedirect()} className="btn btn-primary">
              Get Started
            </button>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">Features</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="relative">
              <div className="text-lg font-medium text-gray-900">Track Your Sessions</div>
              <p className="mt-2 text-base text-gray-500">
                Log your spearfishing sessions with detailed information about catches, conditions, and locations.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="relative">
              <div className="text-lg font-medium text-gray-900">Community Feed</div>
              <p className="mt-2 text-base text-gray-500">
                Share your experiences and see what others are catching in your area.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="relative">
              <div className="text-lg font-medium text-gray-900">Data Insights</div>
              <p className="mt-2 text-base text-gray-500">
                Get insights about the best times and conditions for successful spearfishing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 