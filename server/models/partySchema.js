import mongoose from "mongoose";

const gamingSchema = new mongoose.Schema({
  health: {
    type: Number,
    default: 50
  },
  avatar: {
    attack: {
      type: Number,
      default: 10
    },
    defense: {
      type: Number,
      default: 5
    },
    image: {
      type: String,
      default: "/assets/avatars/a-1.png"
    },
  },
  exp: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  maxHealth: {
    type: Number,
    default: 50
  },
  maxExp: {
    type: Number,
    default: 100
  },
});

const partySchema = new mongoose.Schema({
  partyName: {
    type: String,
  },
  members: [{
    email: { type: String },
    isJoined: { type: Boolean },
    name: { type: String },
    gaming: {
      type: gamingSchema,
    },
  }],
  leader: {
    type: String,
  },
  desc: {
    type: String,
  },
  opp: {
    name: {
      type: String,
    },
    health: {
      type: Number,
    },
    attack: {
      type: Number,
    },
    image: {
      type: String,
    },
    maxHealth: {
      type: Number,
    },
  },
  isFighting: {
    type: Boolean,
  },
  logs: [String],
});

const Party = mongoose.model("Party", partySchema);

export default Party;