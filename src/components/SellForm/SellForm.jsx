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
      <h2>Vender {asset.name}</h2>
      <p className={styles.assetInfo}>
        Ticker: <strong>{asset.ticker}</strong>
      </p>
      <p className={styles.assetInfo}>
        Preço por unidade: <strong>{asset.price.toFixed(2)}</strong>
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="quantity">
            Quantidade (Máx: {maxQuantity})
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
          Valor à receber: R$ {totalRevenue}
        </div>
        <div className="btn-group">
          <button type="button" onClick={onBack} className="btn btn-secundary">
            Voltar
          </button>
          <button
            type="submit"
            disabled={isLoading || quantity > maxQuantity || quantity < 1}
            className="btn btn-danger">
            {isLoading ? "A Vender..." : "Confirmar Venda"}
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
