// src/features/vibes/forms/useBusinessVibeForm.js

import { useState } from "react";
import { createVibe } from "../../vibeService";

export function useBusinessVibeForm(navigate) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [extraBlocks, setExtraBlocks] = useState([]);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Контакты
  const addContact = (type) => {
    if (contacts.some((c) => c.type === type)) return setShowModal(false);
    setContacts([...contacts, { type, value: "" }]);
    setShowModal(false);
  };
  const handleContactChange = (i, val) => {
    const updated = [...contacts];
    updated[i].value = val;
    setContacts(updated);
  };
  const removeContact = (i) => {
    const updated = [...contacts];
    updated.splice(i, 1);
    setContacts(updated);
  };

  // Доп. инфо-блоки
  const handleBlockChange = (i, val) => {
    const updated = [...extraBlocks];
    updated[i].value = val;
    setExtraBlocks(updated);
  };
  const removeBlock = (i) => {
    const updated = [...extraBlocks];
    updated.splice(i, 1);
    setExtraBlocks(updated);
  };

  // Отправка
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fieldsDTO = [
      { type: "name", value: name, label: "Name" },
      ...contacts.map((c) => ({
        type: c.type,
        value: c.value,
        label: c.type,
      })),
      ...extraBlocks.map((b) => ({
        type: b.type,
        value: typeof b.value === "string" ? b.value : JSON.stringify(b.value),
        label: b.label || null,
      })),
    ];

    const dto = {
      name,
      description,
      type: "BUSINESS",
      fieldsDTO,
    };

    try {
      setLoading(true);
      const token = localStorage.getItem("jwt");
      await createVibe(dto, token);
      alert("Vibe created!");
      navigate("/my-vibes");
    } catch (err) {
      alert("Error creating Vibe");
    } finally {
      setLoading(false);
    }
  };

  return {
    name,
    setName,
    description,
    setDescription,
    photoFile,
    setPhotoFile,
    contacts,
    setContacts,
    showModal,
    setShowModal,
    extraBlocks,
    setExtraBlocks,
    showBlockModal,
    setShowBlockModal,
    loading,
    addContact,
    handleContactChange,
    removeContact,
    handleBlockChange,
    removeBlock,
    handleSubmit,
  };
}
