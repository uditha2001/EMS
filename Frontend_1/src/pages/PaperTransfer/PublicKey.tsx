import React, { useEffect, useState } from 'react';
import api from './api';

const PublicKey: React.FC = () => {
  const [publicKey, setPublicKey] = useState<string>('');
  const [userId] = useState<number>(1); // Default userId (can be updated accordingly)

  useEffect(() => {
    fetchPublicKey();
  }, [userId]); // Fetch public key whenever userId changes

  const fetchPublicKey = async () => {
    try {
      const key = await api.getPublicKey(userId); // Passing userId
      setPublicKey(key); // Set the public key directly
    } catch (error: any) {
      setPublicKey('Error fetching public key: ' + error.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Public Key</h2>
      <textarea
        readOnly
        className="w-full p-2 border rounded"
        value={publicKey}
        rows={5}
      ></textarea>
    </div>
  );
};

export default PublicKey;
