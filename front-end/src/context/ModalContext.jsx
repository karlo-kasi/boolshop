import React, { createContext, useState, useContext } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null); // Stato per i dati della modale

  const openModal = (data = null) => {
    setModalData(data); // Imposta i dati della modale
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setModalData(null); // Resetta i dati della modale
    setIsModalOpen(false);
  };

  return (
    <ModalContext.Provider
      value={{ isModalOpen, modalData, openModal, closeModal }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
