import mongoose from "mongoose";

const ItemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  desc: {
    type: String,
    required: false,
  },
  img: {
    type: String,
    required: true,
  },
});

const inventoryItem = new mongoose.Schema({
  avatar: [
    {
      attack: { type: Number },
      defense: { type: Number },
      name: { type: String },
      desc: { type: String },
      image: { type: String, default: "/assets/avatars/a-1.png" },
    },
  ],
  potions: [
    {
      name: { type: String },
      value: { type: Number },
      desc: { type: String },
      img: { type: String },
    },
  ],
  boosts: [
    {
      name: { type: String },
      value: { type: Number },
      desc: { type: String },
      img: { type: String },
    },
  ],
});

const budgetSchema = new mongoose.Schema({
  questions: [
    {
      index: {
        type: Number,
        required: true,
      },
      solved: {
        type: Boolean,
        default: false,
      },
      visited: {
        type: Boolean,
        default: false,
      },
    },
  ],
  score: {
    type: Number,
    default: 0,
  },
  submitted: {
    type: Boolean,
    default: false,
  },
});
const InvestSchema = new mongoose.Schema({
  questions: [
    {
      index: {
        type: Number,
        required: true,
      },
      solved: {
        type: Boolean,
        default: false,
      },
      visited: {
        type: Boolean,
        default: false,
      },
    },
  ],
  score: {
    type: Number,
    default: 0,
  },
  submitted: {
    type: Boolean,
    default: false,
  },
});
const FinSchema = new mongoose.Schema({
  questions: [
    {
      index: {
        type: Number,
        required: true,
      },
      solved: {
        type: Boolean,
        default: false,
      },
      visited: {
        type: Boolean,
        default: false,
      },
    },
  ],
  score: {
    type: Number,
    default: 0,
  },
  submitted: {
    type: Boolean,
    default: false,
  },
});

const gamingSchema = new mongoose.Schema({
  health: {
    type: Number,
    default: 50,
  },
  avatar: {
    attack: {
      type: Number,
      default: 10,
    },
    defense: {
      type: Number,
      default: 5,
    },
    image: {
      type: String,
      default: "/assets/avatars/a-1.png",
    },
  },
  exp: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 1,
  },
  maxHealth: {
    type: Number,
    default: 50,
  },
  maxExp: {
    type: Number,
    default: 100,
  },
});

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    default: "",
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  isAdminGenerated: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Number,
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  friends: [
    {
      name: { type: String },
      email: { type: String },
      id: { type: String },
    },
  ],
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
  },
  pfp: {
    type: String,
  },
  bio: {
    type: String,
  },
  title: {
    type: String,
    default: "Novice",
  },
  coins: {
    type: Number,
    default: 0,
  },
  gems: {
    type: Number,
    default: 0,
  },
  badges: {
    type: String,
  },
  blessons: budgetSchema,
  flessons: FinSchema,
  investlessons: InvestSchema,
  gaming: {
    type: gamingSchema,
    default: {
      health: 50,
      avatar: {
        attack: 10,
        defense: 5,
        image: "/assets/avatars/a-1.png",
      },
      exp: 0,
      level: 1,
      maxHealth: 50,
      maxExp: 100,
    },
  },
  partyId: {
    type: String,
  },

  notifications: [
    {
      title: {
        type: String,
      },
      isRead: {
        type: Boolean,
      },
      info: {
        type: Object,
      },
    },
  ],

  monetaryStats: {
    income: {
      type: Number,
      default: 0,
    },
    balance: {
      type: Number,
      default: 0,
    },
    split: {
      necessities: {
        type: Number,
        default: 0,
      },
      wants: {
        type: Number,
        default: 0,
      },
      savings: {
        type: Number,
        default: 0,
      },
    },
    dailyExpenditure: {
      necessities: {
        type: Number,
        default: 0,
      },
      wants: {
        type: Number,
        default: 0,
      },
      savings: {
        type: Number,
        default: 0,
      },
    },
    totalSplit: {
      necessities: {
        type: Number,
        default: 0,
      },
      wants: {
        type: Number,
        default: 0,
      },
      savings: {
        type: Number,
        default: 0,
      },
    },
  },

  inventory: inventoryItem,
  tasks: [TaskSchema],
});

const User = mongoose.model("innov_user", userSchema);
export default User;
