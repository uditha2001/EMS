const DegreeProgramCard = ({name, description}: {name: string, description: string}) => {
  return (
    <div className="border border-gray-200 p-4 shadow-3 rounded-md w-full md:w-[300px] min-h-[150px]">
        <div className="font-bold text-xl mb-3">{name}</div>
        <div>{description.length > 50 ? description.substring(0, 47) + ' ...' : description}</div>
        <div>
            <button className="text-blue-500 rounded-md mt-3 mr-2">Edit</button>
            <button className="text-red-500 rounded-md mt-3 ml-3">Delete</button>
        </div>
    </div>
  )
}

export default DegreeProgramCard