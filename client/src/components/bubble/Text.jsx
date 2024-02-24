import React from "react";
import styles from "./bubble.module.css";

const Text = () => {
  return (
    // <div className="grid h-screen place-content-center bg-black">
      <BubbleText />
    // </div>
  );
};

const BubbleText = () => {
  return (
    <h2 className="text-center text-5xl font-thin text-indigo-300">
      {"Bubbbbbbbble text".split("").map((child, idx) => (
        <span className={styles.hoverText} key={idx}>
          {child}
        </span>
      ))}
    </h2>
  );
};

export default Text;