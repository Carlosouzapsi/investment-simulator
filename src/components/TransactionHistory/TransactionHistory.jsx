import React from "react";
import styles from "./TransactionHistory.module.css";

function TransactionHistory({ transactionHistory }) {
  const sortedHistory = [...transactionHistory].reverse();

  return (
    <div className={styles.container}>
      <h2>Histórico de Transações</h2>
      {sortedHistory.length === 0 ? (
        <p className={`${styles.textCenter} ${styles.textMuted}`}>
          Nenhuma transação registada ainda.
        </p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Data</th>
                <th>Tipo</th>
                <th>Ativo</th>
                <th>Quantidade</th>
                <th>Preço (R$)</th>
                <th>Custo total (R$)</th>
              </tr>
            </thead>
            <tbody>
              {sortedHistory.map((tx, index) => (
                <tr key={index}>
                  <td>{new Date(tx.date).toLocaleString("pt-BR")}</td>
                  <td
                    className={
                      tx.type === "Compra"
                        ? styles.textSuccess
                        : styles.textDanger
                    }>
                    {tx.type}
                  </td>
                  <td className={styles.tickerCell}>{tx.asset}</td>
                  <td>{tx.quantity}</td>
                  <td>{tx.price.toFixed(2)}</td>
                  <td>{tx.cost.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TransactionHistory;
