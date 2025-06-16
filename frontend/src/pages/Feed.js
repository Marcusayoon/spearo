import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { sessions } from '../services/api';
import { HeartIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const Feed = () => {
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth0();

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      const response = await sessions.getFeed();
      setFeedItems(response.data);
    } catch (error) {
      console.error('Error loading feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (sessionId) => {
    try {
      await sessions.like(sessionId);
      loadFeed(); // Reload feed to get updated likes
    } catch (error) {
      console.error('Error liking session:', error);
    }
  };

  const handleComment = async (sessionId, comment) => {
    try {
      await sessions.comment(sessionId, comment);
      loadFeed(); // Reload feed to get updated comments
    } catch (error) {
      console.error('Error adding comment:', error);
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
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Recent Sessions</h1>
      <div className="space-y-6">
        {feedItems.map((session) => (
          <div key={session._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Session Header */}
            <div className="p-4 border-b">
              <div className="flex items-center space-x-3">
                <img
                  src={session.user.profilePicture || 'https://via.placeholder.com/40'}
                  alt={session.user.username}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <Link to={`/profile/${session.user._id}`} className="font-medium text-gray-900">
                    {session.user.username}
                  </Link>
                  <p className="text-sm text-gray-500">
                    {new Date(session.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Session Content */}
            <div className="p-4">
              <div className="mb-4">
                <h3 className="font-medium text-gray-900">Location: {session.location.name}</h3>
                <p className="text-sm text-gray-500">
                  Conditions: {session.conditions.visibility}/5 visibility, {session.conditions.waterTemp}°C
                </p>
              </div>

              {/* Catches */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Catches:</h4>
                <div className="grid grid-cols-2 gap-4">
                  {session.catches.map((catch_, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded">
                      <p className="font-medium">{catch_.species}</p>
                      <p className="text-sm text-gray-500">
                        {catch_.size}cm, {catch_.weight}kg
                      </p>
                      {catch_.photo && (
                        <img
                          src={catch_.photo}
                          alt={catch_.species}
                          className="mt-2 rounded w-full h-32 object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {session.notes && (
                <p className="text-gray-700 mb-4">{session.notes}</p>
              )}

              {/* Actions */}
              <div className="flex items-center space-x-4 border-t pt-4">
                <button
                  onClick={() => handleLike(session._id)}
                  className="flex items-center space-x-1 text-gray-500 hover:text-primary-600"
                >
                  {session.likes.includes(user?.sub) ? (
                    <HeartIconSolid className="h-6 w-6 text-red-500" />
                  ) : (
                    <HeartIcon className="h-6 w-6" />
                  )}
                  <span>{session.likes.length}</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500 hover:text-primary-600">
                  <ChatBubbleLeftIcon className="h-6 w-6" />
                  <span>{session.comments.length}</span>
                </button>
              </div>

              {/* Comments */}
              {session.comments.length > 0 && (
                <div className="mt-4 border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Comments:</h4>
                  <div className="space-y-2">
                    {session.comments.map((comment, index) => (
                      <div key={index} className="flex space-x-2">
                        <img
                          src={comment.user.profilePicture || 'https://via.placeholder.com/32'}
                          alt={comment.user.username}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-sm">{comment.user.username}</p>
                          <p className="text-gray-700">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed; 