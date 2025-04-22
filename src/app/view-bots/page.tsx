"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import AdminSideBae from "../_compnanad/AdminSideBae";
import Link from "next/link";
import { useBotContext } from "@/context/BotContext";

const ViewBotsPage = () => {
  const { bots, fetchBots, setSelectedBot } = useBotContext();
  const [filteredBots, setFilteredBots] = useState(bots);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  useEffect(() => {
    if (bots.length === 0) {
      fetchBots();
    }
  }, [fetchBots, bots.length]);

  useEffect(() => {
    let result = [...bots];

    // Filter
    if (search.trim()) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(
        (bot) =>
          bot?.botName?.toLowerCase().includes(lowerSearch) ||
          bot?.botId?.toLowerCase().includes(lowerSearch)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortOption === "a-z") return a.botName.localeCompare(b.botName);
      if (sortOption === "z-a") return b.botName.localeCompare(a.botName);
      if (sortOption === "oldest") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
      // default: newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setFilteredBots(result);
  }, [search, sortOption, bots]);

  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminSideBae />

      <div className="flex-1 p-4 md:p-8 space-y-6">
        <h1 className="text-2xl font-bold">Bots</h1>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <Input
            type="text"
            placeholder="Search by name or UUID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:max-w-sm"
          />
          <Select
            value={sortOption}
            onValueChange={(value) => setSortOption(value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="a-z">A-Z</SelectItem>
              <SelectItem value="z-a">Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBots.length > 0 ? (
            filteredBots.map((bot) => (
              <Link
                key={bot.botId}
                onClick={() => setSelectedBot(bot)}
                href={`/view-bots/${bot.botId}`}>
                <Card className="bg-white rounded-lg shadow-lg gap-0">
                  <CardHeader className="text-center p-4 py-2">
                    <Image
                      src={bot.ui?.BotLogoUrl || "/placeholder.png"}
                      alt={bot.botName || "Bot Logo"}
                      width={96}
                      height={96}
                      className="object-contain mx-auto mb-4 rounded"
                      unoptimized
                    />
                    <CardTitle className="text-xl font-semibold">
                      {bot.botName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center p-4 py-2">
                    <p className="text-sm mb-2">
                      UUID: <strong>{bot.botId}</strong>
                    </p>
                    <p className="text-sm mb-2">
                      Created At:{" "}
                      <strong>
                        {bot.createdAt
                          ? new Date(bot.createdAt).toLocaleString()
                          : new Date().toLocaleString()}
                      </strong>
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <p>No bots found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewBotsPage;
