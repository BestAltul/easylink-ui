import { useState } from "react";
import { createVibe } from "@/api/vibeApi";
import parseFields from "@/data/parseFields";

// локальные утилиты
const EMPTY_HOURS = {
  monday: "", tuesday: "", wednesday: "",
  thursday: "", friday: "", saturday: "", sunday: ""
};

const isHoursKey = (s) => String(s || "").toLowerCase() === "hours";

export function useBusinessVibeForm({ navigate, initialData = {}, mode = "create", onSave }) {
  // 1) берём всё из fieldsDTO, если оно есть
  const parsed = initialData.fieldsDTO ? parseFields(initialData.fieldsDTO) : {};

  const [name, setName] = useState(initialData.name || parsed.name || "");
  const [description, setDescription] = useState(initialData.description || parsed.description || "");
  const [photoFile, setPhotoFile] = useState(initialData.photo || null);

  const [contacts, setContacts] = useState(
    initialData.contacts || parsed.contacts || []
  );

  // важное место: extraBlocks из parseFields уже содержит hours как объект
  const [extraBlocks, setExtraBlocks] = useState(
    initialData.extraBlocks || parsed.extraBlocks || []
  );

  const [showModal, setShowModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // ===== Contacts =====
  const addContact = (type) => {
    if (contacts.some((c) => c.type === type)) return setShowModal(false);
    setContacts((prev) => [...prev, { type, value: "" }]);
    setShowModal(false);
  };

  const handleContactChange = (i, val) => {
    setContacts((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], value: val };
      return next;
    });
  };

  const removeContact = (i) => {
    setContacts((prev) => prev.filter((_, idx) => idx !== i));
  };

  // ===== Info blocks (incl. Hours) =====
  const hasHours = () =>
    extraBlocks.some(
      (b) => isHoursKey(b.type) || isHoursKey(b.label)
    );

  // универсальный добавлятель инфо-блока (вызывай его из onSelect модалки)
  const addInfoBlock = (block) => {
    const key = String(block?.key || "").toLowerCase();
    const label = block?.label || "";

    const wantsHours = isHoursKey(key) || isHoursKey(label);
    if (wantsHours) {
      if (hasHours()) return; // не добавляем второй раз
      setExtraBlocks((prev) => [
        ...prev,
        { type: "hours", label: "Hours", value: { ...EMPTY_HOURS } },
      ]);
      return;
    }

    setExtraBlocks((prev) => [
      ...prev,
      {
        type: block?.key,
        label: block?.label || "Custom",
        value: "",
        placeholder: block?.placeholder,
      },
    ]);
  };

  const handleBlockChange = (i, val) => {
    // val может быть строкой (обычные блоки) или объектом (hours)
    setExtraBlocks((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], value: val };
      return next;
    });
  };

  const removeBlock = (i) => {
    setExtraBlocks((prev) => prev.filter((_, idx) => idx !== i));
  };

  // ===== Submit =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    // собираем fieldsDTO: контакты + инфо-блоки
    const fieldsDTO = [
      // контакты (как раньше)
      ...contacts.map((c) => ({
        ...(c.id ? { id: c.id } : {}),
        type: c.type,
        value: c.value,
        label: c.type,
      })),

      // инфо-блоки
      ...extraBlocks.map((b) => {
        const isHours = isHoursKey(b.type) || isHoursKey(b.label);
        const rawValue = isHours ? (b.value || EMPTY_HOURS) : b.value;

        return {
          ...(b.id ? { id: b.id } : {}),
          type: isHours ? "hours" : (b.type || "custom"),
          label: b.label || (isHours ? "Hours" : "Custom"),
          // важное: сериализуем объект часов в строку JSON
          value: typeof rawValue === "object" ? JSON.stringify(rawValue) : rawValue,
        };
      }),
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
    // state
    name, setName,
    description, setDescription,
    photoFile, setPhotoFile,
    contacts, setContacts,
    extraBlocks, setExtraBlocks,
    showModal, setShowModal,
    showBlockModal, setShowBlockModal,
    loading,

    // contacts api
    addContact,
    handleContactChange,
    removeContact,

    // blocks api
    addInfoBlock,
    handleBlockChange,
    removeBlock,

    // submit
    handleSubmit,
  };
}
