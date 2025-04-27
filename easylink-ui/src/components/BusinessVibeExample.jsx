import React from "react";

// Компонент для отображения бизнес-визитки
function BusinessVibeExample({ profile }) {
  return (
    <div
      className="container p-4 my-4 shadow rounded-4"
      style={{ maxWidth: "700px", backgroundColor: "#f8f9fa" }}
    >
      <div className="row align-items-center">
        {/* Фото слева */}
        <div className="col-md-4 text-center mb-3 mb-md-0">
          <img
            src={profile.photoUrl}
            alt="Profile"
            className="img-fluid rounded-4"
            style={{ objectFit: "cover", width: "150px", height: "150px" }}
          />
        </div>

        {/* Информация справа */}
        <div className="col-md-8">
          <h4 className="mb-2">{profile.fullName}</h4>
          <p className="mb-1">
            <strong>Phone:</strong> {profile.phone}
          </p>
          <p className="mb-1">
            <strong>Email:</strong> {profile.email}
          </p>
          <div className="d-flex gap-3 my-2">
            {profile.facebook && (
              <a
                href={profile.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
            )}
            {profile.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            )}
          </div>
          {profile.website && (
            <p className="mb-0">
              <strong>Website:</strong>{" "}
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                {profile.website}
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Пример использования компонента
export default function BusinessVibeExample() {
  const exampleProfile = {
    photoUrl: "/your-photo.png", // сюда поставь путь к твоей фотке
    fullName: "John Doe",
    phone: "+1 555-123-4567",
    email: "john.doe@example.com",
    facebook: "https://facebook.com/johndoe",
    linkedin: "https://linkedin.com/in/johndoe",
    website: "https://johndoe.com",
  };

  return <BusinessVibe profile={exampleProfile} />;
}
