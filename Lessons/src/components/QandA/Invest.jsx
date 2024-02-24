import React, { useState } from 'react';

const QuestionsForm = () => {
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
    "What is the primary goal of investing?",
    "Define 'diversification' in the context of investments.",
    "What is the difference between stocks and bonds?",
    "What is the role of risk in investment?",
    "What does 'ROI' stand for?",
    "What is the significance of the 'time horizon' in investing?",
    "What is an ETF?",
    "What are mutual funds?",
    "What is dollar-cost averaging?",
    "Define 'asset allocation'.",
    "What is a dividend?",
    "Explain the concept of 'compounding' in investing.",
    "What is an index fund?",
    "What factors should you consider when evaluating an investment opportunity?",
    "What are some common investment strategies?"
  ];

  const choices = [
    ['a) Maximizing short-term profits', 'b) Minimizing taxes', 'c) Achieving long-term financial goals', 'd) Avoiding financial risk'],
    ['a) Investing in a single asset class', 'b) Spreading investments across various asset classes', 'c) Buying only high-risk assets', 'd) Putting all investments in one stock'],
    ['a) Stocks represent ownership in a company, while bonds represent loans to a company or government.', 'b) Stocks are issued by the government, while bonds are issued by companies.', 'c) Stocks guarantee a fixed return, while bonds offer variable returns.', 'd) Stocks offer fixed returns, while bonds offer variable returns.'],
    ['a) Risk is irrelevant in investment decisions.', 'b) Higher returns are always associated with lower risk.', 'c) Higher returns are typically associated with higher risk.', 'd) Risk has no impact on investment returns.'],
    ['a) Return on Investment', 'b) Risk of Investment', 'c) Rate of Inflation', 'd) Return of Income'],
    ['a) It determines the fees associated with an investment.', 'b) It refers to the time it takes for an investment to mature.', 'c) It refers to the duration for which an investor plans to hold an investment.', 'd) It is the frequency at which dividends are paid out.'],
    ['a) A type of retirement account', 'b) An investment that tracks an index', 'c) A type of insurance policy', 'd) A savings account with high interest rates'],
    ['a) Investment options traded on the stock market', 'b) A type of retirement account', 'c) Investments that pool money from multiple investors to purchase securities', 'd) A form of insurance against investment losses'],
    ['a) A strategy to buy low and sell high', 'b) Investing a fixed amount of money at regular intervals', 'c) A method of buying only high-risk assets', 'd) Investing in foreign currencies'],
    ['a) Spreading investments across different asset classes', 'b) Concentrating investments in one asset class', 'c) Selling investments at a loss', 'd) Investing only in high-risk assets'],
    ['a) A type of fee charged by investment brokers', 'b) A portion of a company\'s earnings distributed to shareholders', 'c) An upfront payment for an investment', 'd) A type of bond issued by companies'],
    ['a) The process of reinvesting dividends', 'b) The process of earning interest on interest', 'c) The process of doubling your investment in a short period', 'd) The process of buying and selling stocks'],
    ['a) An investment that tracks the performance of a specific market index', 'b) An investment that guarantees a fixed return', 'c) A type of investment offered by banks', 'd) An investment that carries no risk'],
    ['a) Potential returns', 'b) Associated risks', 'c) Investment fees', 'd) All of the above'],
    ['a) Buy and hold', 'b) Value investing', 'c) Growth investing', 'd) All of the above']
  ];

  const correctChoices = ['c) Achieving long-term financial goals', 'b) Spreading investments across various asset classes', 'a) Stocks represent ownership in a company, while bonds represent loans to a company or government.', 'c) Higher returns are typically associated with higher risk.', 'a) Return on Investment', 'c) It refers to the duration for which an investor plans to hold an investment.', 'b) An investment that tracks an index', 'c) Investments that pool money from multiple investors to purchase securities', 'b) Investing a fixed amount of money at regular intervals', 'a) Spreading investments across different asset classes', 'b) A portion of a company\'s earnings distributed to shareholders', 'b) The process of earning interest on interest', 'a) An investment that tracks the performance of a specific market index', 'd) All of the above'];

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
                    name={`question${index}`}
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

export default QuestionsForm;
