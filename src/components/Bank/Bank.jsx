import React, { useState } from 'react';
import styles from './Bank.module.css';

const mockBanks = [
  {
    id: 'banco-ouro',
    name: 'Banco Ouro & Prata',
    interestRate: 0.5,
    logo: '💰',
  },
  {
    id: 'invest-corp',
    name: 'InvestCorp S.A.',
    interestRate: 0.7,
    logo: '🏢',
  },
  {
    id: 'familia-credito',
    name: 'Família Crédito',
    interestRate: 1.2,
    logo: '👨‍👩‍👧‍👦',
  },
];

function Bank({ onLoanRequest }) {
  const [loanAmounts, setLoanAmounts] = useState({});
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(null); // Armazena o ID do banco em carregamento

  const handleAmountChange = (bankId, value) => {
    setLoanAmounts((prev) => ({ ...prev, [bankId]: value }));
  };

  const handleSubmit = (e, bank) => {
    e.preventDefault();
    const amount = parseFloat(loanAmounts[bank.id] || 0);
    
    if (amount <= 0) {
      setMessage('Por favor, insira um valor válido.');
      return;
    }

    setIsLoading(bank.id);
    setMessage('');

    setTimeout(() => {
      onLoanRequest(amount, bank.interestRate);
      setMessage(`Empréstimo de R$ ${amount.toFixed(2)} com ${bank.name} concedido!`);
      setIsLoading(null);
      setLoanAmounts((prev) => ({ ...prev, [bank.id]: '' }));
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Mercado de Crédito</h1>
        <p>Escolha sua fonte de capital e alavanque suas posições.</p>
      </div>

      {message && <p className={styles.globalMessage}>{message}</p>}

      <div className={styles.bankGrid}>
        {mockBanks.map((bank) => (
          <form key={bank.id} onSubmit={(e) => handleSubmit(e, bank)} className={styles.bankCard}>
            <div className={styles.bankHeader}>
              <span className={styles.bankLogo}>{bank.logo}</span>
              <h3>{bank.name}</h3>
            </div>
            <div className={styles.interestRate}>
              Taxa de Juros: <strong>{bank.interestRate}%</strong> a.m.
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor={`amount-${bank.id}`}>Valor do Empréstimo</label>
              <input
                id={`amount-${bank.id}`}
                type="number"
                min="100"
                step="100"
                value={loanAmounts[bank.id] || ''}
                onChange={(e) => handleAmountChange(bank.id, e.target.value)}
                className={styles.formInput}
                placeholder="R$ 1000,00"
                required
              />
            </div>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading === bank.id}>
              {isLoading === bank.id ? 'Processando...' : 'Pegar Empréstimo'}
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}

export default Bank;