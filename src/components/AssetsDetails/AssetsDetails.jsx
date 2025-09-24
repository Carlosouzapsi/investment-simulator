import React from "react";
import styles from "./AssetsDetails.module.css";
import AssetChart from "../AssetChart/AssertChart";

function AssetsDetails({ asset, onBack }) {
  if (!asset) {
    return <div className={styles.container}>Nenhum ativo selecionado</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>
          {asset.name} ({asset.ticker})
        </h2>
      </div>
      <div className={styles.contentGrid}>
        <div className={styles.chartSection}>
          <div className={styles.infoCard}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Preço Atual:</span>
              <span className={styles.infoValue}>
                R$ {asset.price.toFixed(2)}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Preço de Abertura:</span>
              <span className={styles.infoValue}>
                R$ {asset.openingPrice.toFixed(2)}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Tipo:</span>
              <span className={styles.infoValue}>{asset.type}</span>
            </div>
          </div>
          <h3>Histórico Recente de Preços</h3>
          <AssetChart data={asset.priceHistory} />
        </div>
      </div>
      <button
        onClick={onBack}
        className={`btn btn-secondary ${styles.backButton}`}>
        Voltar para a Lista de Ativos
      </button>
    </div>
  );
}

export default AssetsDetails;
