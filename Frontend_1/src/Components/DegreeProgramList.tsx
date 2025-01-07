import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface DegreeProgram {
  id: number;
  name: string;
  description: string;
}

const DegreeProgramList: React.FC = () => {
  const [programs, setPrograms] = useState<DegreeProgram[]>([]);

  useEffect(() => {
    fetch('/api/degree-programs')
      .then((res) => res.json())
      .then((data) => setPrograms(data));
  }, []);

  return (
    <div>
      <h1>Degree Programs</h1>
      <Link to="/degree-programs/new">Add Program</Link>
      <ul>
        {programs.map((program) => (
          <li key={program.id}>
            {program.name} - {program.description}
            <Link to={`/degree-programs/edit/${program.id}`}>Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DegreeProgramList;