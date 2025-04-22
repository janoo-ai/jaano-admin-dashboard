"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import AdminSideBae from "../_compnanad/AdminSideBae";

type PlanStat = {
  _id: string;
  count: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState([
    { name: "Users", value: 0 },
    { name: "Bots", value: 0 },
  ]);

  const [userPlanData, setUserPlanData] = useState<
    { name: string; value: number }[]
  >([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch("/api/dashboard");
        const data = await res.json();

        // Set card stats
        setStats([
          { name: "Total Users", value: data.allusers },
          { name: "Total Bots", value: data.allbots },
        ]);

        // Plan-wise user data for chart
        const planStats = data.all_user_count_by_plan as PlanStat[];
        const formatted = planStats.map((plan) => ({
          name: plan._id || "Unknown",
          value: plan.count,
        }));

        setUserPlanData(formatted);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminSideBae />

      {/* Main Dashboard Content */}
      <div className="flex-1 p-4 md:p-8 space-y-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <Card key={idx} className="rounded-2xl shadow p-4">
              <CardContent>
                <p className="text-sm text-gray-500">{stat?.name}</p>
                <p className="text-xl text-end font-semibold">
                  {stat.value.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Users by Plan Chart */}
        <Card className="rounded-2xl shadow">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Users by Plan Type</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userPlanData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(val) => `${val} users`} />
                  <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
