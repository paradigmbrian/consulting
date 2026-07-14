import {
  FaFileImport,
  FaSitemap,
  FaClone,
  FaSyncAlt,
  FaChartLine,
} from "react-icons/fa";
import type { DemoStep } from "../shared/types";

export const steps: DemoStep[] = [
  { id: "intake", label: "The job just landed", Icon: FaFileImport },
  { id: "map", label: "Shape it for each tool", Icon: FaSitemap, isAi: true },
  { id: "reconcile", label: "Catch the duplicate", Icon: FaClone, isAi: true },
  { id: "push", label: "Write to every tool", Icon: FaSyncAlt },
  { id: "results", label: "Results", Icon: FaChartLine },
];
