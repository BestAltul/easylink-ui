export default function getProfileCards(t, navigate) {
  return [
    {
      title: t("cards.0.title"),
      text: t("cards.0.text"),
      background: "#fff8f0",
      hoverBackground: "#ffeedb",
      buttonText: t("cards.0.button"),
      buttonColor: "danger",
      onClick: () => navigate("/my-vibes"),
    },
    {
      title: t("cards.1.title"),
      text: t("cards.1.text"),
      background: "#e3f2fd",
      hoverBackground: "#d0e5f7",
      buttonText: t("cards.1.button"),
      buttonColor: "primary",
      onClick: () => navigate("/create-vibe"),
    },
  ];
}
