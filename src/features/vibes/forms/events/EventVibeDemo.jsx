import React from "react";
import { useTranslation } from "react-i18next";
import VibePreviewForCustomers from "@/features/VibeViewForCustomers/VibePreviewForCustomers";

export default function OtherVibeDemo() {
  const { t } = useTranslation("home");

  const demoOtherVibe = {
    id: undefined,
    type: "OTHER",
    name: t("demo.other.name", "YMK Launch Meetup"),
    description: t(
      "demo.other.description",
      "Join us for a cozy founder meetup: short talks, live demos, and networking with creators."
    ),
    photo: "/demo/event-demo.png",
    contacts: [
      { type: "website", value: t("demo.other.website", "youmeknow.com/meetup") },
      { type: "telegram", value: t("demo.other.telegram", "@ymk_events") },
      { type: "email", value: t("demo.other.email", "events@youmeknow.com") }
    ],
    extraBlocks: [
      { label: t("demo.other.date_label", "Date"), value: t("demo.other.date_value", "Nov 15, 2025 · 6:30–9:00 PM") },
      { label: t("demo.other.venue_label", "Venue"), value: t("demo.other.venue_value", "Communitech Hub, Kitchener") },
      { label: t("demo.other.details_label", "Details"), value: t("demo.other.details_value", "Talks, Q&A, snacks, and live Vibe demos.") }
    ],
    mySubscriberVibeId: null
  };

  return (
    <VibePreviewForCustomers
      id={demoOtherVibe.id}
      name={demoOtherVibe.name}
      description={demoOtherVibe.description}
      photo={demoOtherVibe.photo}
      contacts={demoOtherVibe.contacts}
      type={demoOtherVibe.type}
      extraBlocks={demoOtherVibe.extraBlocks}
      mySubscriberVibeId={demoOtherVibe.mySubscriberVibeId}
    />
  );
}
