import { motion } from "framer-motion";
import { useState } from "react";

const SlideUpPanel = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className="fixed bottom-0 left-0 w-full bg-white shadow-lg rounded-t-2xl p-4 z-20"
      initial={{ y: "100%" }}
      animate={{ y: isExpanded ? "0%" : "70%" }}
      transition={{ type: "spring", stiffness: 120 }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 300 }}
      onDragEnd={(event, info) => {
        if (info.point.y > 600) setIsExpanded(false);
        else setIsExpanded(true);
      }}
    >
      <div
        className="w-12 h-1.5 bg-gray-400 rounded-full mx-auto mb-2 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      />
      <h2 className="text-lg font-semibold text-center">Slide Up Panel</h2>
      <p className="text-gray-600 text-center">Drag up or down</p>
    </motion.div>
  );
};

export default SlideUpPanel;
