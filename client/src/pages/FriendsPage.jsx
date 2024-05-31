import React, { useEffect, useState } from "react";
import Api from "../api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const LeaderBoard = () => {
  const [users, setUsers] = useState(null);
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [isLoading, setLoading] = useState(true);

  const currentUserRank = users
    ? users.findIndex((user) => user._id === userInfo._id) + 1
    : 1;

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const res = await Api.getAllUsers();
        const sortedUsers = res.data.users.sort((a, b) => b.coins - a.coins);
        setUsers(sortedUsers);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        toast.error("Error occurred 😶‍🌫️");
      }
    };
    getAllUsers();
  }, []);

  return (
    <motion.div className="w-screen h-full flex flex-col justify-evenly items-center">
      {isLoading ? (
        <span className="animate-pulse text-xl font-bold">Loading...</span>
      ) : (
        <motion.div className="w-full h-full p-10">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow
                    key={user._id}
                    style={
                      user._id === userInfo._id
                        ? { backgroundColor: "#FFEB3B" }
                        : null
                    }
                  >
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.coins}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* <p>Your Rank: {currentUserRank + 1}</p> */}
          </TableContainer>
        </motion.div>
      )}
    </motion.div>
  );
};

export default LeaderBoard;
