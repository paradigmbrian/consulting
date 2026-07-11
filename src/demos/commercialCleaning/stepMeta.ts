import {
  FaBullseye,
  FaSearchLocation,
  FaFilter,
  FaPenFancy,
  FaPaperPlane,
  FaChartLine,
} from "react-icons/fa";
import type { IconType } from "react-icons";
import type { StepId } from "./DemoController";

export const STEP_META: Record<StepId, { label: string; Icon: IconType }> = {
  define: { label: "Define target", Icon: FaBullseye },
  discover: { label: "Discover", Icon: FaSearchLocation },
  enrich: { label: "Enrich & qualify", Icon: FaFilter },
  personalize: { label: "Personalize", Icon: FaPenFancy },
  send: { label: "Send", Icon: FaPaperPlane },
  results: { label: "Reply & results", Icon: FaChartLine },
};

/** The steps whose work is driven by Claude. */
export const AI_STEPS: readonly StepId[] = ["discover", "enrich", "personalize"];
