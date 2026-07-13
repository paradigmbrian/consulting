import {
  FaDatabase,
  FaBrain,
  FaPenFancy,
  FaPaperPlane,
  FaBolt,
  FaChartLine,
} from "react-icons/fa";
import type { DemoStep } from "../shared/types";

export const steps: DemoStep[] = [
  { id: "data", label: "The week's raw numbers", Icon: FaDatabase },
  { id: "analyze", label: "Read the week", Icon: FaBrain, isAi: true },
  { id: "write", label: "Write the digest", Icon: FaPenFancy, isAi: true },
  { id: "deliver", label: "Deliver to the owner", Icon: FaPaperPlane },
  { id: "act", label: "One-tap action", Icon: FaBolt },
  { id: "results", label: "Results", Icon: FaChartLine },
];
