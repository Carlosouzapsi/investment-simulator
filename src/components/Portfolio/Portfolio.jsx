import React from "react";
import styles from "./Portfolio.module.css";

function Portfolio({ userPortfolio, onBuy, onSell, onBack }) {
  const holdingsArray = Object.values(userPortfolio.holdings);

  return (
    <div className={styles.container}>
      <h2>Minha Carteira</h2>
      {holdingsArray.length === 0 ? (
        <p className={`${styles.textCenter} ${styles.textMuted}`}>
          Ainda não possui ativos na sua carteira.
        </p>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Ticker</th>
                <th>Nome</th>
                <th>Preço Médio (R$)</th>
                <th>L/P (R$)</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {holdingsArray.map((holding) => {
                const totalValue = holding.price * holding.quantity;
                const profitLoss = totalValue - holding.totalCost;
                const profitLossClass =
                  profitLoss >= 0 ? styles.tesxtSuccess : styles.textDanger;
                return (
                  <tr key={holding.ticker}>
                    <td className="font-medium">{holding.ticker}</td>
                    <td>{holding.name}</td>
                    <td>{holding.quantity}</td>
                    <td>{(holding.totalCost / holding.quantity).toFixed(2)}</td>
                    <td>{totalValue.toFixed(2)}</td>
                    <td className={`${profitLossClass} font-bold`}>
                      {profitLoss.toFixed(2)}
                      <div className={styles.actiosCell}>
                        <button
                          onClick={() => onBuy(holding)}
                          className="btn btn-primary"
                          style={{
                            padding: "0.25rem 0.5rem",
                            fontSize: "0.75rem",
                          }}>
                          Comprar
                        </button>
                        <button
                          onClick={() => onSell(holding)}
                          className="btn btn-danger"
                          style={{
                            padding: "0.25rem 0.5rem",
                            fontSize: "0.75rem",
                          }}>
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
      <button
        onClick={onBack}
        className={`btn btn-secondary ${styles.backButton}`}>
        Voltar para o Dashboard
      </button>
    </div>
  );
}

export default Portfolio;
