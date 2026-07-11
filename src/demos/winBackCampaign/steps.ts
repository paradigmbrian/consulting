import {
  FaFileImport,
  FaFilter,
  FaPenFancy,
  FaPaperPlane,
  FaInbox,
  FaChartLine,
} from "react-icons/fa";
import type { DemoStep } from "../shared/types";

export const steps: DemoStep[] = [
  { id: "import", label: "Import list", Icon: FaFileImport },
  { id: "segment", label: "Segment", Icon: FaFilter, isAi: true },
  { id: "offer", label: "Craft offer", Icon: FaPenFancy, isAi: true },
  { id: "send", label: "Send", Icon: FaPaperPlane },
  { id: "replies", label: "Replies & bookings", Icon: FaInbox },
  { id: "results", label: "Results", Icon: FaChartLine },
];
