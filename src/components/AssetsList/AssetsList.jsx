import React, { useEffect, useState } from "react";
import ArrowIcon from "../ArrowIcon/ArrowIcon";
import styles from "./AssetsList.module.css";

const mockAssets = [
  {
    id: 1,
    ticker: "PETR4",
    name: "Petrobras",
    type: "Ação",
    price: 35.5,
    description:
      "Petrobras é uma empresa de energia de capital aberto e misto...",
  },
  {
    id: 2,
    ticker: "VALE3",
    name: "Vale",
    type: "Ação",
    price: 68.2,
    description: "A Vale é uma mineradora multinacional brasileira...",
  },
  {
    id: 3,
    ticker: "BBAS3",
    name: "Banco do Brasil",
    type: "Ação",
    price: 54.1,
    description: "O Banco do Brasil é uma instituição financeira brasileira...",
  },
  {
    id: 4,
    ticker: "MXRF11",
    name: "Maxi Renda",
    type: "FII",
    price: 10.5,
    description: "O Fundo de Investimento Imobiliário Maxi Renda...",
  },
  {
    id: 5,
    ticker: "KNRI11",
    name: "Kinea",
    type: "FII",
    price: 165.75,
    description: "O Fundo Imobiliário Kinea é um dos maiores fundos...",
  },
];

function AssetsList({ onSelectAsset, onSelectAssetForDetails }) {
  const [assets, setAssets] = useState(() =>
    mockAssets.map((a) => ({
      ...a,
      previousPrice: a.price,
      openingPrice: a.price,
      priceHistory: [a.price],
    }))
  );
  const [filter, setFilter] = useState("Todos");

  useEffect(() => {
    const interval = setInterval(() => {
      setAssets((prevAssets) =>
        prevAssets.map((asset) => {
          const previousPrice = asset.price;
          const change = (Math.random() - 0.5) * 0.02 * asset.price;
          const newPrice = Math.max(0, previousPrice + change);
          const newHistory = [...asset.priceHistory.slice(-9), newPrice];
          return {
            ...asset,
            price: newPrice,
            previousPrice,
            priceHistory: newHistory,
          };
        })
      );
    }, 5000); // update after 5 seconds

    return () => clearInterval(interval);
  }, []);

  const filteredAssets = assets.filter((asset) => {
    if (filter === "Todos") return true;
    if (filter === "Ações") return asset.type === "Ação";
    if (filter === "FIIs") return asset.type === "FII";
    return true;
  });

  return (
    <div className={styles.container}>
      <h2>Ativos Disponíveis</h2>
      <div className={styles.filterGroup}>
        <button
          onClick={() => setFilter("Todos")}
          className={`btn btn-filter ${filter === "Todos" ? "active" : ""}`}>
          Todos
        </button>
        <button
          onClick={() => setFilter("Ações")}
          className={`btn btn-filter ${filter === "Ações" ? "active" : ""}`}>
          Ações
        </button>
        <button
          onClick={() => setFilter("FIIs")}
          className={`btn btn-filter ${filter === "FIIs" ? "active" : ""}`}>
          Fundos Imobiliários
        </button>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Ticker</th>
              <th>Nome</th>
              <th>Tipo</th>
              <th>Preço (R$)</th>
              <th>Abertura (R$)</th>
              <th className={styles.actionsHeader}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.map((asset) => {
              let priceClass = "";
              let arrowDirection = null;
              if (asset.price > asset.previousPrice) {
                priceClass = styles.textSuccess;
                arrowDirection = "up";
              } else if (asset.price < asset.previousPrice) {
                priceClass = styles.textDanger;
                arrowDirection = "down";
              }

              return (
                <tr key={asset.id}>
                  <td className={styles.tickerCell}>{asset.ticker}</td>
                  <td>{asset.name}</td>
                  <td>{asset.type}</td>
                  <td className={`${priceClass} ${styles.priceCell}`}>
                    {asset.price.toFixed(2)}
                    {arrowDirection && <ArrowIcon direction={arrowDirection} />}
                  </td>
                  <td>{asset.openingPrice.toFixed(2)}</td>
                  <td>
                    <div className={styles.actionsCell}>
                      <button
                        onClick={() => onSelectAssetForDetails(asset)}
                        className="btn btn-secondary"
                        style={{
                          padding: "0.25rem 0.5rem",
                          fontSize: "0.75rem",
                        }}>
                        Detalhes
                      </button>
                      <button
                        onClick={() => onSelectAsset(asset)}
                        className="btn btn-primary"
                        style={{
                          padding: "0.25rem 0.5rem",
                          fontSize: "0.75rem",
                        }}>
                        Comprar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AssetsList;
