export const valueToString = (val) =>
  typeof val === "string"
    ? val
    : (val && typeof val === "object" && "value" in val ? String(val.value ?? "") : String(val ?? ""));
