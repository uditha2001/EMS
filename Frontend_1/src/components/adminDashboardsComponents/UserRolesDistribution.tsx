import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import useApi from '../../api/api';

// Register required Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale
);

type Data = {
  name: string;
  value: number;
};

const UserRolesDistribution = () => {
  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#A28DFF',
    '#FF6384',
    '#A28DFF',
  ];
  const { getUsersCounts } = useApi();
  const [userCount, setUserCount] = useState<Record<string, number>>({});
  const [pieData, setPieData] = useState<{ name: string; value: number }[]>([]);
  const [remaining, setRemaining] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getUsersCounts().then((users) => {
      if (users) {
        setUserCount(users);
      }
    });
  }, []);

  useEffect(() => {
    const getRemainingUsers = () => {
      let remainingUsers = 0;
      Object.entries(userCount).forEach(([key, value]) => {
        if (key === 'TOTAL') {
          setTotal(value);
        }
      });
      Object.entries(userCount).forEach(([key, value]) => {
        if (key !== 'TOTAL' && key !== 'ADMINS') {
          remainingUsers += value;
        }
      });
      let restofUsers = total - remainingUsers;
      setRemaining(restofUsers);
    };
    getRemainingUsers();
  }, [userCount]);

  useEffect(() => {
    const getuserData = async () => {
      if (Object.keys(userCount).length > 0) {
        const data: Data[] = Object.entries(userCount)
          .filter(([key]) => key !== 'TOTAL')
          .filter(([key]) => key !== 'ADMINS')
          .map(([key, value]) => ({
            name: key,
            value,
          }));
        data.push({ name: 'REST', value: remaining });
        setPieData(data);
      }
    };
    getuserData();
  }, [remaining, userCount]);

  const chartData = {
    labels: pieData.map((entry) => entry.name),
    datasets: [
      {
        data: pieData.map((entry) => entry.value),
        backgroundColor: COLORS,
        hoverOffset: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) =>
            `${tooltipItem.label}: ${tooltipItem.raw} users (${((tooltipItem.raw / total) * 100).toFixed(1)}%)`,
        },
        bodyFont: { size: 12 },
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#ffffff',
        borderWidth: 0.5,
      },
      legend: {
        position: 'bottom' as const,
        labels: {
          font: { size: 10 },
          usePointStyle: true,
          padding: 15,
          boxWidth: 10,
          color: '#a0aec0',
        },
      },
      title: {
        display: true,
        text: 'User Roles Distribution',
        font: { size: 16, weight: 'bold' as const },
        padding: { top: 10, bottom: 20 },
        color: '#a0aec0',
      },
    },
    cutout: '60%',
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  };

  const getTotalUsers = () => {
    return total || 0;
  };

  return (
    <div >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">User Roles</h2>
        <div className="text-sm bg-blue-50 dark:bg-gray-700 text-blue-700 dark:text-gray-300 px-3 py-1 rounded-lg">
          Total: {getTotalUsers()} users
        </div>
      </div>

      {pieData.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500 dark:text-gray-400">Loading user data...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-3 h-64 md:h-80">
            <Doughnut data={chartData} options={chartOptions} />
          </div>

          {/* <div className="md:col-span-3 overflow-auto">
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Distribution</h3>
              <div className="space-y-2">
                {pieData.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <div className="flex items-center">
                      <span 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></span>
                      <span className="text-gray-800 dark:text-gray-300">{item.name}</span>
                    </div>
                    <div className="font-medium dark:text-gray-300">
                      {item.value} ({((item.value / total) * 100).toFixed(1)}%)
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default UserRolesDistribution;
