import React from "react";
import { useTranslation } from "react-i18next";
import VibePreviewForCustomers from "@/features/VibeViewForCustomers/VibePreviewForCustomers";

export default function PersonalVibeDemo() {
  const { t } = useTranslation("home");

  const demoPersonalVibe = {
    id: undefined,
    type: "PERSONAL",
    name: t("demo.personal.name", "Alex Johnson"),
    description: t(
      "demo.personal.description",
      "Curious builder, music lover, and weekend hooper. Sharing moments, projects, and ways to connect."
    ),
    photo: "/demo/personal-demo.png",
    contacts: [
      { type: "telegram", value: t("demo.personal.telegram", "@demo.ymk") },
      { type: "instagram", value: t("demo.personal.instagram", "@demo.ymk") },
      { type: "email", value: t("demo.personal.email", "hello@example.me") }
    ],
    extraBlocks: [
      { label: t("demo.personal.city_label", "City"), value: t("demo.personal.city_value", "New York, USA") },
      { label: t("demo.personal.interests_label", "Interests"), value: t("demo.personal.interests_value", "Startups, basketball, photography") },
      { label: t("demo.personal.website_label", "Website"), value: t("demo.personal.website_value", "example.me") }
    ],
    mySubscriberVibeId: null
  };

  return (
    <VibePreviewForCustomers
      id={demoPersonalVibe.id}
      name={demoPersonalVibe.name}
      description={demoPersonalVibe.description}
      photo={demoPersonalVibe.photo}
      contacts={demoPersonalVibe.contacts}
      type={demoPersonalVibe.type}
      extraBlocks={demoPersonalVibe.extraBlocks}
      mySubscriberVibeId={demoPersonalVibe.mySubscriberVibeId}
    />
  );
}
