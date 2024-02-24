import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    id: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    authorName: {
        type: String,
        required: true,
    },
    createdAt: {
        type: String,
        required: true,
    },
    cover: {
        type: String,
        required: true,
    },
});

const User = mongoose.model("blog", blogSchema);

export default User;