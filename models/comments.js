const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    content: { type: String, required: true}
}, {
    // uses Mongoose 4.0 timestamps option
    // Tells mongoose to assign createdAt and updatedAt fields to this schema, type is Date
    // Changes default property name from createdAt to created_at
    timestamps: {createdAt: 'created_at'}
}
)

// Exports comment schema under the name 'Comment'
module.exports = mongoose.model('Comment', CommentSchema)