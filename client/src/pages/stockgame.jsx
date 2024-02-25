import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import StockModal from "../components/stockModal";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Button, Modal } from "@mui/material";
import Api from "../api";

function StockGame() {
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const [symbol, setSymbol] = useState("");
  const [data, setData] = useState([]);
  const [prediction, setPrediction] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(true);
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const handleClose = () => {
    setModal(false);
  };

  const fetchData = (symbol) => {
    setSymbol(symbol);
    axios
      .get(`http://localhost:5000/get_historical_data?symbol=${symbol}`)
      .then((response) => {
        console.log("Response:", response);
        const rawData = response.data;
        console.log("Raw data:", rawData);

        if (Array.isArray(rawData)) {
          const formattedData = rawData.map((entry) => ({
            date: new Date(entry.Date),
            open: entry.Open,
            high: entry.High,
            low: entry.Low,
            close: entry.Close,
          }));
          setData(formattedData);
          setLoading(false);
        } else {
          toast.error("Invalid data format");
          console.error("Invalid data format:", rawData);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    const incrfun = async () => {
      await Api.incrcoins({ email: userInfo.email, coins: 10 })
        .then((response) => {
          console.log("10 🪙s incremented:", response);
          toast.success("10 🪙s incremented:");
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error incrementing coins:", error);
        });
    };

    const decrfun = async () => {
      await Api.decrcoins({ email: userInfo.email, coins: 5 })
        .then((response) => {
          console.log("5 🪙s decremented", response);
          toast.error("5 🪙s decremented");
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error decrementing coins:", error);
        });
    };

    if (!userInfo) {
      setModal(true);
    }
    if (evaluation === true) {
      incrfun();
    }
    if (evaluation === false) {
      decrfun();
    }
  }, [evaluation]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const predictionCorrect = evaluatePrediction();
    setEvaluation(predictionCorrect ? true : false);
  };

  const evaluatePrediction = () => {
    const timestamp75PercentIndex = Math.floor(data.length * 0.75);
    const priceAt75Percent = data[timestamp75PercentIndex].close;

    const priceAtEnd = data[data.length - 1].close;
    const isPriceHigher = priceAtEnd > priceAt75Percent;

    if (
      (prediction === "up" && isPriceHigher) ||
      (prediction === "down" && !isPriceHigher)
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <motion.div
      initial={{
        left: -1000,
        opacity: 0,
      }}
      animate={{
        left: 0,
        opacity: 1,
      }}
      exit={{
        left: -1000,
        opacity: 0,
      }}
      transition={{ duration: 0.3 }}
      className="App bg-gray-100 min-h-screen p-8 flex flex-col justify-center items-center w-100 min-h-screen"
    >
      <Modal open={modal} onClose={() => setModal(false)}>
        <StockModal
          open={modal}
          userInfo={userInfo}
          handleClose={handleClose}
        />
      </Modal>

      <h1 className="text-2xl font-bold mb-8">Stock Market Prediction Game</h1>
      <div className="mb-4 h-10">
        <Menu as="div" className="relative ml-3 h-full">
          <div>
            <Menu.Button className="relative flex rounded-full bg-gray-800">
              <Button
                color="secondary"
                className="shadow-md hover:shadow-2xl font-bold text-lg"
                variant="outlined"
              >
                Click to choose stock
              </Button>
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={(e) => fetchData("TSLA")}
                    className={classNames(
                      active ? "bg-gray bg-opacity-40" : "",
                      "block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:font-bold"
                    )}
                  >
                    TESLA
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={(e) => fetchData("MANU")}
                    className={classNames(
                      active ? "bg-gray bg-opacity-40" : "",
                      "block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:font-bold"
                    )}
                  >
                    MANCHESTER UNITED
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={(e) => fetchData("PINE")}
                    className={classNames(
                      active ? "bg-gray bg-opacity-40" : "",
                      "block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:font-bold"
                    )}
                  >
                    ALPINE INCOME PROPERTY TRUST
                  </button>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={(e) => fetchData("CORR")}
                    className={classNames(
                      active ? "bg-gray bg-opacity-40" : "",
                      "block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:font-bold"
                    )}
                  >
                    CORENERGY INFRASTRUCTURE TRUST
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
      {symbol && loading ? (
        <p className="text-xl font-bold mb-4 animate-bounce">Loading...</p>
      ) : loading && !symbol ? (
        <p className="text-xl font-bold mb-4">Please select a stock</p>
      ) : (
        <p className="text-xl font-bold mb-4">Selected stock: {symbol}</p>
      )}
      {data.length > 0 && !evaluation && (
        <div className="p-4 md-10 ring offset-4 rounded rounded-xl ring-2 bg-white backdrop-blur-2xl shadow-lg hover:shadow-2xl ring-gray">
          <h2 className="text-2xl font-bold mb-4">Historical Data</h2>
          <LineChart
            width={600}
            height={400}
            data={data.slice(0, Math.floor(data.length * 0.75))}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="open" stroke="#8884d8" />
            <Line type="monotone" dataKey="high" stroke="#82ca9d" />
            <Line type="monotone" dataKey="low" stroke="#ffc658" />
            <Line type="monotone" dataKey="close" stroke="#ff7300" />
            <ReferenceLine
              y={data[Math.floor(data.length * 0.75)].close}
              stroke="red"
            />
          </LineChart>
          <form onSubmit={handleSubmit} className="m-6">
            <label className="mr-2">
              Predict:
              <select
                value={prediction}
                onChange={(e) => setPrediction(e.target.value)}
                className="ml-2 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
              >
                <option value="up">Up</option>
                <option value="down">Down</option>
              </select>
            </label>
            <Button
              type="submit"
              color="secondary"
              className="shadow-md hover:shadow-2xl font-bold text-lg"
            >
              Submit Prediction
            </Button>
          </form>
        </div>
      )}
      {evaluation && (
        <div className="p-4 m-6 ring offset-4 rounded rounded-xl ring-2 bg-white backdrop-blur-2xl shadow-lg hover:shadow-2xl ring-gray">
          <p className="text-xl font-bold mb-4">Evaluation: {evaluation}</p>
          <p className="text-xl font-bold mb-2">Here's the full graph:</p>
          <LineChart width={600} height={400} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="open" stroke="#8884d8" />
            <Line type="monotone" dataKey="high" stroke="#82ca9d" />
            <Line type="monotone" dataKey="low" stroke="#ffc658" />
            <Line type="monotone" dataKey="close" stroke="#ff7300" />
            <ReferenceLine
              y={data[Math.floor(data.length * 0.75)].close}
              stroke="red"
            />
            <ReferenceLine y={data[data.length - 1].close} stroke="green" />
          </LineChart>
        </div>
      )}
    </motion.div>
  );
}

export default StockGame;
