import React from 'react';

type DataCardProps = {
  color: 'indigo' | 'green' | 'blue' | 'red' | 'purple' | 'pink' | 'yellow' | 'rose';
  count: string | number;
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const DataCard: React.FC<DataCardProps> = ({ color, count, title, icon: Icon }) => {
  const colorVariants = {
    blue: "bg-blue-500 ",
    red: "bg-red-500 ",
    green: "bg-green-500 ",
    indigo: "bg-indigo-500 ",
    purple: "bg-purple-500 ",
    pink: "bg-pink-500 ",
    yellow: "bg-yellow-500 ",
    rose: "bg-rose-500 ",

  };
  return (
    <div className={`${colorVariants[color]} p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 h-full w-full`} >
      <div className="flex items-center justify-between h-full">
        <div>
          <span className={`text-2xl font-bold text-black`}>
            {count}
          </span>
          <h3 className="text-black text-sm mt-1">{title}</h3>
        </div>
        <div className={`p-4 rounded-full bg-white`}>
          <Icon className={`w-6 h-6 text-black`}/>
        </div>
      </div>
    </div>
  );
};

export default DataCard;