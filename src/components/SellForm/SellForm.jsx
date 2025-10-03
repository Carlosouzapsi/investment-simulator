import React, { useState } from "react";
import styles from "./SellForm.module.css";

function SellForm({ asset, onSellConfirm, onBack }) {
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    setTimeout(() => {
      const success = onSellConfirm(asset, parseInt(quantity));
      if (success) {
        setIsSuccess(true);
        setMessage("Venda realizada com sucesso");
      } else {
        setIsSuccess(false);
        setMessage("Quantidade insuficiente para venda");
      }
    });

    if (!asset || !asset.quantity) {
      return (
        <div className={styles.container}>
          <p className={styles.textDanger}>
            Nenhum ativo selecionado para venda.
          </p>
        </div>
      );
    }
  };

  const totalRevenue = (asset.price * quantity).toFixed(2);
  const maxQuantity = asset.quantity;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Ordem de Venda</h1>
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
            Quantidade (Disponível: {maxQuantity})
          </label>
          <input
            id="quantity"
            type="number"
            min="1"
            max={maxQuantity}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className={styles.formInput}
          />
        </div>
        <div className={styles.totalRevenue}>
          <span>Receita Estimada</span>
          <strong>R$ {totalRevenue}</strong>
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
            disabled={isLoading || quantity > maxQuantity || quantity < 1}
            className={styles.confirmButton}>
            {isLoading ? "Enviando Ordem..." : "Confirmar Venda"}
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

export default SellForm;
