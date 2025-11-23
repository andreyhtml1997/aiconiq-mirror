import topimg from "../../../../assets/knowledge-img/charts/top.svg";
import middleimg from "../../../../assets/knowledge-img/charts/middle.svg";
import bottomimg from "../../../../assets/knowledge-img/charts/bottom.svg";

export const Card1 = () => {
  return (
    <div
      className="relative overflow-hidden group"
      style={{
        width: "547px",
        height: "391px",
        backgroundColor: "#271B22",
      }}
    >
      <div
        className="flex flex-col gap-[18px] absolute"
        style={{ top: "-93.5px" }}
      >
        {/* Block 1 - 50% off from top - faster but smooth movement */}
        <div
          className="flex items-center justify-center group-hover:-translate-x-80"
          style={{
            width: "923px",
            height: "187px",
            transition: "transform 700ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <img src={topimg} alt="" />
        </div>

        {/* Block 2 - middle - slower movement to the left */}
        <div
          className="flex items-center justify-center group-hover:-translate-x-40"
          style={{
            width: "923px",
            height: "187px",
            transition: "transform 900ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <img src={middleimg} alt="" />
        </div>

        {/* Block 3 - bottom - faster but smooth movement */}
        <div
          className="flex items-center justify-center group-hover:-translate-x-80"
          style={{
            width: "923px",
            height: "187px",
            transition: "transform 700ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <img src={bottomimg} alt="" />
        </div>
      </div>
    </div>
  );
};
