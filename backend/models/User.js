const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        maxlength: 254
    },
    password: { type: String, required: true },
    role: { type: String, enum: ['developer', 'admin'], default: 'developer' },
}, { timestamps: true });

// Never let a password hash leave the API, whatever the caller does.
UserSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.password;
        return ret;
    }
});

module.exports = mongoose.model('User', UserSchema);
