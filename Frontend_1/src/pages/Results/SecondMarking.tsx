import SelectExaminationComponent from '../../components/resultComponent/SelectExaminationComponent'

const SecondMarking = () => {
    return (
        <div className="flex flex-col items-center justify-start w-full min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-2 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800">
        <div className="w-full max-w-6xl">
            <div className="text-center mb-4 dark:bg-black">
                <h1 className="text-4xl font-bold text-gray-800 mb-1 dark:text-gray-200">
                    Second Marking Results Upload
                </h1>
                <p className="text-gray-600 dark:text-gray-400">Upload and manage examination results</p>
            </div>
            <SelectExaminationComponent />
            
            <div className="flex justify-center mt-4">
                <button
                    className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl shadow-md transition-all duration-300 hover:shadow-lg dark:bg-blue-600 dark:hover:bg-blue-700 dark:shadow-gray-700/30 flex items-center justify-center space-x-1.5"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span>search FirstMarking Marks</span>
                </button>
            </div>
        </div>
    </div>
    )
}

export default SecondMarking