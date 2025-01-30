import React from 'react';

type DataCardProps = {
  color: 'indigo' | 'green' | 'blue' | 'red' | 'purple' | 'pink' | 'yellow';
  count: string | number;
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const DataCard: React.FC<DataCardProps> = ({
  color,
  count,
  title,
  icon: Icon,
}) => {
  return (
    <div className="border p-4 rounded-sm cursor-pointer border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark h-full">
      <div className="flex items-center justify-between p-6 h-full">
        <div className="flex flex-col justify-center">
          <span className={`text-2xl font-bold text-${color}-600`}>
            {count}
          </span>
          <h3 className={`text-${color}-600 text-sm mt-1`}>{title}</h3>
        </div>
        <div className={`p-4 rounded-full bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );
};

export default DataCard;
