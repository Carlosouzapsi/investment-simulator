import React from "react";
import styles from "./Portfolio.module.css";

function Portfolio({ userPortfolio, onBuy, onSell }) {
  const holdingsArray = Object.values(userPortfolio.holdings);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Portfólio do Membro</h1>
        <p>Sua posição atual no mercado.</p>
      </div>
      {holdingsArray.length === 0 ? (
        <p className={styles.textMuted}>
          Seu portfólio está vazio. Visite o mercado para começar a investir.
        </p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Ativo</th>
                <th>Nome</th>
                <th>Quantidade</th>
                <th>Preço Médio</th>
                <th>Valor Atual</th>
                <th>Resultado (L/P)</th>
                <th className={styles.actionsHeader}>Operar</th>
              </tr>
            </thead>
            <tbody>
              {holdingsArray.map((holding) => {
                const totalValue = holding.price * holding.quantity;
                const profitLoss = totalValue - holding.totalCost;
                const profitLossClass =
                  profitLoss >= 0 ? styles.textSuccess : styles.textDanger;
                return (
                  <tr key={holding.ticker}>
                    <td className={styles.tickerCell}>{holding.ticker}</td>
                    <td>{holding.name}</td>
                    <td>{holding.quantity}</td>
                    <td>R$ {(holding.totalCost / holding.quantity).toFixed(2)}</td>
                    <td>R$ {totalValue.toFixed(2)}</td>
                    <td className={`${profitLossClass} ${styles.priceCell}`}>
                      {profitLoss.toFixed(2)}
                    </td>
                    <td>
                      <div className={styles.actionsCell}>
                        <button
                          onClick={() => onBuy(holding)}
                          className={styles.buyButton}>
                          Comprar
                        </button>
                        <button
                          onClick={() => onSell(holding)}
                          className={styles.sellButton}>
                          Vender
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Portfolio;
