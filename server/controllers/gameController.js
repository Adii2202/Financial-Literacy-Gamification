import User from "../models/userSchema.js";
import Party from "../models/partySchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

class GameController {
    constructor() { }

    testing = async (req, res) => {
        try {
            const { name } = req.body;
            const response = 'Hello ' + name;
            res.status(200).json({ message: "Hello World", response });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }


    deleteParty = async (req, res) => {
        try {
            const { email, partyId } = req.body;
            const party = await Party.findOne({ _id: partyId });
            if (!party) {
                return res.status(400).json({ message: "Party not found" });
            }
            if (party.leader !== email) {
                return res.status(400).json({ message: "User is not the leader of the party" });
            }
            else {
                for (let i = 0; i < party.members.length; i++) {
                    const member = await User.findOne({ email: party.members[i] });
                    // remove partyId field from user
                    member.partyId = null;
                    await member.save();
                }
                await party.deleteOne();
                res.status(200).json({ message: "Party deleted successfully" });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    sendInvite = async (req, res) => {
        try {
            const { email, partyName, senderName, receiverEmails } = req.body;
            if (receiverEmails.length > 2) {
                return res.status(400).json({ message: "Receiver Email length is unaccepetable!" });
            }
            let partyId;
            const user = await User.findOne({ email });
            if (user.partyId) {
                return res.status(400).json({ message: "User already in a party" });
            } else {
                const party = {
                    partyName,
                    leader: email,
                    members: [{ email, isJoined: true, name: senderName, gaming: user.gaming }],
                }
                const newParty = new Party(party);
                partyId = newParty._id;
                user.partyId = partyId;
                await user.save();
                await newParty.save();
            }

            const party = await Party.findOne({ _id: partyId });

            // console.log(receiver);
            for (let i = 0; i < receiverEmails.length; i++) {
                const receiver = await User.findOne({ email: receiverEmails[i] });
                if (!receiver) {
                    return res.status(400).json({ message: "User not found" });
                }
                else {
                    party.members.push({ email: receiverEmails[i], isJoined: false, name: receiver.name, gaming: receiver.gaming });
                    receiver.notifications.unshift({ title: `You have been invited to join a party from ${senderName} to ${partyName}`, isRead: false, info: { partyId, partyName, type: "party_invite" } });
                    await receiver.save();
                    //send email
                    let transporter = nodemailer.createTransport({
                        service: "gmail",
                        auth: {
                            user: process.env.MAIL,
                            pass: process.env.MAILPASS,
                        },
                    });

                    let mailOptions = {
                        from: `One-Hub <support>`,
                        to: receiverEmails[i],
                        subject: "One-Hub: Party Invite",
                        text: `
You have been invited to join a party from ${senderName} to ${partyName}\n
Click here to Login: http://localhost:3000/ and join party with party id: ${partyId}
                    `,
                    };
                    await transporter.sendMail(mailOptions);
                    res.status(200).json({ message: "Invite sent successfully" });
                }
            }
            await party.save();
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    acceptInvite = async (req, res) => {
        try {
            const { email, partyId } = req.body;
            const user = await User.findOne({ email });
            if (user.partyId) {
                return res.status(400).json({ message: "User already in a party" });
            } else {
                const party = await Party.findOne({ _id: partyId });
                //make isJoined true 
                for (let i = 0; i < party.members.length; i++) {
                    if (party.members[i].email === email) {
                        party.members[i].isJoined = true;
                    }
                }
                if (!party) {
                    return res.status(400).json({ message: "Party not found" });
                }

                //remove the notification
                const index = user.notifications.findIndex((notification) => notification.info.partyId === partyId);
                user.notifications.splice(index, 1);
                user.partyId = partyId;
                await user.save();
                await party.save();
                res.status(200).json({ message: "Invite accepted successfully" });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    startFight = async (req, res) => {
        try {
            const { partyId } = req.body;
            const party = await Party.findOne({ _id: partyId });
            if (!party) {
                return res.status(400).json({ message: "Party not found" });
            }

            for (let i = 0; i < party.members.length; i++) {
                if (party.members[i].isJoined === false) {
                    return res.status(400).json({ message: "Not all party members are ready" });
                }
            }
            party.opp.name = "Ender Dragon";
            let oppHealth = 0;
            let oppAttack = 0;

            for (let i = 0; i < party.members.length; i++) {
                const member = await User.findOne({ email: party.members[i].email });
                oppAttack += (member.gaming.maxHealth) * 0.6;
                oppHealth += member.gaming.avatar.attack * 10;
            }
            party.opp.maxHealth = oppHealth;

            party.opp.health = oppHealth;
            party.opp.attack = oppAttack;
            party.opp.image = "/assets/ender_dragon.gif"
            party.isFighting = true;
            await party.save();
            res.status(200).json({ message: "Fight started successfully" });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    leaveParty = async (req, res) => {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });
            if (!user.partyId) {
                return res.status(400).json({ message: "User not in a party" });
            } else {
                const party = await Party.findOne({ _id: user.partyId });
                if (!party) {
                    return res.status(400).json({ message: "Party not found" });
                }
                const index = party.members.indexOf(email);
                party.members.splice(index, 1);
                user.partyId = null;
                if (party.leader === email) {
                    if (party.members.length === 0) {
                        await party.deleteOne();
                        await user.save();
                        return res.status(200).json({ message: "User left party successfully" });
                    }
                    party.leader = party.members[0];
                }
                await user.save();
                await party.save();
                res.status(200).json({ message: "User left party successfully" });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    getParty = async (req, res) => {
        try {
            const { partyId } = req.body;
            console.log(req.body)
            const party = await Party.findOne({ _id: partyId });
            if (!party) {
                return res.status(400).json({ message: "Party not found" });
            }
            res.status(200).json({ party });
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    completeFight = async (req, res) => {
        try {
            const { partyId } = req.body;
            const party = await Party.findOne({ _id: partyId });
            if (!party) {
                return res.status(400).json({ message: "Party not found" });
            }
            party.isFighting = false;
            //remove the party from all the users
            for (let i = 0; i < party.members.length; i++) {
                const member = await User.findOne({ email: party.members[i].email });
                member.partyId = null;
                await member.save();
            }
            // delete the party from the database
            await party.delete();
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

export default GameController;
