import React from 'react'
import { Table } from '../../components/TableSettings'
import { UserTable } from './features/UserTable'

export default function Index() {
  return (
    <div className="flex flex-wrap gap-10 ">
      <div className="shadow-xl w-[300px] h-screen p-7 xl:order-2">
        <select className="p-3 shadow-sm w-[200px] pr-8 pl-4">
          <option>Selected</option>
          <option>Admin</option>
          <option>Editor</option>
          <option>Modarator</option>
        </select>
      </div>

      <div className="xl:order-1">  
        <div className="flex items-center gap-x-3  mb-7">
          <input className="border-[1px] border-gray-500 py-2 px-4 w-[300px]" type="text" placeholder="search user"/>
          <button
              type="submit"
              className="px-7 py-[9px] text-white bg-blue-600 rounded-sm shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Search
          </button> 
        </div>
        
        <UserTable rows={[
          {
            username: 'timasha',
            role: 'Admin',
            email: 'timasha@gmail.com',
          }
        ]} deleteRow={()=>{console.log('delete')}} editRow={()=>{console.log('edit')}}></UserTable>
      </div>

      

    </div>
  )
}
