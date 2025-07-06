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
      name = field.value;
    }

    // Контакты из CONTACT_TYPES
    if (contactKeys.includes(fieldLabel)) {
      contacts.push({
        type: fieldLabel,
        value: field.value
      });
    }

    // Часы работы
    if (fieldLabel === "hours") {
      let hoursValue = field.value;
      // Если это строка, пытаемся парсить
      if (typeof hoursValue === "string") {
        try {
          hoursValue = JSON.parse(hoursValue);
        } catch {
          hoursValue = {};
        }
      }
      extraBlocks.push({
        label: "Hours",
        type: "hours",
        value: hoursValue
      });
    }

    // Описание (если появится)
    if (fieldLabel === "description") {
      description = field.value;
    }
  });

  return { name, description, contacts, extraBlocks };
}

export default parseFields;
