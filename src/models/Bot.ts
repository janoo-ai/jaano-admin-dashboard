// models/Bot.ts
import mongoose, { Document, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

interface Bot extends Document {
  botId: string;
  logo?: string;
  botName: string;
  description?: string;
  version?: string;
  reranking: boolean;
  queryExpansion: boolean;
  resources: string[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  templeQues: { key: string; que: string }[];
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

const botSchema = new Schema<Bot>({
  botId: { type: String, default: uuidv4, unique: true, required: true },
  logo: { type: String },
  botName: { type: String, required: true },
  description: { type: String },
  version: { type: String },
  reranking: { type: Boolean, default: false },
  queryExpansion: { type: Boolean, default: false },
  resources: [{ type: String }],
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  templeQues: [
    {
      key: { type: String, default: uuidv4 },
      que: { type: String, required: true },
    },
  ],
  ui: {
    BotName: { type: String, default: "Chat With Us" },
    BotLogoUrl: {
      type: String,
      default: "https://example.com/default/chatbot.svg",
    },
    OuterFrameColor: { type: String, default: "#000000" },
    BotNameHeadingTxtColor: { type: String, default: "#ffffff" },
    FormBgColor: { type: String, default: "#000000" },
    FormHeadingTxtColor: { type: String, default: "#ffffff" },
    FormInputTxtColor: { type: String, default: "#000000" },
    UserMessagebgColor: { type: String, default: "#000000" },
    UserMessageTextColor: { type: String, default: "#ffffff" },
    FormSkipButton: { type: Boolean, default: false },
    FormMobileButton: { type: Boolean, default: true },
    GenralIntroFromBot: {
      type: String,
      default: "Hello there! 👋 It is so nice to chat with you!",
    },
    BotMessageBeforeUserDetailsForm: {
      type: String,
      default:
        "Before we get started, could you please provide me information about you by filling out the form.",
    },
    BotMessageAfterGettingDetailsForm: {
      type: String,
      default: "Thank you for providing the following details.",
    },
    GenralThankyouMessageToEndChat: {
      type: String,
      default: "Appreciate your time. Have a wonderful day ahead!",
    },
    refpdftext: { type: Boolean, default: true },
  },
  channelIntegration: [
    {
      type: String,
      enum: [
        "whatsapp",
        "fbmessenger",
        "instagram",
        "zendesk",
        "zapier",
        "slack",
        "telegram",
        "discord",
        "intercom",
      ],
      default: [],
    },
  ],
});

const BotModel = mongoose.models.Bot || mongoose.model<Bot>("Bot", botSchema);
export default BotModel;
