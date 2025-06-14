const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    name: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  catches: [{
    species: {
      type: String,
      required: true
    },
    size: Number, // in cm
    weight: Number, // in kg
    photo: String
  }],
  conditions: {
    visibility: {
      type: Number, // 1-5 scale
      min: 1,
      max: 5
    },
    waterTemp: Number, // in Celsius
    tide: {
      type: String,
      enum: ['low', 'rising', 'high', 'falling']
    },
    weather: String
  },
  notes: String,
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Session', sessionSchema); 