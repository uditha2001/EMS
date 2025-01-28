import React from 'react';

type DataCardProps = {
  color: 'indigo' | 'green' | 'blue' | 'red' | 'purple' | 'pink' | 'yellow';
  count: string | number;
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const DataCard: React.FC<DataCardProps> = ({ color, count, title, icon: Icon }) => {
  return (
    <div className={`bg-${color}-500 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 h-full w-full`}>
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