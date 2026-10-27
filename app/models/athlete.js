const mongoose = require('mongoose');
 
const athleteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
 
  // Tab 1: Account and Profile
  account: {
    role: {
      type: String,
      required: [true, 'Please choose how you will use LiftFlow'],
      enum: {
        values: ['Athlete', 'Coach', 'Both'],
        message: 'Choose Athlete, Coach, or Both'
      }
    },
    language: {
      type: String,
      required: [true, 'Please choose a language'],
      enum: {
        values: ['English', 'Spanish'],
        message: 'Choose English or Spanish'
      }
    },
    unitSystem: {
      type: String,
      required: [true, 'Please choose a unit system'],
      enum: {
        values: ['Metric', 'Imperial'],
        message: 'Choose Metric or Imperial'
      }
    }
  }
 
  // Next tabs:
  // discipline: { ... },
  // goals: { ... },
  // availability: { ... },
  // startingPoint: { ... },
  // nutrition: { ... }
}, { timestamps: true });
 
module.exports = mongoose.model('Athlete', athleteSchema);
