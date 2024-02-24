import React, { useState } from 'react';

const QuestionsForm2 = () => {
  const [answers, setAnswers] = useState(Array(15).fill(''));
  const [showAnswers, setShowAnswers] = useState(false);
  const [score, setScore] = useState(null);

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    calculateScore();
    setShowAnswers(true);
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    answers.forEach((answer, index) => {
      if (answer === correctChoices[index]) {
        correctAnswers++;
      }
    });
    setScore((correctAnswers / 15) * 100); // Assuming each question is worth 1 point
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
    "How can budgeting help in reducing debt?"
  ];

  const choices = [
    ['a) To limit spending', 'b) To track income and expenses', 'c) To achieve financial goals', 'd) All of the above'],
    ['a) Expenses that change from month to month', 'b) Expenses that remain constant each month', 'c) Expenses incurred only on weekends', 'd) Expenses related to entertainment'],
    ['a) Expenses that remain constant each month', 'b) Expenses that change from month to month', 'c) Expenses incurred only on weekends', 'd) Expenses related to entertainment'],
    ['a) Needs are essential for survival, while wants are desires.', 'b) Needs are desires, while wants are essential for survival.', 'c) Needs are luxurious, while wants are basic necessities.', 'd) Needs and wants are the same in budgeting.'],
    ['a) A fund set aside for unexpected expenses or emergencies', 'b) A fund used for vacation expenses', 'c) A fund invested in the stock market', 'd) A fund for buying luxury items'],
    ['a) A budgeting method where every dollar of income is allocated to expenses or savings', 'b) A budgeting method that focuses only on spending', 'c) A budgeting method that involves borrowing money to cover expenses', 'd) A budgeting method that does not involve tracking expenses'],
    ['a) The difference between budgeted and actual expenses', 'b) The total amount of expenses', 'c) The amount of money allocated for savings', 'd) The total income earned'],
    ['a) A method of tracking expenses using physical envelopes', 'b) A method of budgeting that involves only using cash for purchases', 'c) A method of budgeting that involves setting aside money for different spending categories', 'd) A method of budgeting that focuses on investing in envelopes'],
    ['a) Allocating 50% of income for needs, 30% for wants, and 20% for savings', 'b) Allocating 50% of income for savings, 30% for needs, and 20% for wants', 'c) Allocating 50% of income for wants, 30% for savings, and 20% for needs', 'd) Allocating 50% of income for needs, 20% for wants, and 30% for savings'],
    ['a) Funds set aside for specific future expenses', 'b) Funds used for daily expenses', 'c) Funds invested in the stock market', 'd) Funds used for paying off debt'],
    ['a) Tracking income only', 'b) Tracking expenses and income', 'c) Tracking expenses only', 'd) Tracking budgeted expenses only'],
    ['a) A specific amount of money set aside for future expenses', 'b) A long-term financial aspiration', 'c) A financial plan for the next year', 'd) A method of tracking expenses'],
    ['a) Better control over finances', 'b) Ability to achieve financial goals', 'c) Reduction of financial stress', 'd) All of the above'],
    ['a) A budget that is prepared and reviewed regularly, with new projections replacing outdated ones', 'b) A budget that remains constant throughout the year', 'c) A budget that is prepared only once and not reviewed', 'd) A budget that focuses only on expenses'],
    ['a) By allocating more money for debt repayment', 'b) By reducing unnecessary expenses', 'c) By increasing income', 'd) All of the above']
  ];

  const correctChoices = ['d) All of the above', 'b) Expenses that remain constant each month', 'b) Expenses that change from month to month', 'a) Needs are essential for survival, while wants are desires.', 'a) A fund set aside for unexpected expenses or emergencies', 'a) A budgeting method where every dollar of income is allocated to expenses or savings', 'a) The difference between budgeted and actual expenses', 'c) A method of budgeting that involves setting aside money for different spending categories', 'a) Allocating 50% of income for needs, 30% for wants, and 20% for savings', 'a) Funds set aside for specific future expenses', 'b) Tracking expenses and income', 'b) A long-term financial aspiration', 'd) All of the above', 'a) A budget that is prepared and reviewed regularly, with new projections replacing outdated ones', 'd) All of the above'];

  return (
    <div className="max-w-md mx-auto mt-8">
      <form onSubmit={handleSubmit}>
        {questions.map((question, index) => (
          <div key={index} className="mb-4">
            <p className="mb-2 font-medium">Q{index + 1}: {question}</p>
            <div className="space-y-2">
              {choices[index].map((choice, i) => (
                <label key={i} className="flex items-center">
                  <input
                    type="radio"
                    name={`${question}${index}`}
                    value={choice}
                    checked={answers[index] === choice}
                    onChange={() => handleAnswerChange(index, choice)}
                    className="mr-2"
                    disabled={showAnswers}
                  />
                  {choice}
                </label>
              ))}
            </div>
            {showAnswers && <p className="text-gray-600">Correct answer: {correctChoices[index]}</p>}
          </div>
        ))}
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" disabled={showAnswers}>
          Submit Answers
        </button>
        {showAnswers && <p className="mt-4">Your score: {score}%</p>}
      </form>
    </div>
  );
};

export default QuestionsForm2;
