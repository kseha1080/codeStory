const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const StorySchema = new Schema({
  title:{
    type:String,
    required: true
  },
  body:{
    type: String,
    required: false
  },
  status: {
    type: String,
    default:'select'
  },
  category: {
    type: String,
    default: 'select'
  },
  allowComments: {
    type: Boolean,
    default:true
  },
  description: {
    type: String,
  },
  languages: {
    type: String,
    default: 'select'
  },
  repolink: {
    type: String
  },
  comments: [{
    commentBody: {
      type: String,
      required: true
    },
    commentDate:{
      type: Date,
      default: Date.now
    },
    commentUser:{
      type: Schema.Types.ObjectId,
      ref:'users'
    }
  }],
  user:{
    type: Schema.Types.ObjectId,
    ref:'users'
  },
  date:{
    type: Date,
    default: Date.now
  }
});

// Create collection and add schema
mongoose.model('stories', StorySchema, 'stories');