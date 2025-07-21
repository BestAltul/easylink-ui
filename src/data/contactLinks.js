// contactLinks.js

export function getContactLink(type, value) {
  if (!value) return "#";
  switch (type) {
    case "instagram":
      return value.startsWith("http") ? value : `https://instagram.com/${value.replace(/^@/, "")}`;
    case "whatsapp":
      return value.startsWith("http") ? value : `https://wa.me/${value.replace(/\D/g, "")}`;
    case "telegram":
      return value.startsWith("http") ? value : `https://t.me/${value.replace(/^@/, "")}`;
    case "facebook":
      return value.startsWith("http") ? value : `https://facebook.com/${value.replace(/^@/, "")}`;
    case "tiktok":
      return value.startsWith("http") ? value : `https://tiktok.com/@${value.replace(/^@/, "")}`;
    case "linkedin":
      return value.startsWith("http") ? value : `https://linkedin.com/in/${value.replace(/^@/, "")}`;
    case "youtube":
      return value.startsWith("http") ? value : `https://youtube.com/${value}`;
    case "twitter":
      return value.startsWith("http") ? value : `https://twitter.com/${value.replace(/^@/, "")}`;
    case "snapchat":
      return value.startsWith("http") ? value : `https://snapchat.com/add/${value.replace(/^@/, "")}`;
    case "discord":
      return "#"; // Для Discord логина лучше показывать просто имя, нельзя сделать прямую ссылку по нику
    case "github":
      return value.startsWith("http") ? value : `https://github.com/${value.replace(/^@/, "")}`;
    case "phone":
      return `tel:${value}`;
    case "email":
      return `mailto:${value}`;
    case "website":
      return value.startsWith("http") ? value : `https://${value}`;
    default:
      return "#";
  }
}
