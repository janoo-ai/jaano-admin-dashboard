// @app/payments/page.tsx

"use client";
import React, { useEffect, useState } from "react";
import AdminSideBae from "../_compnanad/AdminSideBae";

interface SubscriberData {
  userId: string;
  email: string;
  payment: {
    order_id: string;
    amount: number;
    [key: string]: any; // any extra Razorpay data
  };
}

const Page = () => {
  const [subscribers, setSubscribers] = useState<SubscriberData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const res = await fetch("/api/subscribe?limit=50&page=0");
        const result = await res.json();
        console.log(result);
        setSubscribers(result.data);
      } catch (error) {
        console.error("Failed to fetch subscriber data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, []);

  console.log("subscribers", subscribers);
  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminSideBae />

      <div className="flex-1 p-4 md:p-8 space-y-6">
        <h1 className="text-2xl font-bold">Subscriber Payments</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 font-semibold">
                <tr>
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">User ID</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Mobile No.</th>
                  <th className="p-2 border">Order ID</th>
                  <th className="p-2 border">Amount</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <th className="p-2 border">
                      {new Date(sub.payment.created_at * 1000).toLocaleString(
                        "en-IN",
                        {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }
                      )}
                    </th>

                    <td className="p-2 border">{sub.userId}</td>
                    <td className="p-2 border">{sub.email}</td>
                    <th className="p-2 border">{sub.payment.contact}</th>
                    <td className="p-2 border">{sub.payment.order_id}</td>
                    <td className="p-2 border font-semibold">
                      {sub.payment?.currency?.toLowerCase() === "usd"
                        ? "$"
                        : "₹"}{" "}
                      {sub.payment.amount / 100}{" "}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
