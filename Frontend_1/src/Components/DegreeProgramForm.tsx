import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const DegreeProgramForm: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetch(`/api/degree-programs/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setName(data.name);
          setDescription(data.description);
        });
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const method = id ? 'PUT' : 'POST';
    fetch(`/api/degree-programs${id ? `/${id}` : ''}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    }).then(() => navigate('/degree-programs'));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>{id ? 'Edit' : 'Add'} Degree Program</h1>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <button type="submit">Save</button>
    </form>
  );
};

export default DegreeProgramForm;