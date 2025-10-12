import { useEffect, useState } from "react";
import { createVibe } from "@/api/vibeApi";

export function useEventVibeForm({
  navigate,
  initialData = {},
  mode = "create",
  onSave,
}) {
  const [name, setName] = useState(initialData.name || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [photo, setPhoto] = useState(initialData.photo || null);
  const [contacts, setContacts] = useState(initialData.contacts || []);
  const [extraBlocks, setExtraBlocks] = useState(initialData.extraBlocks || []);
  const [showModal, setShowModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setContacts((prev) =>
      (prev || []).map((c) => ({
        ...c,
        value:
          typeof c.value === "string"
            ? c.value
            : (c?.value && typeof c.value === "object" && "value" in c.value
                ? String(c.value.value ?? "")
                : String(c.value ?? "")),
      }))
    );
  }, []);

  const addContact = (type) => {
    if (contacts.some((c) => c.type === type)) return setShowModal(false);
    setContacts([...contacts, { type, value: "" }]);
    setShowModal(false);
  };

  const handleContactChange = (i, val) => {
    const str =
      typeof val === "string"
        ? val
        : (val && typeof val === "object" && "value" in val
            ? String(val.value ?? "")
            : String(val ?? ""));
    const updated = [...contacts];
    if (!updated[i]) return;
    updated[i] = { ...updated[i], value: str };
    setContacts(updated);
  };

  const removeContact = (i) => {
    const updated = [...contacts];
    updated.splice(i, 1);
    setContacts(updated);
  };

  const handleBlockChange = (i, val) => {
    const updated = [...extraBlocks];
    if (!updated[i]) return;
    updated[i].value = typeof val === "string" ? val : String(val ?? "");
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

    const dto = {
      id: initialData.id,
      name,
      description,
      type: "OTHER",             
      fieldsDTO,
    };

    try {
      setLoading(true);
      if (mode === "edit" && onSave) {
        await onSave(dto);
      } else {
        const token = localStorage.getItem("jwt");
        await createVibe(dto, token);
        alert("Vibe created!");
        navigate("/my-vibes");
      }
    } catch (err) {
      alert(err.message || "Error saving Vibe");
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
    loading,
    addContact,
    handleContactChange,
    removeContact,
    handleBlockChange,
    removeBlock,
    handleSubmit,
  };
}