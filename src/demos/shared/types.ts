import type { IconType } from "react-icons";

export interface DemoStep {
  id: string;
  label: string;
  Icon: IconType;
  isAi?: boolean;
}
