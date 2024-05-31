import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from "@mui/material";
import { toast } from "react-toastify";
import Api from "../../api";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLLMInference,
  selectInferenceResult,
  BotOpen,
  isbotOpen,
} from "../../redux/features/llmslice";

const QuestionsForm2 = () => {
  var total = 0;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(15).fill(""));
  const [showAnswers, setShowAnswers] = useState(false);
  const [viewedSolutions, setViewedSolutions] = useState(Array(15).fill(false));
  const [cursubmitted, setCurrSubmitted] = useState(Array(15).fill(false));
  const [score, setScore] = useState(null);
  const [showcurr, setShowcurr] = useState(false);
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [can, setCan] = useState(true);
  const dispatch = useDispatch();
  const inferenceResult = useSelector(selectInferenceResult);
  const isBotOpen = useSelector(isbotOpen);
  const toggleBot = () => {
    dispatch(BotOpen.actions.togglebot());
  };
  const setOpen = () => {
    dispatch(BotOpen.actions.setBot({ payload: true }));
  };
  const setClose = () => {
    dispatch(BotOpen.actions.setBot({ payload: false }));
  };
  const sendMessage = (msg) => {
    dispatch(fetchLLMInference(msg));
  };

  // useEffect(() => {
  //   const callfirst = async () => {
  //     await Api.checkQuiz({
  //       email: userInfo.email,
  //       lessonType: "business",
  //     }).then((res) => {
  //       if (res.data == "true") {
  //         setCan(true);
  //         toast.success("you can attempt this quiz only one time");
  //       } else {
  //         toast.error(
  //           "You have attempted this quiz earlier but you can still see solutions"
  //         );
  //         setCan(false);
  //       }
  //     });
  //   };
  //   callfirst();
  // }, []);

  const removeselection = () => {
    setAnswers({ ...answers, [currentQuestion]: "" });
  };

  const seeSol = () => {
    setShowcurr(currentQuestion);
    setViewedSolutions({ ...viewedSolutions, [currentQuestion]: true });
  };

  // const handleAnswerChange = (event) => {
  //   setAnswers({ ...answers, [currentQuestion]: event.target.value });
  // };
  const handleAnswerChange = (event) => {
    const updatedAnswers = [...answers]; // Create a copy of answers array
    updatedAnswers[currentQuestion] = event.target.value; // Update the current question's answer
    setAnswers(updatedAnswers); // Update state
  };

  const handleSubmit = async () => {
    if (!can) {
      toast.error(
        "You have attempted this quiz earlier but you can still see solutions"
      );
      return;
    }
    let correctAnswers = 0;
    answers.forEach((answer, index) => {
      if (answer === correctChoices[index]) {
        correctAnswers += 4;
      } else if (answer != "") {
        correctAnswers--;
      }
    });
    let fscore;
    if (correctAnswers > 0) fscore = correctAnswers;
    else fscore = 0;
    console.log(score);
    const quizSubmissionData = {
      score: fscore,
      questions: answers.map((answer, index) => ({
        index: index,
        answer: answer,
      })),
    };
    toast.success("sending");
    console.log("sending request");
    await Api.quizSubmission({
      email: userInfo.email,
      lessonType: "business",
      quizSubmissionData: quizSubmissionData,
    })
      .then((res) =>
        toast.success("Successfully submitted Quiz, keep on going ✨✨")
      )
      .catch((err) =>
        toast.error(
          `Failed to submit quiz. Please try again later, err: ${err}`
        )
      );
    setShowAnswers(true);
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    answers.forEach((answer, index) => {
      if (answer === correctChoices[index]) {
        correctAnswers += 4;
      } else if (answer != "") {
        correctAnswers--;
      }
    });
    if (correctAnswers > 0) setScore(correctAnswers);
    else setScore(0);
  };

  const handleNextQuestion = () => {
    setShowAnswers(false);
    setShowcurr(false);
    setCurrentQuestion((prevQuestion) => prevQuestion + 1);
  };

  const handlesubmitwithNext = () => {
    if (!can) {
      return;
    }
    if (answers[currentQuestion] == "") {
      toast.error("Please select an option to submit");
      return;
    }
    if (
      answers[currentQuestion] == correctChoices[currentQuestion] &&
      !cursubmitted[currentQuestion]
    ) {
      total += 4;
      toast.success("Correct answer +4 coins");
    } else {
      total -= 1;
      toast.error("Nice try but have to bear penatly of -1 coin");
    }
    setCurrSubmitted({ ...cursubmitted, [currentQuestion]: true });
    setShowAnswers(false);
    setShowcurr(false);
    setCurrentQuestion((prevQuestion) => prevQuestion + 1);
  };

  const handlePreviousQuestion = () => {
    setShowAnswers(false);
    setCurrentQuestion((prevQuestion) => prevQuestion - 1);
  };

  const handleViewSolution = () => {
    setShowAnswers(true);
  };
  const questions = [
    "What is the purpose of creating a budget?",
    "Define 'fixed expenses' and provide an example.",
    "What are 'variable expenses' and give an example.",
    "Explain the difference between needs and wants in budgeting.",
    "What is an emergency fund, and why is it important in budgeting?",
    "What is the 'zero-based budgeting' method?",
    "Define the term 'budget variance' in budgeting.",
    "What is the 'envelope system' of budgeting?",
    "What is the 50/30/20 rule in budgeting?",
    "Explain the concept of 'sinking funds' in budgeting.",
    "What is 'tracking expenses', and why is it essential in budgeting?",
    "Define the term 'financial goal' in budgeting.",
    "What are the benefits of budgeting?",
    "Explain the concept of 'rolling budget' in budgeting.",
    "How can budgeting help in reducing debt?",
  ];

  const choices = [
    [
      "a) To limit spending",
      "b) To track income and expenses",
      "c) To achieve financial goals",
      "d) All of the above",
    ],
    [
      "a) Expenses that change from month to month",
      "b) Expenses that remain constant each month",
      "c) Expenses incurred only on weekends",
      "d) Expenses related to entertainment",
    ],
    [
      "a) Expenses that remain constant each month",
      "b) Expenses that change from month to month",
      "c) Expenses incurred only on weekends",
      "d) Expenses related to entertainment",
    ],
    [
      "a) Needs are essential for survival, while wants are desires.",
      "b) Needs are desires, while wants are essential for survival.",
      "c) Needs are luxurious, while wants are basic necessities.",
      "d) Needs and wants are the same in budgeting.",
    ],
    [
      "a) A fund set aside for unexpected expenses or emergencies",
      "b) A fund used for vacation expenses",
      "c) A fund invested in the stock market",
      "d) A fund for buying luxury items",
    ],
    [
      "a) A budgeting method where every dollar of income is allocated to expenses or savings",
      "b) A budgeting method that focuses only on spending",
      "c) A budgeting method that involves borrowing money to cover expenses",
      "d) A budgeting method that does not involve tracking expenses",
    ],
    [
      "a) The difference between budgeted and actual expenses",
      "b) The total amount of expenses",
      "c) The amount of money allocated for savings",
      "d) The total income earned",
    ],
    [
      "a) A method of tracking expenses using physical envelopes",
      "b) A method of budgeting that involves only using cash for purchases",
      "c) A method of budgeting that involves setting aside money for different spending categories",
      "d) A method of budgeting that focuses on investing in envelopes",
    ],
    [
      "a) Allocating 50% of income for needs, 30% for wants, and 20% for savings",
      "b) Allocating 50% of income for savings, 30% for needs, and 20% for wants",
      "c) Allocating 50% of income for wants, 30% for savings, and 20% for needs",
      "d) Allocating 50% of income for needs, 20% for wants, and 30% for savings",
    ],
    [
      "a) Funds set aside for specific future expenses",
      "b) Funds used for daily expenses",
      "c) Funds invested in the stock market",
      "d) Funds used for paying off debt",
    ],
    [
      "a) Tracking income only",
      "b) Tracking expenses and income",
      "c) Tracking expenses only",
      "d) Tracking budgeted expenses only",
    ],
    [
      "a) A specific amount of money set aside for future expenses",
      "b) A long-term financial aspiration",
      "c) A financial plan for the next year",
      "d) A method of tracking expenses",
    ],
    [
      "a) Better control over finances",
      "b) Ability to achieve financial goals",
      "c) Reduction of financial stress",
      "d) All of the above",
    ],
    [
      "a) A budget that is prepared and reviewed regularly, with new projections replacing outdated ones",
      "b) A budget that remains constant throughout the year",
      "c) A budget that is prepared only once and not reviewed",
      "d) A budget that focuses only on expenses",
    ],
    [
      "a) By allocating more money for debt repayment",
      "b) By reducing unnecessary expenses",
      "c) By increasing income",
      "d) All of the above",
    ],
  ];

  const correctChoices = [
    "d) All of the above",
    "b) Expenses that remain constant each month",
    "b) Expenses that change from month to month",
    "a) Needs are essential for survival, while wants are desires.",
    "a) A fund set aside for unexpected expenses or emergencies",
    "a) A budgeting method where every dollar of income is allocated to expenses or savings",
    "a) The difference between budgeted and actual expenses",
    "c) A method of budgeting that involves setting aside money for different spending categories",
    "a) Allocating 50% of income for needs, 30% for wants, and 20% for savings",
    "a) Funds set aside for specific future expenses",
    "b) Tracking expenses and income",
    "b) A long-term financial aspiration",
    "d) All of the above",
    "a) A budget that is prepared and reviewed regularly, with new projections replacing outdated ones",
    "d) All of the above",
  ];

  return (
    <motion.div
      key={currentQuestion}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-100 min-h-[600px] flex flex-col justify-center items-center p-6"
    >
      <FormControl
        component="form"
        onSubmit={(e) => e.preventDefault()}
        sx={{ width: 600, margin: "auto" }}
        className="w-4/5 h-[400px] flex flex-col justify-between items-center bg-white p-6 rounded-xl shadow-md"
      >
        <div className="p-8">
          <p className="mb-2 font-medium">
            Q{currentQuestion + 1}: {questions[currentQuestion]}
          </p>
          <RadioGroup
            value={answers[currentQuestion]}
            onChange={handleAnswerChange}
          >
            {choices[currentQuestion].map((choice, index) => (
              <FormControlLabel
                key={index}
                value={choice}
                control={<Radio />}
                label={choice}
                disabled={showAnswers}
              />
            ))}
          </RadioGroup>
        </div>
        <div className="flex items-center justify-between m-4">
          <Button
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
            variant="outlined"
            size="small"
            color="primary"
          >
            Previous
          </Button>
          {currentQuestion < questions.length - 1 && (
            <Button
              onClick={
                showcurr ||
                viewedSolutions[currentQuestion] ||
                cursubmitted[currentQuestion]
                  ? handleNextQuestion
                  : handlesubmitwithNext
              }
              size="small"
              color="primary"
            >
              {showcurr ||
              viewedSolutions[currentQuestion] ||
              cursubmitted[currentQuestion]
                ? "Next"
                : "Submit and Next"}
            </Button>
          )}
          <Button
            onClick={removeselection}
            variant="outlined"
            size="small"
            color="secondary"
          >
            Clear
          </Button>
          {!cursubmitted[currentQuestion] && (
            <Button
              onClick={handleNextQuestion}
              size="small"
              varient="outlined"
              color="primary"
            >
              skip
            </Button>
          )}
          {showcurr ? null : (
            <Button
              variant="outline"
              color="secondary"
              size="small"
              onClick={seeSol}
            >
              View solution
            </Button>
          )}
          {currentQuestion === questions.length - 1 && (
            <Button
              type="submit"
              variant="outline"
              size="small"
              color="primary"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          )}
          {showAnswers && <p className="mt-4">Your score: {score}%</p>}
          {showAnswers && (
            <Button
              onClick={handleViewSolution}
              variant="outline"
              color="primary"
              className="mt-4"
              size="small"
            >
              View all Solution
            </Button>
          )}
        </div>
      </FormControl>
      {showcurr ? (
        <motion.div className="flex flex-col justify-evenly items-center w-100 min-h-[200px]">
          <motion.h3>
            Correct option is: {correctChoices[currentQuestion]}
          </motion.h3>
          {!isBotOpen ? (
            <motion.button
              onClick={() => {
                setOpen();
                sendMessage(
                  `I need help with Budgeting, I want to know the correct answer for question: ${
                    questions[currentQuestion]
                  } and the explanation for the correct answer. from options: ${choices[
                    currentQuestion
                  ].toString()}`
                );
              }}
              className="bg-green-500 p-2 rounded-lg"
            >
              Ask for help
            </motion.button>
          ) : (
            <motion.button
              onClick={() => {
                toggleBot();
              }}
              className="bg-red-50)0 rounded-lg w-3/4 text-center font-bold shadow-lg m-4 p-4"
            >
              Window on right side will pop up, please wait to get the answer,
              after that you can ask for help again in same window.
            </motion.button>
          )}
        </motion.div>
      ) : null}
    </motion.div>
  );
};

export default QuestionsForm2;
