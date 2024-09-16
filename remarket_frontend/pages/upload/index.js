import React, { useState } from "react";
import { useRouter } from "next/router";
import apiService from '../../src/services/apiService';

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const router = useRouter();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setUploadStatus("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await apiService.postData('upload', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUploadStatus("File uploaded successfully.");
      router.push(`/upload/${response.filename}`);
    } catch (error) {
      setUploadStatus("Error uploading file.");
    }
  };

  return (
    <div>
      <h1>Upload Image</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      <p>{uploadStatus}</p>
    </div>
  );
};

export default UploadPage;