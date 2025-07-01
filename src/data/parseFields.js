function parseFields(fieldsDTO = []) {
  const contacts = [];
  const extraBlocks = [];
  let name = "";
  let description = "";

  fieldsDTO.forEach(field => {
    // Имя пользователя
    if (field.label?.toLowerCase() === "name" && field.value) {
      name = field.value;
    }
    // Контакты
    if (
      ["instagram", "whatsapp", "telegram", "phone", "email", "website"].includes(field.label?.toLowerCase())
    ) {
      contacts.push({
        type: field.label.toLowerCase(),
        value: field.value
      });
    }
    // Часы работы
    if (field.label?.toLowerCase() === "hours") {
      extraBlocks.push({
        label: "Hours",
        value: field.value
      });
    }
  });

  return { name, contacts, extraBlocks };
}

export default parseFields;
