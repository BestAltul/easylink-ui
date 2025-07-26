import { useState } from "react";
import { createVibe } from "../../vibeService";

export function useBusinessVibeForm({ navigate, initialData = {}, mode = "create", onSave }) {
  const [name, setName] = useState(initialData.name || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [photoFile, setPhotoFile] = useState(initialData.photo || null);
  const [contacts, setContacts] = useState(initialData.contacts || []);
  const [extraBlocks, setExtraBlocks] = useState(initialData.extraBlocks || []);
  const [showModal, setShowModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const addContact = (type) => {
    if (contacts.some((c) => c.type === type)) return setShowModal(false);
    setContacts([...contacts, { type, value: "" }]); // без id
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fieldsDTO = [
      ...contacts.map((c) => ({
        ...(c.id ? { id: c.id } : {}), // только если есть id
        type: c.type,
        value: c.value,
        label: c.type,
      })),
      ...extraBlocks.map((b) => ({
        ...(b.id ? { id: b.id } : {}), // только если есть id
        type: b.type,
        value: typeof b.value === "object" ? JSON.stringify(b.value) : b.value,
        label: b.label || null,
      })),
    ];

    const dto = {
      id: initialData.id,
      name,
      description,
      type: "BUSINESS",
      fieldsDTO,
    };

    try {
      setLoading(true);
      if (mode === "edit" && onSave) {
        await onSave(dto); // UPDATE
      } else {
        const token = localStorage.getItem("jwt");
        await createVibe(dto, token); // CREATE
        alert("Vibe created!");
        navigate("/my-vibes");
      }
    } catch (err) {
      alert("Error saving Vibe");
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
