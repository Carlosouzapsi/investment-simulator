import React from "react";
import styles from "./AssetDetails.module.css";
import AssetChart from "../AssetChart/AssertChart";

function AssetDetails({ asset, onBack }) {
  if (!asset) {
    return <div className={styles.container}>Nenhum ativo selecionado</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Ficha Técnica do Ativo</h1>
        <p>
          {asset.name} ({asset.ticker})
        </p>
      </div>
      <div className={styles.contentGrid}>
        <div className={styles.infoCard}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Preço Atual</span>
            <span className={styles.infoValue}>R$ {asset.price.toFixed(2)}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Abertura</span>
            <span className={styles.infoValue}>
              R$ {asset.openingPrice.toFixed(2)}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Tipo</span>
            <span className={styles.infoValue}>{asset.type}</span>
          </div>
        </div>
        <div className={styles.description}>
          <h3>Sobre o Ativo</h3>
          <p>{asset.description}</p>
        </div>
        <div className={styles.chartSection}>
          <h3>Variação de Preço (Últimas 10 Atualizações)</h3>
          <div className={styles.chartWrapper}>
            <AssetChart data={asset.priceHistory} />
          </div>
        </div>
      </div>
      <button onClick={onBack} className={styles.backButton}>
        Voltar ao Mercado
      </button>
    </div>
  );
}

export default AssetDetails;
