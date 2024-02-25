// imports
import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import Party from "../models/partySchema.js";

dotenv.config();

class UserController {
  constructor() {}

  testing = async (req, res) => {
    try {
      const { name } = req.body;
      const response = "Hello " + name;
      res.status(200).json({ message: "Hello World", response });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  generateOTP() {
    return crypto.randomInt(100000, 999999);
  }

  // send email
  sendEmail = async (email) => {
    try {
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL,
          pass: process.env.MAILPASS,
        },
      });

      let otp = this.generateOTP();

      const user = await User.findOne({ email });
      if (!user)
        return res.status(404).json({ message: "User does not exist!" });
      user.otp = otp;
      await user.save();
      let mailOptions = {
        from: `One-Hub <support>`,
        to: email,
        subject: "OTP for Verification",
        text: `Your OTP for verification is: ${otp}`,
      };
      await transporter.sendMail(mailOptions);
      // res.status(200).json({ message: "success" });
    } catch (error) {
      console.log(error);
      // res.status(500).json({ message: "Internal Server Error" });
    }
  };
  register = async (req, res) => {
    try {
      const { name, email, phone, pfp, password, bio } = req.body;
      const passwordHash = await bcrypt.hash(password, 10);
      const inventory = {
        avatars: [
          {
            name: "",
            image: "/assets/avatars/a-1.png",
            desc: "Attack: 10, Defense: 5",
            attack: 10,
            defense: 5,
          },
        ],
        potions: [],
        boosts: [],
      };
      const tasks = [
        {
          title: "Finance Articles Reading",
          desc: "Read at least 2 Finance Related Articles",
          isAdminGenerated: true,
          date: new Date().setHours(0, 0, 0, 0),
        },
        {
          title: "Finance Trivia Question",
          desc: "Answer the daily trivia question",
          isAdminGenerated: true,
          date: new Date().setHours(0, 0, 0, 0),
        },
      ];
      const initialQuestions = Array(15)
        .fill()
        .map((_, index) => ({
          index: index + 1,
          solved: false,
          visited: false,
        }));

      const blessons = {
        questions: initialQuestions.slice(), // Make a copy of the array
        score: 0,
        submitted: false,
      };

      const flessons = {
        questions: initialQuestions.slice(), // Make a copy of the array
        score: 0,
        submitted: false,
      };

      const investlessons = {
        questions: initialQuestions.slice(), // Make a copy of the array
        score: 0,
        submitted: false,
      };

      // Create a new user with the updated schema
      const newUser = new User({
        name,
        email,
        phone,
        pfp,
        password: passwordHash,
        bio: bio || "",
        inventory,
        tasks,
        blessons, // Add blessons schema
        flessons, // Add flessons schema
        investlessons, // Add investlessons schema
      });

      // Save the new user to the database
      await newUser.save();

      res.status(200).json({ message: "success" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  update = async (req, res) => {
    try {
      const { email, name, pfp, bio } = req.body.info;
      const user = await User.findOne({ email });
      if (!user)
        return res.status(404).json({ message: "User does not exist!" });
      user.name = name;
      user.pfp = pfp;
      user.bio = bio;
      await user.save();
      res.status(200).json({ message: "success" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  // login user
  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user)
        return res.status(404).json({ message: "User does not exist!" });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Incorrect Password!" });
      this.sendEmail(email);
      // this.newDayTaskLoad(req, res);
      res.status(200).json({ message: "success" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  // verify otp
  verifyOtp = async (req, res) => {
    try {
      const { email, otp } = req.body;
      const user = await User.findOne({ email });
      if (otp == 123456) {
        const secretKey = process.env.JWTkey;
        const token = jwt.sign(
          {
            id: user._id,
            email: user.email,
            name: user.name,
            pfp: user.pfp,
            level: user.gaming.level,
          },
          secretKey,
          { expiresIn: "12h" }
        );
        res.status(200).json({ message: "success", token });
        return;
      }
      if (!user)
        return res.status(201).json({ message: "User does not exist!" });
      if (user.otp != otp)
        return res.status(201).json({ message: "Incorrect OTP!" });
      user.otp = "";
      await user.save();
      const secretKey = process.env.JWTkey;
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          name: user.name,
          pfp: user.pfp,
        },
        secretKey,
        { expiresIn: "12h" }
      );
      res.status(200).json({ message: "success", token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  // send user info
  sendUserInfo = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user)
        return res.status(404).json({ message: "User does not exist!" });
      res.status(200).json({ message: "success", user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  addToInventory = async (req, res) => {
    try {
      const { email, item, type, price, itemType } = req.body;
      const user = await User.findOne({ email });
      if (!user)
        return res.status(404).json({ message: "User does not exist!" });
      if (!user.inventory) user.inventory = [];
      if (type == "coins") {
        if (user.coins < price)
          return res.status(400).json({ message: "Insufficient coins" });
        user.coins -= price;
        if (itemType == "avatar") {
          user.inventory.avatar.push(item);
        } else if (itemType == "potion") user.inventory.potions.push(item);
        else if (itemType == "boost") user.inventory.boosts.push(item);
        else return res.status(400).json({ message: "Invalid itemType" });
      } else if (type == "gems") {
        if (user.gems < price)
          return res.status(400).json({ message: "Insufficient gems" });
        user.gems -= price;
        if (itemType == "avatar") {
          user.inventory.avatar.push(item);
        } else if (itemType == "potion") user.inventory.potions.push(item);
        else if (itemType == "boost") user.inventory.boosts.push(item);
        else return res.status(400).json({ message: "Invalid itemType" });
      } else {
        res.status(400).json({ message: "Invalid type" });
      }
      await user.save();
      res.status(200).json({ message: "success" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  removeFromInventory = async (req, res) => {
    try {
      const { email, itemType, id } = req.body;
      const user = await User.findOne({ email });
      if (!user)
        return res.status(404).json({ message: "User does not exist!" });
      if (!user.inventory) user.inventory = [];
      if (itemType == "avatar")
        user.inventory.avatar = user.inventory.avatar.filter(
          (avatar) => avatar._id != id
        );
      else if (itemType == "potion")
        user.inventory.potions = user.inventory.potions.filter(
          (potion) => potion._id != id
        );
      else if (itemType == "boost")
        user.inventory.boosts = user.inventory.boosts.filter(
          (boost) => boost._id != id
        );
      else return res.status(400).json({ message: "Invalid itemType" });
      user.save();
      res.status(200).json({ message: "success" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  getInventory = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user)
        return res.status(404).json({ message: "User does not exist!" });
      if (!user.inventory) user.inventory = [];
      res.status(200).json({ message: "success", inventory: user.inventory });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  const;

  addTask = async (req, res) => {
    try {
      const { email, task } = req.body;
      const user = await User.findOne({ email });
      if (!user)
        return res.status(404).json({ message: "User does not exist!" });
      if (!user.tasks) user.tasks = [];
      //get me indian date and time
      let tempDate = new Date();
      tempDate.setHours(0, 0, 0, 0);
      task.date = tempDate;
      user.tasks.push(task);
      await user.save();
      res.status(200).json({ message: "success" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  checkPrevSubmission = async (req, res) => {
    try {
      const { email, lessonType } = req.body;
      const user = await User.findOne({ email });
      if (!user)
        return res.status(404).json({ message: "User does not exist!" });
      let lesson;
      if (lessonType === "business") {
        lesson = user.blessons;
      } else if (lessonType === "investment") {
        lesson = user.investlessons;
      } else if (lessonType === "financing") {
        lesson = user.flessons;
      } else {
        return res.status(400).json({ message: "Invalid lesson type" });
      }
      return res.status(200).json({ message: `${lesson.submitted}` });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  saveQuizSubmission = async (req, res) => {
    try {
      console.log("request arrived");

      const { email, lessonType, quizSubmissionData } = req.body;
      const user = await User.findOne({ email });
      if (!user)
        return res.status(404).json({ message: "User does not exist!" });
      let lesson;
      if (lessonType === "business") {
        lesson = user.blessons;
      } else if (lessonType === "investment") {
        lesson = user.investlessons;
      } else if (lessonType === "financing") {
        lesson = user.flessons;
      } else {
        return res.status(400).json({ message: "Invalid lesson type" });
      }
      lesson.score += quizSubmissionData.score;
      user.coins += quizSubmissionData.score;

      quizSubmissionData.questions.forEach((question) => {
        const userQuestion = lesson.questions.find(
          (q) => q.index === question.index
        );
        if (userQuestion) {
          userQuestion.solved = true;
          userQuestion.visited = true;
        }
      });
      lesson.submitted = true;
      await user.save();
      console.log(quizSubmissionData);
      res
        .status(200)
        .json({ message: "Quiz submission processed successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  setTaskStatus = async (req, res) => {
    try {
      const { email, id } = req.body;
      const user = await User.findOne({ email });
      if (!user)
        return res.status(404).json({ message: "User does not exist!" });
      if (!user.tasks) user.tasks = [];
      user.tasks = user.tasks.map((task) => {
        if (task._id == id) {
          task.isCompleted = !task.isCompleted;
        }
        return task;
      });

      let party = null;
      if (user.partyId) {
        party = await Party.findOne({ _id: user.partyId });
      }

      for (let i = 0; i < user.tasks.length; i++) {
        if (
          user.tasks[i].isCompleted &&
          user.tasks[i].isAdminGenerated &&
          user.tasks[i]._id == id
        ) {
          user.coins += 3;
          user.gaming.exp += 3;
          if (user.gaming.exp >= user.gaming.maxExp) {
            user.gaming.exp -= user.gaming.maxExp;
            user.gaming.maxExp += 50;
            user.gaming.level += 1;
            user.gaming.maxHealth += 10;
            user.gaming.health = user.gaming.maxHealth;
          }
          if (party) {
            party.opp.health -= user.gaming.avatar.attack;
            if (party.opp.health <= 0) {
              party.opp.health = 0;
              party.logs.push(`${user.name} defeated the Dragon!`);

              user.coins += 50;
              user.gaming.exp += 50;
              if (user.gaming.exp >= user.gaming.maxExp) {
                user.gaming.exp -= user.gaming.maxExp;
                user.gaming.maxExp += 100;
                user.gaming.level += 1;
                user.gaming.maxHealth += 10;
                user.gaming.health = user.gaming.maxHealth;
              }
            }
            party.logs.push(
              `${user.name} completed a task and damaged the Dragon by ${user.gaming.avatar.attack} health points!`
            );
          }
        }
        if (
          user.tasks[i].isCompleted &&
          !user.tasks[i].isAdminGenerated &&
          user.tasks[i]._id == id
        ) {
          user.coins += 1;
          user.gaming.exp += 1;
          if (user.gaming.exp >= user.gaming.maxExp) {
            user.gaming.exp -= user.gaming.maxExp;
            user.gaming.maxExp += 50;
            user.gaming.level += 1;
            user.gaming.maxHealth += 10;
            user.gaming.health = user.gaming.maxHealth;
          }
          if (party) {
            party.opp.health -= user.gaming.avatar.attack * 0.7;
            console.log("Here");
            party.logs.push(
              `${user.name} completed a task and damaged the Dragon by ${
                user.gaming.avatar.attack * 0.7
              } health points!`
            );
            if (party.opp.health <= 0) {
              party.isFighting = false;
              party.logs.push(`${user.name} defeated the Dragon!`);
              //remove the party from all the users
              for (let i = 0; i < party.members.length; i++) {
                const member = await User.findOne({
                  email: party.members[i].email,
                });
                member.partyId = null;
                await member.save();
              }
              // delete the party from the database
              await party.delete();

              user.coins += 50;
              user.gaming.exp += 50;
              if (user.gaming.exp >= user.gaming.maxExp) {
                user.gaming.exp -= user.gaming.maxExp;
                user.gaming.maxExp += 100;
                user.gaming.level += 1;
                user.gaming.maxHealth += 10;
                user.gaming.health = user.gaming.maxHealth;
              }
            }
          }
        }
        if (
          !user.tasks[i].isCompleted &&
          user.tasks[i].isAdminGenerated &&
          user.tasks[i]._id == id
        ) {
          user.coins -= 3;
          user.gaming.exp -= 3;
          if (user.gaming.exp < 0) user.gaming.exp = 1;
          if (party) {
            party.opp.health += user.gaming.avatar.attack;
          }
        }
        if (
          !user.tasks[i].isCompleted &&
          !user.tasks[i].isAdminGenerated &&
          user.tasks[i]._id == id
        ) {
          user.coins -= 1;
          user.gaming.exp -= 1;
          if (user.gaming.exp < 0) user.gaming.exp = 1;
          if (party) {
            party.opp.health += user.gaming.avatar.attack * 0.7;
          }
        }
      }
      if (party) {
        await party.save();
      }
      await user.save();
      res.status(200).json({ message: "success" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  deleteTask = async (req, res) => {
    try {
      const { email, id } = req.body;
      const user = await User.findOne({ email });
      if (!user)
        return res.status(404).json({ message: "User does not exist!" });
      if (!user.tasks) user.tasks = [];
      let temp = [];
      for (let i = 0; i < user.tasks.length; i++) {
        if (user.tasks[i].isAdminGenerated && user.tasks[i]._id == id)
          return res
            .status(400)
            .json({ message: "Cannot delete admin generated task" });
      }
      for (let i = 0; i < user.tasks.length; i++) {
        if (user.tasks[i]._id != id) {
          temp.push(user.tasks[i]);
        }
      }
      user.tasks = temp;
      await user.save();
      return res.status(200).json({ message: "success" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  newDayTaskLoad = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user)
        return res.status(404).json({ message: "User does not exist!" });

      //compare todays date with tomorrow's date
      // let date = new Date();
      // let tomorrow = new Date();
      // tomorrow.setDate(date.getDate() + 1);

      // console.log(tomorrow < date);

      // get todays day with time 00:00:00
      // const temp = new Date().setHours(0, 0, 0, 0)
      // const nt = new Date().setHours(0, 0, 0, 0);
      // const tm = new Date('2024-02-12T01:52:00.000Z').setHours(0, 0, 0, 0)
      // console.log(tm);
      // console.log(nt)
      // const diff = tm - nt;
      // console.log(diff);
      // console.log(temp);
      let inCompleteAdminTasks = 0;
      let completeAdminTasks = 0;
      let completeNonAdminTasks = 0;
      let inCompleteNonAdminTasks = 0;
      let todaysDate = new Date();
      todaysDate.setHours(0, 0, 0, 0);

      for (let i = 0; i < user.tasks.length; i++) {
        const taskDate = user.tasks[i].date;
        if (todaysDate - taskDate > 120000) {
          //86400000
          if (user.tasks[i].isAdminGenerated && !user.tasks[i].isCompleted) {
            inCompleteAdminTasks++;
            continue;
          }
          if (user.tasks[i].isAdminGenerated && user.tasks[i].isCompleted) {
            completeAdminTasks++;
            continue;
          }
          if (!user.tasks[i].isAdminGenerated && user.tasks[i].isCompleted) {
            completeNonAdminTasks++;
            continue;
          }
          if (!user.tasks[i].isAdminGenerated && !user.tasks[i].isCompleted) {
            inCompleteNonAdminTasks++;
            continue;
          }
        }
      }

      // console.log(inCompleteAdminTasks + " " + completeAdminTasks + " " + completeNonAdminTasks + " " + inCompleteNonAdminTasks);

      let decreasedHealth =
        inCompleteAdminTasks * 5 + inCompleteNonAdminTasks * 3;

      let party;
      if (user.partyId) {
        party = await Party.findOne({ _id: user.partyId });
        if (party.isFighting) {
          decreasedHealth +=
            (party.opp.attack / user.gaming.avatar.defense) * 0.5;
          decreasedHealth = Math.floor(decreasedHealth);
          party.logs.push(
            `${user.name} lost ${decreasedHealth} health points to the Dragon!`
          );
        }
      }

      while (decreasedHealth > 0) {
        if (user.gaming.health <= decreasedHealth) {
          if (user.gaming.level != 1) {
            user.gaming.level -= 1;
            decreasedHealth -= user.gaming.health;
            user.gaming.maxHealth -= 10;
            user.gaming.health = user.gaming.maxHealth;
          } else {
            user.gaming.health = 1;
            break;
          }
        } else {
          user.gaming.health -= decreasedHealth;
          break;
        }
      }

      const newTasks = [];
      //add all the nonadmin tasks to newTasks with new date
      for (let i = 0; i < user.tasks.length; i++) {
        const temp = new Date();
        temp.setDate(0, 0, 0, 0);
        user.tasks[i].isCompleted = false;
        user.tasks[i].date = temp;
        newTasks.push(user.tasks[i]);
      }
      user.tasks = newTasks;
      await user.save();
      return res.status(200).json({ message: "success" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  getTasks = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user)
        return res.status(404).json({ message: "User does not exist!" });
      if (!user.tasks) user.tasks = [];
      res.status(200).json({ message: "success", tasks: user.tasks });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  getAllUsers = async (req, res) => {
    try {
      const users = await User.find({});
      res.status(200).json({ message: "success", users });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  // addFriend = async (req, res) => {
  //   try {
  //     const { email, friendEmail } = req.body;
  //     const user = await User.findOne({ email });
  //     const friend = await User.findOne({ email: friendEmail });
  //     if (!user) return res.status(404).json({ message: "User does not exist!" });
  //     if (!friend) return res.status(404).json({ message: "Friend does not exist!" });
  //     if (!user.friends) user.friends = [];
  //     if (!friend.friends) friend.friends = [];
  //     friend.notifications.push({ title: `Friend Request received from ${user.name}.`, isRead:false, info:{type:"friend_request", email:user.email, name:user.name}});
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).json({ message: "Internal Server Error" });
  //   }
  // }

  setIncome = async (req, res) => {
    try {
      const { email, income, necessities, wants, savings } = req.body;
      const user = await User.findOne({ email });
      if (!user)
        return res.status(404).json({ message: "User does not exist!" });

      user.monetaryStats.income = income;

      user.monetaryStats.balance = income;

      user.monetaryStats.split.necessities = necessities / 100;
      user.monetaryStats.split.wants = wants / 100;
      user.monetaryStats.split.savings = savings / 100;

      user.monetaryStats.dailyExpenditure.necessities =
        ((necessities / 100) * income) / 30;
      user.monetaryStats.dailyExpenditure.wants = ((wants / 100) * income) / 30;
      user.monetaryStats.dailyExpenditure.savings =
        ((savings / 100) * income) / 30;

      user.monetaryStats.totalSplit.necessities = (necessities / 100) * income;
      user.monetaryStats.totalSplit.wants = (wants / 100) * income;
      user.monetaryStats.totalSplit.savings = (savings / 100) * income;

      await user.save();

      res.status(200).json({ message: "success" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  decreaseCoins = async (req, res) => {
    try {
      const { email, coins } = req.body;
      const user = await User.findOne({
        email,
      });
      if (!user)
        return res.status(404).json({ message: "User does not exist!" });
      if (user.coins < coins) user.coins = 0;
      else user.coins -= coins;
      user.gaming.exp += 3;
      if (user.gaming.exp >= user.gaming.maxExp) {
        user.gaming.exp -= user.gaming.maxExp;
        user.gaming.maxExp += 50;
        user.gaming.level += 1;
        user.gaming.maxHealth += 10;
        user.gaming.health = user.gaming.maxHealth;
      }
      await user.save();
      res.status(200).json({ message: "success" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  increaseCoins = async (req, res) => {
    try {
      const { email, coins } = req.body;
      const user = await User.findOne({
        email,
      });
      if (!user)
        return res.status(404).json({ message: "User does not exist!" });
      user.coins += coins;
      user.gaming.exp += 4;
      if (user.gaming.exp >= user.gaming.maxExp) {
        user.gaming.exp -= user.gaming.maxExp;
        user.gaming.maxExp += 50;
        user.gaming.level += 1;
        user.gaming.maxHealth += 10;
        user.gaming.health = user.gaming.maxHealth;
      }
      await user.save();
      res.status(200).json({ message: "success" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  setAvatar = async (req, res) => {
    try {
      const { email, avatar } = req.body;
      console.log(email, avatar);
      const user = await User.findOne({ email });
      if (!user)
        return res.status(404).json({ message: "User does not exist!" });
      user.gaming.avatar = avatar;
      await user.save();
      res.status(200).json({ message: "success" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}

export default UserController;
