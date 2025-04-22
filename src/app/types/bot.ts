// types/bot.ts
export interface Bot {
  botId: string;
  botName: string;
  description: string;
  version: string;
  logo: string;
  reranking: boolean;
  queryExpansion: boolean;
  resources: string[];
  createdBy: string;
  createdAt: Date;
  templeQues: Array<{
    key: string;
    que: string;
  }>;
  ui: {
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
    refpdftext: boolean;
  };
  channelIntegration: string[];
}
