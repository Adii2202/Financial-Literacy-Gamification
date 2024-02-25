import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { CircularProgress } from "@mui/material";
import Api from "../api";

const StockModal = ({ open , userInfo, handleClose}) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();

  useEffect(() => {
    const fetchUser = async () => {
      await Api.getUser({ email: userInfo.email })
        .then((res) => {
          console.log("User:", res.data);
          setUser(res.data.user);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
        });
    };
    fetchUser();
  }, []);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  function timeout(delay) {
    return new Promise((res) => setTimeout(res, delay));
  }

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Your Notifications</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {loading ? (
              <div>
                <CircularProgress />
              </div>
            ) : (
              <>
                <p className="text-green animate-pulse">
                  You have {user.coins} 🪙s available.
                </p>
                <p className="text-red">
                  <strong>Note:</strong> You can use these coins to play the
                  stock market game. You can gain or lose coins based on your
                  performance.
                </p>
                <p className="text-xl">
                  <strong>How to play:</strong> You have to select one of two
                  options from stock, either stock will go up or down and hit
                  submit. If your answer is wrong, points will be deducted
                  accordingly.
                </p>
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Ok</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default StockModal;
