import React from "react";
import styles from "./ArrowIcon.module.css";
function ArrowIcon({ direction }) {
  const color = direction === "up" ? "#10b981" : "#ef4444";
  const points = direction === "up" ? "5, 0 10, 10, 10" : "5, 10, 0, 0, 10,0";

  return (
    <svg
      className={styles.arrow}
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill={color}
      xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
    >
      <polygon points={points} />
    </svg>
  );
}

export default ArrowIcon;
