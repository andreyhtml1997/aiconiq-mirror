'use client'
import { useState } from "react";
import { motion } from "framer-motion";

const card4First = '/assets/knowledge-img/charts/card-4-first.webp'
const reviewGraph = '/assets/knowledge-img/review-graph.webp'
const card4Second = '/assets/knowledge-img/charts/card-4-second.webp'

const Card4 = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative overflow-hidden flex items-center"
      style={{
        width: "547px",
        height: "391px",
        backgroundColor: "#271B22",
      }}
      initial="initial"
      whileHover="hover"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={card4First}
        alt=""
        style={{
          opacity: isHovered ? 0 : 1,
          transition: "opacity 0.4s ease-in-out",
        }}
      />
      <img
        src={card4Second}
        alt=""
        className="absolute inset-0"
        style={{
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.4s ease-in-out",
        }}
      />
      <div className="absolute bottom-0 right-0 max-w-[305px]">
        <motion.img
          src={reviewGraph}
          alt=""
          className="w-full"
          style={{
            filter: "blur(4px)",
          }}
          variants={{
            initial: { y: 300 },
            hover: { y: 0 },
          }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </motion.div>
  );
};

export default Card4;
