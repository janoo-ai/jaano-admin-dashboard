//@/context/UserContextType
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type Plan = {
  createdAt: string;
  expiredAt: string;
  type: string;
};

type User = {
  _id: string;
  email: string;
  userId: string;
  plan: Plan;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  crawl_domains: [];
  paymentHistory: [];
};

type UserContextType = {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  fetchUsers: () => Promise<void>;
  selectedUser: User | null;
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>; // Add selectedUser and setter
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data.users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    if (users.length === 0) fetchUsers();
  }, []);

  return (
    <UserContext.Provider
      value={{ users, setUsers, fetchUsers, selectedUser, setSelectedUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used inside a UserProvider");
  }
  return context;
};
