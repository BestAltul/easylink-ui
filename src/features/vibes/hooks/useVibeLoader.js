import { useState, useEffect } from "react";
import { getVibe } from "@/api/vibeApi";
import parseFields from "@/data/parseFields";

export default function useVibeLoader(id, token) {
  const [vibe, setVibe] = useState(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [contacts, setContacts] = useState([]);
  const [extraBlocks, setExtraBlocks] = useState([]);
  const [visible, setVisible] = useState(false);
  const [publicCode, setPublicCode] = useState("");
  
  useEffect(() => {
    setLoading(true);
    getVibe(id, token)
      .then((data) => setVibe(data))
      .catch(() => setVibe(null))
      .finally(() => setLoading(false));
  }, [id, token]);

  useEffect(() => {
    if (!vibe) return;

    setName(vibe.name || "");
    setDescription(vibe.description || "");
    setVisible(vibe.visible || false);
    setPublicCode(vibe.publicCode || "");

    const { contacts, extraBlocks } = parseFields(vibe.fieldsDTO || []);
    setContacts(contacts);
    setExtraBlocks(extraBlocks);
  }, [vibe]);

  return {
    vibe,
    setVibe,
    loading,
    name,
    description,
    contacts,
    extraBlocks,
    visible,
    publicCode,
  };
}
