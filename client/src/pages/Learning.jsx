import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Lesson from "../components/lesson";
import Lesson1 from "../components/lesson1";
import Lesson2 from "../components/lesson2";
import QuestionsForm1 from "../components/QandA/Finance";
import QuestionsForm from "../components/QandA/Invest";
import QuestionsForm2 from "../components/QandA/Budgeting.jsx";
import BudgetingImage from "../assets/budget.jpg";
import fin from "../assets/fin.jpg";
import invest from "../assets/invest.jpg";
import { Home, QuestionAnswerRounded } from "@mui/icons-material";

export function Learning() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-3 gap-10 m-8">
        <Card
          to="/budgeting"
          title="Budgeting"
          description="Learn budget planning, expense tracking, and saving strategies."
          image={BudgetingImage}
        />
        <Card
          to="/investing"
          title="Investing"
          description="Explore investment basics, risk management, and long-term planning."
          image={invest}
        />
        <Card
          to="/financing"
          title="Financing"
          description="Understand loans, credit management, and financial planning tools."
          image={fin}
        />
      </div>
    </div>
  );
}

export function Card({ to, title, description, image }) {
  return (
    <Link
      to={to}
      className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between transition duration-300 hover:shadow-2xl hover:scale-105"
    >
      <div>
        <img
          src={image}
          alt={title}
          className="mb-4"
          style={{ maxHeight: "200px", width: "100%", objectFit: "cover" }}
        />
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{description}</p>
        <p className="text-gray-600 mb-4 font-bold">Click to explore {title}</p>
      </div>
      <Link
        to={`${to}/qanda`}
        className="text-blue transition duration-300 hover:underline"
      >
        <QuestionAnswerRounded />
        {"   "}Q and A
      </Link>
    </Link>
  );
}

export function Budgeting() {
  return (
    <div className="container mx-auto px-4 py-8 w-full flex flex-col items-center justify-evenly m-10 backdrop-blur">
      <Lesson />
      <Link
        to="/budgeting/qanda"
        className="block mt-4 text-blue-600 hover:underline text-blue"
      >
        {" "}
        <QuestionAnswerRounded /> Q and A
      </Link>
      <Link to="/learning" className="block mt-4 text-blue hover:underline">
        <button>
          {" "}
          <Home /> Go to Home
        </button>
      </Link>
    </div>
  );
}

export function BudgetingQAndA() {
  return (
    <div className="container mx-auto px-4 py-8">
      <QuestionsForm2 />
      <Link to="/learning" className="block mt-4 text-blue-600 hover:underline">
        {" "}
        <Home /> Go to Home
      </Link>
    </div>
  );
}

export function Investing() {
  return (
    <div className="container mx-auto px-4 py-8 w-full flex flex-col items-center justify-evenly m-10 backdrop-blur">
      <Lesson1 />
      <Link
        to="/investing/qanda"
        className="block mt-4 text-blue-600 hover:underline"
      >
        <QuestionAnswerRounded />
        {"   "}Q and A
      </Link>
      <Link to="/learning" className="block mt-4 text-blue-600 hover:underline">
        {" "}
        <Home /> Go to Home
      </Link>
    </div>
  );
}

export function InvestingQAndA() {
  return (
    <div className="container mx-auto px-4 py-8">
      <QuestionsForm />
      <Link to="/learning" className="block mt-4 text-blue-600 hover:underline">
        {" "}
        <Home /> Go to Home
      </Link>
    </div>
  );
}

export function Financing() {
  return (
    <div className="container mx-auto px-4 py-8 w-full flex flex-col items-center justify-evenly m-10 backdrop-blur">
      <Lesson2 />
      <Link
        to="/financing/qanda"
        className="block mt-4 text-blue-600 hover:underline"
      >
        <QuestionAnswerRounded />
        {"   "}Q and A
      </Link>
      <Link to="/learning" className="block mt-4 text-blue-600 hover:underline">
        {" "}
        <Home /> Go to Home
      </Link>
    </div>
  );
}

export function FinancingQAndA() {
  return (
    <div className="container mx-auto px-4 py-8 w-full flex flex-col items-center justify-evenly m-10 backdrop-blur">
      <QuestionsForm1 />
      <Link to="/learning" className="block mt-4 text-blue-600 hover:underline">
        {" "}
        <Home /> Go to Home
      </Link>
    </div>
  );
}

export default Learning;
