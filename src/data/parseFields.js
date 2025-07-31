import CONTACT_TYPES from "./contactTypes";

function parseFields(fieldsDTO = []) {
  const contacts = [];
  const extraBlocks = [];
  let name = "";
  let description = "";

  const contactKeys = CONTACT_TYPES.map(type => type.key.toLowerCase());

  fieldsDTO.forEach(field => {
    const fieldLabel = field.label?.toLowerCase();

    // Имя пользователя
    if (fieldLabel === "name" && field.value) {
      contacts.push({
        id: field.id,
        type: "name",
        value: field.value,
        label: field.label,
        vibeId: field.vibeId,
        fromBackend: true
      });
      return;
    }

    // Контакты из CONTACT_TYPES
    if (contactKeys.includes(fieldLabel)) {
      contacts.push({
        id: field.id,
        type: fieldLabel,
        value: field.value,
        fromBackend: true
      });
      return;
    }

    // Часы работы
    if (fieldLabel === "hours") {
      let hoursValue = field.value;
      if (typeof hoursValue === "string") {
        try {
          hoursValue = JSON.parse(hoursValue);
        } catch {
          hoursValue = {};
        }
      }
      extraBlocks.push({
        id: field.id,
        label: field.label || "Custom",
        type: field.type || "custom",
        value: hoursValue,
        fromBackend: true
      });
      return;
    }

    // Описание
    if (fieldLabel === "description") {
      description = field.value;
      return;
    }

    // Custom InfoBlock
    if (field.value) {
      extraBlocks.push({
        id: field.id,
        label: field.label || "Custom",
        type: field.type || "custom",
        value: field.value,
        fromBackend: true
      });
    }
  });

  return { name, description, contacts, extraBlocks };
}

export default parseFields;
