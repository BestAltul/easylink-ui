import VibeContent from "../../features/VibeViewForCustomers/VibeContentForCustomers";
import PageLayout from "../../components/common/PageLayout";
import { useTranslation } from "react-i18next";

export default function VibePreviewForCustomers({
  id,
  name,
  description,
  photo,
  contacts,
  type,
  extraBlocks,
  mySubscriberVibeId,
}) {
  const { t } = useTranslation();
  return (
    <PageLayout title={t("Vibe")}>
      <div
        className="card shadow rounded-4 p-4 vibe-preview"
        style={{
          background: "linear-gradient(135deg, #f6fafe 65%, #f8f4fd 100%)",
          border: "none",
          maxWidth: 400,
          margin: "0 auto",
          position: "relative",
        }}
      >
        <VibeContent
          id={id}
          name={name}
          description={description}
          photo={photo}
          contacts={contacts}
          type={type}
          extraBlocks={extraBlocks}
          subscriberVibeId={mySubscriberVibeId}
        />
      </div>
    </PageLayout>
  );
}
