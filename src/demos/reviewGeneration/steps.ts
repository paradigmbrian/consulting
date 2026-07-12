import {
  FaSpa,
  FaSms,
  FaCodeBranch,
  FaStar,
  FaShieldAlt,
  FaChartLine,
} from "react-icons/fa";
import type { DemoStep } from "../shared/types";

export const steps: DemoStep[] = [
  { id: "appointment", label: "Appointment done", Icon: FaSpa },
  { id: "request", label: "Request the review", Icon: FaSms },
  { id: "route", label: "Read & route", Icon: FaCodeBranch, isAi: true },
  { id: "google", label: "Happy → Google", Icon: FaStar, isAi: true },
  { id: "caught", label: "Unhappy → caught", Icon: FaShieldAlt },
  { id: "results", label: "Results", Icon: FaChartLine },
];
