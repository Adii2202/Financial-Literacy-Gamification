import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import financeQuestions from "../data/dailyData";

const DailyModal = ({ open, handleClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [selectedOption, setSelectedOption] = useState("");
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [loading, setLoading] = useState(true);

  // const handleOpen = () => {
  //     const randomIndex = Math.floor(Math.random() * financeQuestions.length);
  //     setCurrentQuestion(financeQuestions[randomIndex]);
  //     setSelectedOption('');
  //     setIsAnswerCorrect(false);
  //     setLoading(true)
  // };

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * financeQuestions.length);
    setCurrentQuestion(financeQuestions[randomIndex]);
    setSelectedOption("");
    setIsAnswerCorrect(false);
    setLoading(false);
  }, []);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = () => {
    if (selectedOption === currentQuestion.answer) {
      setIsAnswerCorrect(true);

      toast.success("Correct answer!");
    } else {
      setIsAnswerCorrect(false);
      toast.error("Incorrect answer! Try again.");
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Welcome to the daily challenge!
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {loading ? (
              <div>
                <CircularProgress />
              </div>
            ) : (
              <>
                {currentQuestion.question}
                <FormControl component="fieldset">
                  <FormLabel component="legend">Options</FormLabel>
                  <RadioGroup
                    aria-label="options"
                    name="options"
                    value={selectedOption}
                    onChange={handleOptionChange}
                  >
                    {currentQuestion.options.map((option) => (
                      <FormControlLabel
                        key={option.id}
                        value={option.id}
                        control={<Radio />}
                        label={option.text}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} autoFocus>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default DailyModal;
