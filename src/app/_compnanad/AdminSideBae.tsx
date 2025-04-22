import Link from "next/link";
import React from "react";
import { FaUserCog, FaRobot, FaCog, FaTachometerAlt } from "react-icons/fa";
import { usePathname } from "next/navigation"; // Import useRouter
import { FaAmazonPay } from "react-icons/fa6";

const AdminSideBae = () => {
  return (
    <div className="h-screen sticky top-0 bg-white shadow-lg group transition-all duration-200 w-14 hover:w-48 flex flex-col items-center py-6 space-y-3 z-10">
      <SidebarItem
        icon={<FaTachometerAlt />}
        label="Dashboard"
        href="/dashboard"
      />
      <SidebarItem
        icon={<FaUserCog />}
        label="Manage Users"
        href="/manage-users"
      />
      <SidebarItem icon={<FaRobot />} label="View Bots" href="/view-bots" />
      <SidebarItem
        icon={<FaAmazonPay />}
        label="Funds History"
        href="/payments"
      />
    </div>
  );
};

export default AdminSideBae;

const SidebarItem = ({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) => {
  const pathname = usePathname(); // Get the current route using useRouter
  const isActive = pathname === href; // Check if the current route matches the href

  return (
    <Link
      href={href}
      className={`group-hover:w-full w-full transition-all duration-200 ${
        isActive ? "bg-gray-200 text-gray-800" : ""
      }`}>
      <div
        className={`flex items-center gap-4 w-full px-4 py-2 text-sm font-medium ${
          isActive ? "text-gray-800" : "text-gray-700"
        } hover:bg-gray-100`}>
        <div className="text-xl">{icon}</div>
        <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {label}
        </span>
      </div>
    </Link>
  );
};
