import React from "react";
import styles from "../AssetChart/AssertChart.module.css";
function AssertChart({ data }) {
  if (!data || data.length < 2) {
    return (
      <div className={styles.chartContainer}>
        Dados insuficientes para exibir o gráfico.
      </div>
    );
  }
  const width = 500;
  const height = 150;
  const padding = 20;

  const maxVal = Math.max(...data);
  const minVal = Math.min(...data);
  const range = maxVal - minVal === 0 ? 1 : maxVal - minVal;

  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * (width - 2 * padding) + padding;
      const y =
        height - (((d - minVal) / range) * (height - 2 * padding) + padding);
      return `${x},${y}`;
    })
    .join(" ");

  const lineColor = data[data.length - 1] >= data[0] ? "#10b981" : "#ef4444";

  return (
    <div className={styles.chartContainer}>
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        <polyline
          fill="none"
          stroke={lineColor}
          strokeWidth="3"
          points={points}
        />
      </svg>
    </div>
  );
}

export default AssertChart;
