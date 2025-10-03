import React, { useState, useEffect } from "react";
import styles from "./Profile.module.css";

const API_BASE_URL = "http://localhost:3333";

function Profile({ currentUser, onUpdateUser }) {
  const [profileData, setProfileData] = useState(currentUser);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || "");

  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({
    type: "",
    text: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.id !== "mock-1") {
      const fetchProfile = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/user/profile`, {
            headers: { Authorization: `Bearer ${currentUser.token}` },
          });
          if (!response.ok)
            throw new Error("Não foi possível carregar os dados do perfil.");
          const data = await response.json();
          setProfileData(data);
          setName(data.name);
        } catch (error) {
          setProfileMessage({ type: "error", text: error.message });
        }
      };
      fetchProfile();
    }
  }, [currentUser]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoadingProfile(true);
    setProfileMessage({ type: "", text: "" });

    if (currentUser.id === "mock-1") {
      setTimeout(() => {
        const updatedUser = { ...currentUser, name };
        onUpdateUser(updatedUser);
        setProfileData(updatedUser);
        setIsEditing(false);
        setIsLoadingProfile(false);
        setProfileMessage({
          type: "success",
          text: "Perfil atualizado com sucesso!",
        });
      }, 500);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) throw new Error("Falha ao atualizar o perfil.");

      const updatedData = await response.json();
      const updatedUser = { ...currentUser, ...updatedData };
      onUpdateUser(updatedUser);
      setProfileData(updatedUser);
      setIsEditing(false);
      setProfileMessage({
        type: "success",
        text: "Perfil atualizado com sucesso!",
      });
    } catch (error) {
      setProfileMessage({ type: "error", text: error.message });
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: "As novas palavras-passe não coincidem.",
      });
      return;
    }

    setIsLoadingPassword(true);
    setPasswordMessage({ type: "", text: "" });

    if (currentUser.id === "mock-1") {
      setTimeout(() => {
        setIsLoadingPassword(false);
        setPasswordMessage({
          type: "success",
          text: "Palavra-passe alterada com sucesso! (Simulação)",
        });
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }, 500);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Falha ao alterar a palavra-passe."
        );
      }
      setPasswordMessage({
        type: "success",
        text: "Palavra-passe alterada com sucesso!",
      });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPasswordMessage({ type: "error", text: error.message });
    } finally {
      setIsLoadingPassword(false);
    }
  };

  if (!profileData) {
    return <div>A carregar perfil...</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <h2 className={styles.title}>Meu Perfil</h2>

      {/* Formulário de Atualização de Nome */}
      <form onSubmit={handleUpdateProfile} className={styles.formSection}>
        <div className={styles.inputGroup}>
          <label>Email</label>
          <input type="email" value={profileData.email} disabled />
        </div>
        <div className={styles.inputGroup}>
          <label>Nome</label>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing}
              className={!isEditing ? styles.disabledInput : ""}
            />
            {!isEditing && (
              <button
                type="button"
                className={styles.editButton}
                onClick={() => setIsEditing(true)}>
                Editar
              </button>
            )}
          </div>
        </div>

        {profileMessage.text && (
          <p className={styles[profileMessage.type]}>{profileMessage.text}</p>
        )}

        {isEditing && (
          <div className={styles.buttonGroup}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoadingProfile}>
              {isLoadingProfile ? "A guardar..." : "Guardar"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setIsEditing(false);
                setName(profileData.name);
                setProfileMessage({ type: "", text: "" });
              }}>
              Cancelar
            </button>
          </div>
        )}
      </form>

      {/* Formulário de Alteração de Senha */}
      <form onSubmit={handleUpdatePassword} className={styles.formSection}>
        <h3 className={styles.subtitle}>Alterar Palavra-passe</h3>
        <div className={styles.inputGroup}>
          <label>Palavra-passe Antiga</label>
          <div className={styles.inputWrapper}>
            <input
              type={showOldPassword ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className={styles.togglePasswordButton}
              onClick={() => setShowOldPassword(!showOldPassword)}>
              {showOldPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label>Nova Palavra-passe</label>
          <div className={styles.inputWrapper}>
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className={styles.togglePasswordButton}
              onClick={() => setShowNewPassword(!showNewPassword)}>
              {showNewPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label>Confirmar Nova Palavra-passe</label>
          <div className={styles.inputWrapper}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className={styles.togglePasswordButton}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </div>
        {passwordMessage.text && (
          <p className={styles[passwordMessage.type]}>{passwordMessage.text}</p>
        )}
        <button
          type="submit"
          className="btn btn-danger"
          disabled={isLoadingPassword}>
          {isLoadingPassword ? "A alterar..." : "Alterar Palavra-passe"}
        </button>
      </form>
    </div>
  );
}

export default Profile;
