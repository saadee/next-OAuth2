import mongoose from 'mongoose';

const UserSchema = mongoose.Schema(
    {
        name: String,
        email: String,
        image: String,
        isAdmin: Boolean,
        accessToken: String,
        refreshToken: String,
        jwtToken: String,
    },
    { timestamps: true },
);

let User;

try {
    User = mongoose.model('users');
} catch (err) {
    User = mongoose.model('users', UserSchema);
}

export default User;
