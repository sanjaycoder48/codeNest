const mongoose = require('mongoose');

const repositorySchema = new mongoose.Schema({
  fullName: { type: String, required: true, index: true },
  owner: { type: String, required: true },
  repoName: { type: String, required: true },
  defaultBranch: { type: String, default: 'main' },
  visibility: { type: String, enum: ['public', 'private'], default: 'public' },
  starsCount: { type: Number, default: 0 },
  readinessScore: { type: Number, default: 86 },
  languages: [{ name: String, files: Number }],
  frameworks: [String],
  dependenciesCount: { type: Number, default: 0 },
  lastSyncedAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Repository', repositorySchema);
