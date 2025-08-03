import axios from "axios";

export default function useUpdateOffer(token) {
  const updateOffer = async (id, updatedFields, token) => {
    try {
      const response = await axios.patch(
        `/api/v3/offers/${id}`,
        updatedFields,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.status === 200;
    } catch (error) {
      console.error("Error updating offer:", error);
      return false;
    }
  };

  return { updateOffer };
}
