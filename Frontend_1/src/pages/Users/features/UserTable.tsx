import React from "react";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";

export const UserTable = ({ rows, deleteRow, editRow }: {rows: any[], deleteRow: (x:any)=>void, editRow: (x:any)=>void}) => {
  
  return (
   
      <div className="max-w-full overflow-x-auto table-wrapper">
      <table className="table">
        <thead>
          <tr className="bg-gray-2 text-left dark:bg-meta-4">
            <th className="min-w-[220px] py-4 px-10 font-medium text-black dark:text-white xl:pl-11 text-start">Username</th>
            <th className="min-w-[150px] py-4 px-10 font-medium text-black dark:text-white text-start">Role</th>
            <th className="py-4 px-10 font-medium text-black dark:text-white text-start">Email</th>
            <th className="py-4 px-10 font-medium text-black dark:text-white text-start">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row:any, idx:number) => {
           

            return (
              <tr key={idx} className="content-center">
                <td className="border-b border-[#eee] py-5 px-11 dark:border-strokedark text-start">{row.username}</td>
                <td className="border-b border-[#eee] py-5 px-10 dark:border-strokedark text-start">
                    {row.role}
                </td>

                <td className="border-b border-[#eee] py-5 px-10 dark:border-strokedark text-start">
                    {row.email}
                </td>
                
                
                
                <td className="border-b border-[#eee] py-5 px-10 dark:border-strokedark">
                  <span className="actions flex grid-cols-2 gap-4">
                    <BsFillTrashFill
                      className="delete-btn cursor-pointer"
                      onClick={() => deleteRow(idx)} />
                    
                    <BsFillPencilFill
                      className="edit-btn cursor-pointer"
                      onClick={() => editRow(idx)} />
                    
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    

  );
};