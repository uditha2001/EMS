import { useEffect, useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Legend,
    Tooltip,
} from "recharts";
import useApi from "../../api/api";

type Data = {
    name: string;
    value: number;
}

// Colors for the pie slices
const UserRolesDistribution = () => {
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF", "#FF6384", "#A28DFF"];
    const { getUsersCounts } = useApi();
    const [userCount, setUserCount] = useState<Record<string, number>>({});
    const [pieData, setPieData] = useState<{ name: string; value: number }[]>([]);
    const [remaining, setRemaining] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    useEffect(() => {
        getUsersCounts().then(users => {
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
        }
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


        }
        getuserData();

    }, [remaining, userCount]);


    return (
        <div className="w-full flex justify-center items-center flex-col  bg-white shadow-md rounded dark:bg-gray-800" >
            <h1 className="text-center font-bold">User Roles Distribution</h1>
            <PieChart width={400} height={400} className="justify-center">
                <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                >
                    {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </div>
    );
};

export default UserRolesDistribution;
