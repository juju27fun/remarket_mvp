import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import apiService from '../../src/services/apiService';
import { API_FULL_URL } from '../../src/utils/constants';

const UploadedImage = () => {
  const router = useRouter();
  const { filename } = router.query;
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (filename) {
      const fetchImage = async () => {
        try {
          const response = await apiService.getData(`uploads/${filename}`, { responseType: 'blob' });
          const imageUrl = URL.createObjectURL(response);
          setImageSrc(imageUrl);
        } catch (err) {
          setError(`Error fetching the image: ${err.message}`);
        } finally {
          setLoading(false);
        }
      };

      fetchImage();
    }
  }, [filename]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!imageSrc) return <div>Image not found</div>;

  return (
    <div>
      <h1>Uploaded Image</h1>
      <img src={imageSrc} alt={filename} style={{ maxWidth: '100%', height: 'auto' }} />
    </div>
  );
};

export default UploadedImage;