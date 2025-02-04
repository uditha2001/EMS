import React from 'react';

const DegreeProgramAddCard: React.FC = () => {
    return (
        <div className="border border-gray-200 p-4 shadow-3 rounded-md w-full md:w-[300px] min-h-[150px]">
            <div>Add new Degree Program, <br></br>if it doesn't already exist</div>
            <a href="/academic/degreeprograms/create" className="mt-2">
                <button className="bg-blue-500 text-white py-2 px-3 rounded-md mt-3 mr-2">Add New</button>
            </a>
        </div>
      )
};

export default DegreeProgramAddCard;