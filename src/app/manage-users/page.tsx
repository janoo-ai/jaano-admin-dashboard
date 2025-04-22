//app/manage-users/page.txs
"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FaRegCircleUser } from "react-icons/fa6";
import AdminSideBae from "../_compnanad/AdminSideBae";
import Link from "next/link";
import { useUserContext } from "@/context/UserContext"; // Import context

type User = {
  _id: string;
  email: string;
  plan: { type: string };
  status: "active" | "inactive";
  createdAt: string;
};

const ManageUsersPage = () => {
  const { setSelectedUser, users } = useUserContext(); // Get context
  const [searchTerm, setSearchTerm] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users;

    // Search
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (user) =>
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user._id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by Plan
    if (planFilter !== "all") {
      filtered = filtered.filter((user) => user.plan.type === planFilter);
    }

    // Sort
    return filtered.sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      if (sortBy === "oldest") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
      if (sortBy === "az") {
        return a.email.localeCompare(b.email);
      }
      if (sortBy === "za") {
        return b.email.localeCompare(a.email);
      }
      return 0;
    });
  }, [users, searchTerm, planFilter, sortBy]);

  const uniquePlans = Array.from(new Set(users.map((user) => user.plan.type)));

  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminSideBae />

      <div className="flex-1 p-4 md:p-8 space-y-6">
        <h1 className="text-2xl font-bold">All Users</h1>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <Input
            placeholder="Search by email or UUID"
            className="max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select onValueChange={setPlanFilter} value={planFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              {uniquePlans.map((plan) => (
                <SelectItem key={plan} value={plan}>
                  {plan}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={setSortBy} value={sortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="az">A - Z (Email)</SelectItem>
              <SelectItem value="za">Z - A (Email)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Users List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedUsers.map((user) => (
            <Card key={user._id} className="rounded-2xl shadow py-2">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-start gap-2 items-center">
                  <FaRegCircleUser className="min-w-12 h-12" />
                  <h2 className="text-lg font-semibold break-all">
                    {user.email}
                  </h2>
                </div>
                <p className="text-base text-end text-gray-500">
                  Plan:{" "}
                  <strong>
                    {user.plan?.type[0]?.toUpperCase() +
                      user.plan?.type?.slice(1)?.toLowerCase()}
                  </strong>
                </p>
                <p className="text-xs text-end text-muted-foreground">
                  Created:{" "}
                  <strong>{new Date(user.createdAt).toLocaleString()}</strong>
                </p>
                <div className="pt-2 flex flex-1 justify-end">
                  <Link
                    onClick={() => setSelectedUser(user)} // Set selected user in context
                    href={`/manage-users/${user._id}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="cursor-pointer">
                      View
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageUsersPage;
