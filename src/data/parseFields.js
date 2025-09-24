import CONTACT_TYPES from "./contactTypes";

function parseFields(fieldsDTO = []) {
  const contacts = [];
  const extraBlocks = [];
  let name = "";
  let description = "";

  const contactKeys = CONTACT_TYPES.map(type => type.key.toLowerCase());

  fieldsDTO.forEach(field => {
    const fieldLabel = field.label?.toLowerCase();

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

    if (contactKeys.includes(fieldLabel)) {
      contacts.push({
        id: field.id,
        type: fieldLabel,
        value: field.value,
        fromBackend: true
      });
      return;
    }

    if (fieldLabel === "hours") {
      let hoursValue = field.value;

      if (typeof hoursValue === "string") {
        try { hoursValue = JSON.parse(hoursValue); } catch { hoursValue = {}; }
      }

      const base = {
        monday:"", tuesday:"", wednesday:"",
        thursday:"", friday:"", saturday:"", sunday:""
      };
      const alias = {
        mon:"monday", monday:"monday",
        tue:"tuesday", tues:"tuesday", tuesday:"tuesday",
        wed:"wednesday", weds:"wednesday", wednesday:"wednesday",
        thu:"thursday", thur:"thursday", thurs:"thursday", thursday:"thursday",
        fri:"friday", friday:"friday",
        sat:"saturday", saturday:"saturday",
        sun:"sunday", sunday:"sunday",
      };

      const out = { ...base };
      if (hoursValue && typeof hoursValue === "object" && !Array.isArray(hoursValue)) {
        for (const [k, v] of Object.entries(hoursValue)) {
          const norm = String(k).trim().toLowerCase().replace(/\.$/, "");
          const day = alias[norm];
          if (day) out[day] = typeof v === "string" ? v : "";
        }
      }

      extraBlocks.push({
        id: field.id,
        label: field.label || "Hours",
        type: "hours",     
        value: out,
        fromBackend: true
      });
      return;
    }


    if (fieldLabel === "description") {
      description = field.value;
      return;
    }

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
