// src/features/profile/utils/getProfileCards.js
export default function getProfileCards(t, navigate) {
  return [
    {
      icon: "bar-chart",       
      variant: "red",
      title: t("cards.0.title"),
      text: t("cards.0.text"),
      buttonText: t("cards.0.button"),
      onClick: () => navigate("/my-vibes"),
    },
    {
      icon: "plus",            
      variant: "blue",
      title: t("cards.1.title"),
      text: t("cards.1.text"),
      buttonText: t("cards.1.button"),
      onClick: () => navigate("/create-vibe"),
    },
  ];
}
