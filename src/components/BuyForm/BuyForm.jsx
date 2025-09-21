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
      <h2>Comprar {asset.name}</h2>
      <p className={styles.assertInfo}>
        Ticker: <strong>{asset.ticker}</strong>
      </p>
      <p className={styles.assertInfo}>
        Preço por unidade: <strong>R$ {asset.price.toFixed(2)}</strong>
      </p>
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
        <div className={styles.totalCost}>Custo Total: R$ {totalCost}</div>
        <div className="btn-group">
          <button type="button" onClick={onBack} className="btn btn-secondary">
            Voltar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-success"
          >
            {isLoading ? "A processar..." : "Confirmar Compra"}
          </button>
        </div>
      </form>
      {message && (
        <p
          className={`${styles.formMessage} ${
            isSuccess ? styles.textSuccesss : styles.textDanger
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default BuyForm;
