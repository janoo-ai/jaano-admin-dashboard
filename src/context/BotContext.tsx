// @/context/BotContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type Bot = {
  ui: {
    refpdftext: boolean;
    BotName: string;
    BotLogoUrl: string;
    OuterFrameColor: string;
    BotNameHeadingTxtColor: string;
    FormBgColor: string;
    FormHeadingTxtColor: string;
    FormInputTxtColor: string;
    UserMessagebgColor: string;
    UserMessageTextColor: string;
    FormSkipButton: boolean;
    FormMobileButton: boolean;
    GenralIntroFromBot: string;
    BotMessageBeforeUserDetailsForm: string;
    BotMessageAfterGettingDetailsForm: string;
    GenralThankyouMessageToEndChat: string;
  };
  channelIntegration: any[];
  botName: string;
  reranking: boolean;
  queryExpansion: boolean;
  resources: any[];
  createdBy: string;
  botId: string;
  createdAt: string;
  templeQues: any[];
};

type BotContextType = {
  bots: Bot[];
  setBots: React.Dispatch<React.SetStateAction<Bot[]>>;
  fetchBots: () => Promise<void>;
  selectedBot: Bot | null;
  setSelectedBot: React.Dispatch<React.SetStateAction<Bot | null>>;
};

const BotContext = createContext<BotContextType | undefined>(undefined);

export const BotProvider = ({ children }: { children: ReactNode }) => {
  const [bots, setBots] = useState<Bot[]>([]);
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);

  const fetchBots = async () => {
    try {
      const res = await fetch("/api/bots");
      const data = await res.json();
      setBots(data.bots);
    } catch (error) {
      console.error("Failed to fetch bots:", error);
    }
  };

  useEffect(() => {
    if (bots.length === 0) fetchBots();
  }, []);

  return (
    <BotContext.Provider
      value={{ bots, setBots, fetchBots, selectedBot, setSelectedBot }}>
      {children}
    </BotContext.Provider>
  );
};

export const useBotContext = (): BotContextType => {
  const context = useContext(BotContext);
  if (!context) {
    throw new Error("useBotContext must be used inside a BotProvider");
  }
  return context;
};
