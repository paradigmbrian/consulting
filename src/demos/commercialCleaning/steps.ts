import {
  FaBullseye,
  FaSearchLocation,
  FaFilter,
  FaPenFancy,
  FaPaperPlane,
  FaChartLine,
} from "react-icons/fa";
import type { DemoStep } from "../shared/types";

export const steps: DemoStep[] = [
  { id: "define", label: "Define target", Icon: FaBullseye },
  { id: "discover", label: "Discover", Icon: FaSearchLocation, isAi: true },
  { id: "enrich", label: "Enrich & qualify", Icon: FaFilter, isAi: true },
  { id: "personalize", label: "Personalize", Icon: FaPenFancy, isAi: true },
  { id: "send", label: "Send", Icon: FaPaperPlane },
  { id: "results", label: "Reply & results", Icon: FaChartLine },
];
