import React from "react";
import styles from "./Dashboard.module.css";
// import styles from "Dashboard.module.css";
function Dashboard({ userPortfolio }) {
  const currentPortfolioValue = Object.values(userPortfolio.holdings).reduce(
    (acc, holding) => acc + holding.price * holding.quantity,
    0
  );
  const totalInvested = userPortfolio.transactionHistory
    .filter((tx) => tx.type === "Compra")
    .reduce((acc, tx) => acc + tx.cost, 0);
  const totalRescued = userPortfolio.transactionHistory
    .filter((tx) => tx.type === "Venda")
    .reduce((acc, tx) => acc + Math.abs(tx.cost), 0);
  const costBase = totalInvested - totalRescued;
  const totalReturn = currentPortfolioValue - costBase;
  const returnPercentage = costBase > 0 ? (totalReturn / costBase) * 100 : 0;
  const returnColorClass =
    totalReturn >= 0 ? styles.textSuccess : styles.textDanger;
  const returnSign = totalReturn >= 0 ? "+" : "";

  const renderHoldingsSummary = () => {
    const holdingsArray = Object.values(userPortfolio.holdings);
    if (holdingsArray.length === 0) {
      return (
        <p className={`${styles.textCenter} ${styles.textMuted}`}>
          Ainda não tem ativos na sua carteira.
        </p>
      );
    }
    return (
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Ativo</th>
              <th>Quantidade</th>
              <th>Valor Total</th>
            </tr>
          </thead>
          <tbody>
            {holdingsArray.map((holding, index) => (
              <tr key={index}>
                <td className="font-medium">{holding.ticker}</td>
                <td>{holding.quantity}</td>
                <td>R$ {(holding.price * holding.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h2>O seu Dashboard</h2>
      <div className={styles.dashboardGrid}>
        <div className={styles.dashboardCard}>
          <h3>Saldo Atual</h3>
          <p className={styles.textPrimary}>
            R$ {userPortfolio.balance.toFixed(2)}
          </p>
        </div>
        <div className={styles.dashboardCard}>
          <h3>Retorno Total da Carteira</h3>
          <p className={returnColorClass}>
            {returnSign} R$ {totalReturn.toFixed(2)} (
            {returnPercentage.toFixed(2)}%)
          </p>
        </div>
        <div className={styles.dashboardCard}>
          <h3>Ativos na Carteira</h3>
          <p>{Object.keys(userPortfolio.holdings).length}</p>
        </div>
        <div className={styles.tableContainer}>
          <h3>Resumo da Carteira</h3>
          {renderHoldingsSummary()}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
