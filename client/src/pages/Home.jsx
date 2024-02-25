import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiBatteryCharging, FiWifi } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Text from "../components/bubble/Text";
import Center from "../animated-components/Center";
import Left from "../animated-components/Left";
import Right from "../animated-components/Right";
import logo from "../assets/logo-hck.svg";
import WaterGrid from "../components/watergrid/WaterGrid";
import { CircularProgress } from "@mui/material";
import Footer from "../components/Footer";
import Api from "../api";

const Home = () => {
  const [user, setUser] = useState();
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchUser = async () => {
      await Api.getUser({ email: userInfo.email })
        .then((res) => {
          console.log("User:", res.data);
          localStorage.setItem("level", res.data.user.gaming.level);
          setUser(res.data.user);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
        });
    };
    fetchUser();
  }, []);

  return (
    <>
      (
      <section className="w-full h-full mx-auto max-w-7xl px-4  text-char flex items-start justify-between gap-4">
        <div className="mt-16 flex flex-col items-start justify-between gap-8 md:px-8">
          <div>
            <Left>
              <h2 className="max-w-lg text-4xl font-bold md:text-5xl text-black">
                Grow faster with our
                <span className="text-[#662d91]"> all in one solution</span>
              </h2>
            </Left>
            {/* <div>
                        <Text />
                    </div> */}
          </div>
          <div className="relative">
            <Center>
              <div className="w-full flex items-center gap-4 font-bold text-7xl">
                <img src={logo} alt="" className="w-24 h-24" />
                <span className="tracking-wide text-black">INNOSAVE</span>
              </div>
              {/* <h2 className="max-w-lg text-4xl font-bold md:text-5xl">
                            Grow faster with our
                            <span className="text-l-slate"> all in one solution</span>
                        </h2> */}
            </Center>
            {/* <div>
                        <Text />
                    </div> */}
          </div>
          <div className="">
            <Right>
              {/* <h2 className="max-w-lg text-4xl font-bold md:text-4xl">
                            Don't Just Manage Your Social
                            <span className="text-l-slate"> Master It</span>
                        </h2> */}
              {/* <WaterGrid /> */}
              <div className="text-lg font-semibold text-[#662d91]">
                Don't Just Manage Your Finances,{" "}
                <span className=" text-black">Master Them.</span>
              </div>
            </Right>
            {/* <div>
                        <Text />
                    </div> */}
          </div>
        </div>
        <section className="grid place-content-center bg-neutral-900 p-12">
          <Center>
            <FloatingPhone />
          </Center>
        </section>
      </section>
      ){/* <Footer /> */}
    </>
  );
};

const FloatingPhone = () => {
  return (
    <div
      style={{
        transformStyle: "preserve-3d",
        transform: "rotateY(-30deg) rotateX(15deg)",
      }}
      className="rounded-[24px] bg-[#33006F]"
    >
      <motion.div
        initial={{
          transform: "translateZ(8px) translateY(-2px)",
        }}
        animate={{
          transform: "translateZ(32px) translateY(-8px)",
        }}
        transition={{
          repeat: Infinity,
          repeatType: "mirror",
          duration: 2,
          ease: "easeInOut",
        }}
        className="relative h-96 w-56 rounded-[24px] border-2 border-b-4 border-r-4 border-white border-l-[#E5E7EB] border-t-[#E5E7EB] bg-[#33006F] p-1 pl-[3px] pt-[3px]"
      >
        <HeaderBar />
        <Screen />
      </motion.div>
    </div>
  );
};

const HeaderBar = () => {
  return (
    <>
      <div className="absolute left-[50%] top-2.5 z-10 h-2 w-16 -translate-x-[50%] rounded-md bg-neutral-900"></div>
      <div className="absolute right-3 top-2 z-10 flex gap-2">
        <FiWifi className="text-neutral-600" />
        <FiBatteryCharging className="text-neutral-600" />
      </div>
    </>
  );
};

const Screen = () => {
  const navigate = useNavigate();

  return (
    <div className="relative z-0 grid h-full w-full place-content-center overflow-hidden rounded-[20px] bg-white">
      {/* Example logo from logoispum */}
      <svg
        width="50"
        height="39"
        viewBox="0 0 50 39"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="fill-[#33006F]"
      >
        <path
          d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z"
          stopColor="#000000"
        ></path>
        <path
          d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z"
          stopColor="#000000"
        ></path>
      </svg>

      <button
        onClick={() => {
          // navigate("/uploads")
          window.location.href = "/tasks";
        }}
        className="absolute bottom-4 left-4 right-4 z-10 rounded-lg border-[1px] bg-white py-2 text-sm font-medium text-[#33006F] backdrop-blur"
      >
        Get Started
      </button>

      {/* <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-char" /> */}
      <div className="absolute -bottom-72 left-[50%] h-96 w-96 -translate-x-[50%] rounded-full bg-[#33006F]" />
    </div>
  );
};

const BounceCard = ({ className, children }) => {
  return (
    <motion.div
      whileHover={{ scale: 0.95, rotate: "-1deg" }}
      className={`group relative min-h-[300px] cursor-pointer overflow-hidden rounded-2xl bg-slate-100 p-8 ${className}`}
    >
      {children}
    </motion.div>
  );
};

const CardTitle = ({ children }) => {
  return (
    <h3 className="mx-auto text-center text-3xl font-semibold">{children}</h3>
  );
};

export default Home;
