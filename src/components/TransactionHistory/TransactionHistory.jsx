import React from "react";
import styles from "./TransactionHistory.module.css";

function TransactionHistory({ transactionHistory }) {
  const sortedHistory = [...transactionHistory].reverse();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Livro de Registros</h1>
        <p>O histórico de todas as suas operações no mercado.</p>
      </div>
      {sortedHistory.length === 0 ? (
        <p className={styles.textMuted}>Nenhuma transação registrada.</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Data</th>
                <th>Operação</th>
                <th>Ativo</th>
                <th>Quantidade</th>
                <th>Preço Unitário</th>
                <th>Valor Total</th>
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
                  <td>R$ {tx.price.toFixed(2)}</td>
                  <td>R$ {tx.cost.toFixed(2)}</td>
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
