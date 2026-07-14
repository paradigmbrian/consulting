import {
  FaClipboardList,
  FaUserCheck,
  FaRoute,
  FaTruck,
  FaCommentDots,
  FaChartLine,
} from "react-icons/fa";
import type { DemoStep } from "../shared/types";

export const steps: DemoStep[] = [
  { id: "queue", label: "The morning job pile", Icon: FaClipboardList },
  { id: "assign", label: "Match jobs to techs", Icon: FaUserCheck, isAi: true },
  { id: "route", label: "Route each van", Icon: FaRoute, isAi: true },
  { id: "dispatch", label: "Push to the crew", Icon: FaTruck },
  { id: "notify", label: "Notify the customer", Icon: FaCommentDots },
  { id: "results", label: "Results", Icon: FaChartLine },
];
