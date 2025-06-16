import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { users, sessions } from '../services/api';
import { UserPlusIcon, UserMinusIcon } from '@heroicons/react/24/outline';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth0();
  const [profile, setProfile] = useState(null);
  const [userSessions, setUserSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCatches: 0,
    favoriteSpecies: '',
    bestSpot: '',
  });

  useEffect(() => {
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    try {
      const [profileResponse, sessionsResponse] = await Promise.all([
        users.getProfile(id),
        sessions.getUserSessions(id),
      ]);
      
      setProfile(profileResponse.data);
      setUserSessions(sessionsResponse.data);
      calculateStats(sessionsResponse.data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (sessions) => {
    const catches = sessions.flatMap(session => session.catches);
    const speciesCount = catches.reduce((acc, catch_) => {
      acc[catch_.species] = (acc[catch_.species] || 0) + 1;
      return acc;
    }, {});

    const favoriteSpecies = Object.entries(speciesCount)
      .sort(([, a], [, b]) => b - a)[0]?.[0];

    const spotCount = sessions.reduce((acc, session) => {
      acc[session.location.name] = (acc[session.location.name] || 0) + 1;
      return acc;
    }, {});

    const bestSpot = Object.entries(spotCount)
      .sort(([, a], [, b]) => b - a)[0]?.[0];

    setStats({
      totalCatches: catches.length,
      favoriteSpecies,
      bestSpot,
    });
  };

  const handleFollow = async () => {
    try {
      if (profile.followers.includes(currentUser.sub)) {
        await users.unfollow(profile._id);
      } else {
        await users.follow(profile._id);
      }
      loadProfile();
    } catch (error) {
      console.error('Error following/unfollowing:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start space-x-6">
          <img
            src={profile.profilePicture || 'https://via.placeholder.com/150'}
            alt={profile.username}
            className="w-32 h-32 rounded-full"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">{profile.username}</h1>
              {currentUser.sub !== profile._id && (
                <button
                  onClick={handleFollow}
                  className="btn btn-primary flex items-center space-x-2"
                >
                  {profile.followers.includes(currentUser.sub) ? (
                    <>
                      <UserMinusIcon className="h-5 w-5" />
                      <span>Unfollow</span>
                    </>
                  ) : (
                    <>
                      <UserPlusIcon className="h-5 w-5" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              )}
            </div>
            <p className="text-gray-600 mt-2">{profile.bio}</p>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{profile.followers.length}</p>
                <p className="text-gray-500">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{profile.following.length}</p>
                <p className="text-gray-500">Following</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{stats.totalCatches}</p>
                <p className="text-gray-500">Total Catches</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Stats</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Favorite Species</p>
            <p className="text-lg font-medium">{stats.favoriteSpecies || 'N/A'}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Best Spot</p>
            <p className="text-lg font-medium">{stats.bestSpot || 'N/A'}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Total Sessions</p>
            <p className="text-lg font-medium">{userSessions.length}</p>
          </div>
        </div>
      </div>

      {/* Activity Map */}
      {profile.favoriteSpots.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Favorite Spots</h2>
          <div className="h-64 rounded-lg overflow-hidden">
            <MapContainer
              center={[profile.favoriteSpots[0].coordinates.lat, profile.favoriteSpots[0].coordinates.lng]}
              zoom={10}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {profile.favoriteSpots.map((spot, index) => (
                <Marker
                  key={index}
                  position={[spot.coordinates.lat, spot.coordinates.lng]}
                >
                  <Popup>{spot.name}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      )}

      {/* Recent Sessions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Recent Sessions</h2>
        <div className="space-y-4">
          {userSessions.slice(0, 5).map((session) => (
            <div key={session._id} className="border-b pb-4 last:border-b-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{session.location.name}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(session.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{session.catches.length} catches</p>
                  <p className="text-sm text-gray-500">
                    {session.conditions.visibility}/5 visibility
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile; 