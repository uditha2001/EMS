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
  LinearScale,
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
  const [remaining, setRemaining] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

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

  // Prepare Chart.js data
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

  // Chart.js options (including reduced font size)
  const chartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) =>
            `${tooltipItem.label}: ${tooltipItem.raw}`,
        },
        bodyFont: { size: 10 }, // Adjust the font size for tooltip text
      },
      legend: {
        labels: {
          font: { size: 10 }, // Adjust the font size for legend
        },
      },
      title: {
        display: true,
        text: 'User Roles Distribution',
        font: { size: 16 }, // Title font size
      },
    },
  };

  return (
    <div className="p-4 rounded-sm border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <Doughnut
        data={chartData}
        options={chartOptions}
        width={400}
        height={400}
      />
    </div>
  );
};

export default UserRolesDistribution;
