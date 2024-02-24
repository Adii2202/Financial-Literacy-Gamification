import React, { useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

function Center({ children }) {
  const ref = useRef(null);
  const isInView = useInView(ref);
  const mainControls = useAnimation();
  const slideControls = useAnimation();

  useEffect(() => {
    console.log("isInView", isInView);
    if (isInView) {
      mainControls.start("visible");
      slideControls.start("visible");
    }
    else {
      mainControls.start("hidden");
      slideControls.start("hidden");
    }
  }, [isInView, mainControls, slideControls]);

  return (
    <div
      ref={ref}
      style={{
        // position: "relative",
        // width: "fit-content",
        // overflow: "hidden",
      }}
    >
      <motion.div
        variants={{
          hidden: {
            opacity: 0,
            // x: -200,
            // y: 200,
          },
          visible: {
            opacity: 1,
            // x: 0,
            // y: 0,
          },
        }}
        transition={{
          duration: 0.5,
          delay: 0.25,
          ease: 'easeIn',
        }}
        initial="hidden"
        animate={mainControls}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default Center;
