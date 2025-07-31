import { useState } from "react";
import { createVibe, updateVibe } from "../../vibeService";
import CONTACT_TYPES from "../../../../data/contactTypes";
import iconMap from "../../../../data/contactIcons";
import { FaGlobe } from "react-icons/fa";

export function useEventVibeForm({ navigate, mode = "create", initialData = {}, onSave }) {
  const [name, setName] = useState(initialData.name || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [contacts, setContacts] = useState(initialData.contacts || []);
  const [extraBlocks, setExtraBlocks] = useState(initialData.extraBlocks || []);
  const [photoFile, setPhotoFile] = useState(initialData.photo || null);

  const [showModal, setShowModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const addContact = (type) => {
    if (contacts.some((c) => c.type === type)) {
      setShowModal(false);
      return;
    }

    const label = CONTACT_TYPES.find((t) => t.key === type)?.label || type;

    setContacts([...contacts, { type, value: "", label }]);
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
        type: c.type,
        value: c.value,
        label: c.label || c.type,
        ...(c.id ? { id: c.id } : {}),
      })),
      ...extraBlocks.map((b) => ({
        type: b.type,
        value: typeof b.value === "object" ? JSON.stringify(b.value) : b.value,
        label: b.label || null,
        ...(b.id ? { id: b.id } : {}),
      })),
    ];

    const token = localStorage.getItem("jwt");

    const dto = {
      name,
      description,
      type: "OTHER",
      fieldsDTO,
    };

    try {
      setLoading(true);
      if (mode === "edit" && initialData.id) {
        await updateVibe({ id: initialData.id, ...dto }, token);
        alert("Event Vibe updated!");
        onSave && onSave({ id: initialData.id, ...dto });
      } else {
        await createVibe(dto, token);
        alert("Event Vibe created!");
        navigate("/my-vibes");
      }
    } catch (err) {
      alert("Error " + (mode === "edit" ? "updating" : "creating") + " Vibe");
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
    mode,
  };
}
