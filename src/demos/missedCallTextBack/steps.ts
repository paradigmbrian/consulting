import {
  FaPhoneSlash,
  FaSms,
  FaComments,
  FaCalendarCheck,
  FaBell,
  FaChartLine,
} from "react-icons/fa";
import type { DemoStep } from "../shared/types";

export const steps: DemoStep[] = [
  { id: "missed-call", label: "Missed call", Icon: FaPhoneSlash },
  { id: "text-back", label: "Instant text-back", Icon: FaSms },
  { id: "conversation", label: "Conversation", Icon: FaComments, isAi: true },
  { id: "book", label: "Book & dispatch", Icon: FaCalendarCheck, isAi: true },
  { id: "owner-alert", label: "Owner alert", Icon: FaBell },
  { id: "results", label: "Results", Icon: FaChartLine },
];
