import React from "react";
import styles from "./Profile.module.css";

function Profile({ currentUser }) {
  if (!currentUser) {
    return (
      <div className={styles.profileContainer}>
        <h2 className={styles.title}>Perfil do utilizador</h2>
        <p>
          Não foi possível carregar dados do utilizador. Por favor, faça login
          novamente
        </p>
      </div>
    );
  }
  return (
    <div className={styles.profileContainer}>
      <h2 className={styles.title}>Perfil do Utilizador</h2>
      <div className={styles.card}>
        <div className={styles.infoGroup}>
          <span className={styles.infoLabel}>Nome:</span>
          <span className={styles.infoValue}>{currentUser.name}</span>
        </div>
        <div className={styles.infoGroup}>
          <span className={styles.infoLabel}>Email:</span>
          <span className={styles.infoValue}>{currentUser.email}</span>
        </div>
      </div>
    </div>
  );
}

export default Profile;
