const mongoose = require('mongoose');

const analysisResultSchema = new mongoose.Schema({
  repositoryId: { type: String, required: true, index: true },
  branch: { type: String, default: 'main' },
  risk: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'MEDIUM' },
  confidence: { type: Number, default: 94 },
  filesChanged: [String],
  stats: {
    additions: { type: Number, default: 0 },
    deletions: { type: Number, default: 0 }
  },
  impact: {
    components: { type: Number, default: 0 },
    apis: { type: Number, default: 0 },
    tests: { type: Number, default: 0 },
    workflows: { type: Number, default: 0 }
  },
  duplicateFindings: [{
    type: String,
    fileA: String,
    linesA: String,
    fileB: String,
    linesB: String,
    similarity: Number,
    reason: String,
    recommendation: String
  }],
  recommendedTests: [{ name: String, passed: Boolean }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

module.exports = mongoose.model('AnalysisResult', analysisResultSchema);
