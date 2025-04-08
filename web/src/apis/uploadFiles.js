import { api } from "./axiosInstance";

export const uploadFiles = async (file, metadata) => {
  const formData = new FormData();
  formData.append("file", file);

  const metadataBlob = new Blob([JSON.stringify(metadata)], {
    type: "application/json",
  });
  formData.append("metadata", metadataBlob);

  try {
    const res = await api.post("/billboard/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("✅ Uploaded:", res.data.responseObject);
    return res.data.responseObject;
  } catch (error) {
    console.error("❌ Upload failed:", error);
    throw error;
  }
};
