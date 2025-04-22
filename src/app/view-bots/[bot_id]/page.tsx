"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { HiCpuChip } from "react-icons/hi2";
import { Card, CardContent } from "@/components/ui/card";
import { useBotContext } from "@/context/BotContext";
import AdminSideBae from "@/app/_compnanad/AdminSideBae";
import Image from "next/image";

const Page = () => {
  const { selectedBot } = useBotContext();
  const params = useParams();
  const botId = params?.bot_id;

  useEffect(() => {
    console.log("Viewing bot:", botId);
  }, [botId]);

  if (!selectedBot) {
    return <div className="p-6">Loading...</div>;
  }

  console.log(selectedBot);

  const botDetails = {
    "Bot Info": [
      { label: "Bot ID", value: selectedBot.botId },
      { label: "Name", value: selectedBot.botName },
      { label: "Created At", value: selectedBot.createdAt },
    ],
    Configuration: [
      { label: "Language Model", value: "GPT 4.0" },
      { label: "Reranking", value: true },
      { label: "Query Expansion", value: selectedBot.queryExpansion },
    ],
  };

  const renderValue = (value: any): string => {
    if (value === null || value === undefined || value === "") {
      return "<span>—</span>";
    }

    if (typeof value === "boolean") {
      return `<span>${value ? "Yes" : "No"}</span>`;
    }

    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return `<span>${date.toLocaleString()}</span>`;
    }

    if (Array.isArray(value)) {
      return `
        <ul class="list-disc list-inside text-sm space-y-1">
          ${value.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      `;
    }

    if (typeof value === "object") {
      return `
        <pre class="whitespace-pre-wrap text-sm bg-gray-50 p-2 rounded-md border border-gray-200">
          ${JSON.stringify(value, null, 2)}
        </pre>
      `;
    }

    return `<span>${value}</span>`;
  };

  const formatKey = (key: string) => {
    return key
      .replace(/([a-z])([A-Z])/g, "$1 $2") // insert space before capital letters
      .replace(/_/g, " ") // replace underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // capitalize first letters
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSideBae />

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-8">
        <div className="flex items-center gap-4">
          <HiCpuChip className="min-w-12 h-12 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            {selectedBot?.botName}
          </h1>
        </div>

        {Object.entries(botDetails).map(([section, properties]) => (
          <div key={section} className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              {section}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {properties.map(({ label, value }) => (
                <Card
                  key={label}
                  className="shadow-lg rounded-xl transition-transform hover:scale-[1.02]">
                  <CardContent className="space-y-2">
                    <p className="text-base font-medium text-gray-700">
                      {label}:
                    </p>
                    <p
                      className="text-sm break-words text-gray-600"
                      dangerouslySetInnerHTML={{
                        __html: renderValue(value),
                      }}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
        {selectedBot.ui && (
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-800">UI Config</h3>
            {Object.entries(selectedBot.ui).map(([key, value]) => {
              const label = formatKey(key);
              const lowerKey = key.toLowerCase();

              const isImageUrl =
                lowerKey.includes("logo") || lowerKey.includes("icon");
              const isColor =
                typeof value === "string" &&
                /^#([0-9A-F]{3}){1,2}$/i.test(value);

              return (
                <div
                  key={key}
                  className="p-3 bg-white rounded-md border border-gray-200 shadow-sm space-y-1">
                  <p className="text-sm font-medium text-gray-700">{label}</p>

                  {isImageUrl && typeof value === "string" ? (
                    <Image
                      src={value}
                      height={600}
                      width={800}
                      alt={label}
                      className="w-16 h-16 object-contain border rounded"
                    />
                  ) : isColor ? (
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: value }}
                      />
                      <span className="text-sm text-gray-600">{value}</span>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">
                      {typeof value === "object"
                        ? JSON.stringify(value, null, 2)
                        : String(value)}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
