import { motion } from "framer-motion";
import avatars from "../../../../assets/knowledge-img/avatars.webp";

const Card3 = () => {
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
    >
      <motion.div
        className="rounded-xl p-[14px] flex items-center overflow-hidden absolute translate-x-1/2"
        style={{
          background: "#161014",
          border: "1px solid",
          borderImageSource:
            "linear-gradient(270deg, rgba(255, 33, 178, 0) 0%, #FF21B2 50%, rgba(255, 33, 178, 0) 100%)",
          borderImageSlice: 1,
          left: "50px",
        }}
        variants={{
          initial: { x: 0 },
          hover: { x: -650 },
        }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <motion.img
          src={avatars}
          alt=""
          style={{
            minWidth: "1105px",
            maxWidth: "1105px",
          }}
          // variants={{
          //   initial: { x: 0 },
          //   hover: { x: -650 },
          // }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        />
      </motion.div>
    </motion.div>
  );
};

export default Card3;
