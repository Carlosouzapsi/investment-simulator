import React, { useState } from "react";
import styles from "./BuyForm.module.css";
function BuyForm({ asset, onBuyConfirm, onBack }) {
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    setTimeout(() => {
      const success = onBuyConfirm(asset, parseInt(quantity));
      if (success) {
        setIsSuccess(true);
        setMessage("Compra realizada com sucesso!");
      } else {
        setIsSuccess(false);
        setMessage("Saldo insuficiente.");
      }
      setIsLoading(false);
    }, 1000); // Simula a latência da rede
  };

  if (!asset) {
    return (
      <div className={styles.container}>
        <p className={styles.textDanger}>Nenhum ativo selecionado</p>
      </div>
    );
  }

  const totalCost = (asset.price * quantity).toFixed(2);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Ordem de Compra</h1>
        <p>
          {asset.name} ({asset.ticker})
        </p>
      </div>
      <div className={styles.assetInfo}>
        <span>Preço por Unidade</span>
        <strong>R$ {asset.price.toFixed(2)}</strong>
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="quantity">
            Quantidade
          </label>
          <input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className={styles.formInput}
          />
        </div>
        <div className={styles.totalCost}>
          <span>Custo Total Estimado</span>
          <strong>R$ {totalCost}</strong>
        </div>
        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={onBack}
            className={styles.backButton}>
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={styles.confirmButton}>
            {isLoading ? "Enviando Ordem..." : "Confirmar Compra"}
          </button>
        </div>
      </form>
      {message && (
        <p
          className={`${styles.formMessage} ${
            isSuccess ? styles.textSuccess : styles.textDanger
          }`}>
          {message}
        </p>
      )}
    </div>
  );
}

export default BuyForm;
