import {
  FaFileInvoiceDollar,
  FaCalendarAlt,
  FaPenFancy,
  FaPaperPlane,
  FaCheckCircle,
  FaChartLine,
} from "react-icons/fa";
import type { DemoStep } from "../shared/types";

export const steps: DemoStep[] = [
  { id: "overdue", label: "Invoice slips past due", Icon: FaFileInvoiceDollar },
  { id: "plan", label: "Plan the follow-up", Icon: FaCalendarAlt, isAi: true },
  { id: "draft", label: "Draft the reminders", Icon: FaPenFancy, isAi: true },
  { id: "send", label: "Send & escalate", Icon: FaPaperPlane },
  { id: "paid", label: "Paid", Icon: FaCheckCircle },
  { id: "results", label: "Results", Icon: FaChartLine },
];
