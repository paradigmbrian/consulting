import type { ReactNode } from "react";
import "../demos/shared/demoTokens.css";
import "./showcase.css";

interface ShowcaseFrameProps {
  children: ReactNode;
  layered?: boolean;
}

/**
 * Wraps a static demo-UI snippet in a framed "product shot". `demo-scope`
 * supplies the light `--demo-*` tokens (see DemoShell.css) so the reused demo
 * classes render correctly; `wf-shot` is the card frame.
 */
const ShowcaseFrame = ({ children, layered = false }: ShowcaseFrameProps) => (
  <div className={layered ? "demo-scope wf-shot wf-shot-layered" : "demo-scope wf-shot"}>
    {/* These are product mockups with sample data, not real client results —
        labelled so the figures inside are never mistaken for sourced stats. */}
    <span className="wf-shot-tag">Illustrative</span>
    {children}
  </div>
);

export default ShowcaseFrame;
