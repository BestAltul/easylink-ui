import React from "react";
import { useTranslation } from "react-i18next";
import VibePreviewForCustomers from "@/features/VibeViewForCustomers/VibePreviewForCustomers";

export default function BusinessVibeDemo() {
  const { t } = useTranslation("home");

  const demoBusinessVibe = {
    id: undefined,
    type: "BUSINESS",
    name: t("demo.business.name", "YouMeKnow"),
    description: t(
      "demo.business.description",
      "A next-gen platform for digital identities and smart Vibes — connect, share, and grow your presence effortlessly."
    ),
    photo: "/demo/business.jpg",
    contacts: [
      { type: "website", value: t("demo.business.website", "youmeknow.com") },
      { type: "github", value: t("demo.business.github", "youmeknow") },
      { type: "email", value: t("demo.business.email", "help.youmeknow@gmail.com") }
    ],
    extraBlocks: [
      {
        label: t("demo.business.mission_label", "Our Mission"),
        value: t(
          "demo.business.mission_value",
          "Empowering individuals and businesses to express identity beyond platforms — through one smart link."
        )
      },
      {
        label: t("demo.business.hq_label", "Headquarters"),
        value: t("demo.business.hq_value", "Toronto, Canada")
      }
    ],
    mySubscriberVibeId: null
  };

  return (
    <VibePreviewForCustomers
      id={demoBusinessVibe.id}
      name={demoBusinessVibe.name}
      description={demoBusinessVibe.description}
      photo={demoBusinessVibe.photo}
      contacts={demoBusinessVibe.contacts}
      type={demoBusinessVibe.type}
      extraBlocks={demoBusinessVibe.extraBlocks}
      mySubscriberVibeId={demoBusinessVibe.mySubscriberVibeId}
    />
  );
}
