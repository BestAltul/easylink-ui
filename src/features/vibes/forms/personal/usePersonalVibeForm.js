import { useState } from "react";
import { createVibe } from "@/api/vibeApi";

export function usePersonalVibeForm({
  navigate,
  initialData = {},
  mode = "create",
  onSave,
  onCancel,
}) {
  const [name, setName] = useState(initialData.name || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [photo, setPhoto] = useState(initialData.photo || null);
  const [contacts, setContacts] = useState(initialData.contacts || []);
  const [extraBlocks, setExtraBlocks] = useState(initialData.extraBlocks || []);
  const [showModal, setShowModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showInfo, setShowInfo] = useState(mode !== "edit");
  const [loading, setLoading] = useState(false);

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
    setContacts((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleBlockChange = (i, val) => {
    const updated = [...extraBlocks];
    updated[i].value = val;
    setExtraBlocks(updated);
  };

  const removeBlock = (i) => {
    setExtraBlocks((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fieldsDTO = [
      ...contacts.map((c) => ({
        ...(c.id ? { id: c.id } : {}),
        type: c.type,
        value: c.value,
        label: c.type,
      })),
      ...extraBlocks.map((b) => ({
        ...(b.id ? { id: b.id } : {}),
        type: b.type,
        value: b.value,
        label: b.label || null,
      })),
    ];

    let photoUrl = initialData.photo || null;

    if (photo instanceof File) {
      const token = localStorage.getItem("jwt");
      const formData = new FormData();
      formData.append("file", photo);

      const uploadRes = await fetch("/api/v3/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Photo upload failed");
      photoUrl = await uploadRes.text();
    }

    const dto = {
      id: initialData.id,
      name,
      description,
      type: "PERSONAL",
      photo: photoUrl,
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
      alert(err.message || "Error saving Vibe");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    name,
    setName,
    description,
    setDescription,
    photo,
    setPhoto,
    contacts,
    setContacts,
    showModal,
    setShowModal,
    extraBlocks,
    setExtraBlocks,
    showBlockModal,
    setShowBlockModal,
    showInfo,
    setShowInfo,
    loading,
    addContact,
    handleContactChange,
    removeContact,
    handleBlockChange,
    removeBlock,
    handleSubmit,
  };
}
