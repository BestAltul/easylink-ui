// src/data/contactIcons.js
import React from "react";

import {
  FaInstagram,
  FaWhatsapp,
  FaTelegram,
  FaPhone,
  FaGlobe,
  FaEnvelope,
  FaFacebook,
  FaVk,
  FaTiktok,
  FaLinkedin,
  FaYoutube,
  FaTwitter,
  FaSnapchat,
  FaDiscord,
  FaGithub,
} from "react-icons/fa";
import { SiX } from "react-icons/si";

const iconMap = {
  website: <FaGlobe color="#007bff" />,
  instagram: <FaInstagram color="#E4405F" />,
  whatsapp: <FaWhatsapp color="#25D366" />,
  telegram: <FaTelegram color="#229ED9" />,
  facebook: <FaFacebook color="#1877f3" />,
  // vk: <FaVk color="#4C75A3" />,
  tiktok: <FaTiktok color="#010101" />,
  linkedin: <FaLinkedin color="#0A66C2" />,
  youtube: <FaYoutube color="#FF0000" />,
  twitter: <SiX color="#000" />,
  snapchat: <FaSnapchat color="#FFFC00" />,
  discord: <FaDiscord color="#5865F2" />,
  github: <FaGithub color="#333" />,
  phone: <FaPhone color="#007bff" />,
  email: <FaEnvelope color="#007bff" />,
};

export default iconMap;
