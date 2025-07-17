export default function getProfileCards(t, navigate) {
  return [
    {
      title: t("profile.cards.0.title"),
      text: t("profile.cards.0.text"),
      background: "#fff8f0",
      hoverBackground: "#ffeedb",
      buttonText: t("profile.cards.0.button"),
      buttonColor: "danger",
      onClick: () => navigate("/my-vibes"),
    },
    {
      title: t("profile.cards.1.title"),
      text: t("profile.cards.1.text"),
      background: "#e3f2fd",
      hoverBackground: "#d0e5f7",
      buttonText: t("profile.cards.1.button"),
      buttonColor: "primary",
      onClick: () => navigate("/create-vibe"),
    },
  ];
}
