import {
  FaUserPlus,
  FaPenFancy,
  FaClipboardCheck,
  FaPaperPlane,
  FaCalendarCheck,
  FaChartLine,
} from "react-icons/fa";
import type { DemoStep } from "../shared/types";

export const steps: DemoStep[] = [
  { id: "signup", label: "New customer booked", Icon: FaUserPlus },
  { id: "compose", label: "Write the welcome", Icon: FaPenFancy, isAi: true },
  {
    id: "packet",
    label: "Assemble the packet",
    Icon: FaClipboardCheck,
    isAi: true,
  },
  { id: "deliver", label: "Send to the customer", Icon: FaPaperPlane },
  { id: "schedule", label: "Book the first visit", Icon: FaCalendarCheck },
  { id: "results", label: "Results", Icon: FaChartLine },
];
