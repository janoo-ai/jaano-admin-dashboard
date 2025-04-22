// app/manage-users/[user_id]/page.tsx
"use client";

import React from "react";
import { useUserContext } from "@/context/UserContext";
import { HiMiniUsers } from "react-icons/hi2";
import { Card, CardContent } from "@/components/ui/card";
import AdminSideBae from "@/app/_compnanad/AdminSideBae";

const Page = () => {
  const { selectedUser } = useUserContext();
  console.log(selectedUser);

  if (!selectedUser) {
    return <div>Loading...</div>;
  }

  const categorizedUserProperties = {
    "Account Info": [
      { label: "Email", value: selectedUser.email },
      { label: "User ID", value: selectedUser.userId },
      { label: "Created At", value: selectedUser.createdAt },
      { label: "Updated At", value: selectedUser.updatedAt },
    ],
    "Plan Details": [
      {
        label: "Plan",
        value:
          selectedUser.plan?.type[0]?.toUpperCase() +
          selectedUser.plan?.type?.slice(1).toLowerCase(),
      },
      { label: "Plan Created At", value: selectedUser.plan?.createdAt },
      { label: "Plan Expiry", value: selectedUser.plan?.expiredAt },
    ],
  };

  const Activity = [
    { label: "Crawled Domain", value: selectedUser.crawl_domains },
    { label: "Payment History", value: selectedUser.paymentHistory },
  ];

  // Function to render values based on type
  const renderValue = (value: any): string => {
    // Handle empty or falsy values
    if (!value) return "<span>—</span>";

    // Check if the value is a valid date string and format it
    const dateValue = new Date(value);
    if (!isNaN(dateValue.getTime())) {
      return `<span>${dateValue.toLocaleString()}</span>`;
    }

    // Handle empty arrays
    if (Array.isArray(value) && value.length === 0) {
      return "<span>N/A</span>";
    }

    // Handle arrays with different data types
    if (Array.isArray(value)) {
      // Check if the array contains objects
      const isArrayOfObjects = value.every((item) => typeof item === "object");

      if (isArrayOfObjects) {
        // Get the headers from the first object in the array
        const objectKeys = Object.keys(value[0]);

        return `
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm border-collapse border border-gray-300">
          <thead class="bg-gray-100 text-left">
            <tr>
              ${objectKeys
                .map(
                  (key) =>
                    `<th class="border border-gray-300 px-3 py-2 font-semibold">${
                      key !== "acquirer_data" && key
                    }</th>`
                )
                .join("")}
            </tr>
          </thead>
          <tbody>
            ${value
              .map((item) => {
                return `
                  <tr>
  ${objectKeys
    .map((key) => {
      const valid_key = key !== "acquirer_data" && key; // Ensure we don't process 'acquirer_data'
      const cellValue = valid_key && item[valid_key];

      // Handling specific keys
      let displayValue = cellValue ?? "—"; // Default to "—" if value is null or undefined

      if (key === "amount" && typeof cellValue === "number") {
        // If the key is 'amount', divide the value by 100
        displayValue = (cellValue / 100).toFixed(2); // You can adjust the number of decimal places
      }

      if (key === "created_at" && typeof cellValue === "number") {
        // If the key is 'created_at', convert the timestamp to a readable date
        const date = new Date(cellValue * 1000); // Convert seconds to milliseconds
        displayValue = date.toLocaleString(); // Format the date as a human-readable string
      }

      return `
        <td class="border border-gray-300 px-3 py-2">${displayValue}</td>
      `;
    })
    .join("")}
</tr>

                `;
              })
              .join("")}
          </tbody>
        </table>
      </div>
    `;
      }

      // If it's not an array of objects, just render it as a list
      return `
    <ul class="list-disc list-inside text-sm space-y-1">
      ${value
        .map((item) => {
          if (typeof item === "string" || typeof item === "number") {
            return `<li>${item}</li>`;
          }
          return `<li>${item}</li>`;
        })
        .join("")}
    </ul>
  `;
    }

    // Handle objects (render as JSON with pretty formatting)
    if (typeof value === "object") {
      return `
        <pre class="whitespace-pre-wrap text-sm bg-gray-50 p-2 rounded-md border border-gray-200">
          ${JSON.stringify(value, null, 2)}
        </pre>
      `;
    }

    // Default case: return the value wrapped in a span
    return `<span>${value}</span>`;
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSideBae />

      {/* Main content */}
      <div className="flex-1 p-6 space-y-8">
        <div className="flex items-center gap-4">
          <HiMiniUsers className="min-w-12 h-12 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            {selectedUser?.email}
          </h1>
        </div>

        {Object.entries(categorizedUserProperties).map(
          ([section, properties]) => (
            <div key={section} className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                {section}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {properties.map(({ label, value }) => (
                  <Card key={label} className="shadow-lg rounded-xl">
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
          )
        )}

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Activity</h3>
          <div className="grid grid-cols-1  gap-6">
            {Activity.map(({ label, value }) => (
              <Card key={label} className="shadow-lg rounded-xl">
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
      </div>
    </div>
  );
};

export default Page;
