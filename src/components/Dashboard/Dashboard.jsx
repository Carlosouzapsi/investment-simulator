import React from "react";
import styles from "./Dashboard.module.css";
// import styles from "Dashboard.module.css";
function Dashboard({ userPortfolio, currentUser, gameDate }) {
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
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Ativo</th>
              <th>Quantidade</th>
              <th>Preço Médio</th>
              <th>Valor Total</th>
            </tr>
          </thead>
          <tbody>
            {holdingsArray.map((holding, index) => (
              <tr key={index}>
                <td className={styles.tickerCell}>{holding.ticker}</td>
                <td>{holding.quantity}</td>
                <td>R$ {(holding.totalCost / holding.quantity).toFixed(2)}</td>
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
      <div className={styles.header}>
        <h1>Painel do Membro</h1>
        <p>
          Bem-vindo de volta, {currentUser ? currentUser.name : "Investidor"}.
        </p>
      </div>
      <div className={styles.dashboardGrid}>
        <div className={styles.dashboardCard}>
          <h3>Data do Jogo</h3>
          <p className={styles.date}>
            {gameDate
              ? `Semana ${gameDate.week}, Dia ${gameDate.day}`
              : "Carregando..."}
          </p>
        </div>
        <div className={styles.dashboardCard}>
          <h3>Capital Disponível</h3>
          <p className={styles.balance}>
            R$ {userPortfolio.balance.toFixed(2)}
          </p>
        </div>
        <div className={styles.dashboardCard}>
          <h3>Dívida Total</h3>
          {/* <p className={styles.debt}>R$ {userPortfolio.debt.toFixed(2)}</p> */}
        </div>
        <div className={styles.dashboardCard}>
          <h3>Resultado da Carteira</h3>
          <p className={returnColorClass}>
            {returnSign} R$ {totalReturn.toFixed(2)} (
            {returnPercentage.toFixed(2)}%)
          </p>
        </div>
        <div className={styles.dashboardCard}>
          <h3>Posições Abertas</h3>
          <p>{Object.keys(userPortfolio.holdings).length}</p>
        </div>
        <div className={styles.tableContainer}>
          <h3>Relatório de Ativos</h3>
          {renderHoldingsSummary()}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
