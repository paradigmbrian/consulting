import {
  FaInbox,
  FaBrain,
  FaFileInvoiceDollar,
  FaUserCheck,
  FaPaperPlane,
  FaChartLine,
} from "react-icons/fa";
import type { DemoStep } from "../shared/types";

export const steps: DemoStep[] = [
  { id: "request", label: "Request comes in", Icon: FaInbox },
  { id: "understand", label: "Understand the job", Icon: FaBrain, isAi: true },
  { id: "build", label: "Build the quote", Icon: FaFileInvoiceDollar, isAi: true },
  { id: "review", label: "Owner review", Icon: FaUserCheck },
  { id: "send", label: "Send & accept", Icon: FaPaperPlane },
  { id: "results", label: "Results", Icon: FaChartLine },
];
