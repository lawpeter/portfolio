import { ImageResponse } from "next/og";
export const alt = "Peter Law | Mechanical Engineering + Computer Science";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(<div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%", height: "100%", background: "#141312", color: "#e9e6de", padding: 80 }}><div style={{ color: "#f15a2f", fontSize: 26 }}>PETERLAW.DEV</div><div style={{ fontSize: 88, marginTop: 32 }}>Peter Law</div><div style={{ fontSize: 34, marginTop: 24 }}>Mechanical Engineering + Computer Science</div><div style={{ fontSize: 26, color: "#8f8b83", marginTop: 40 }}>Simulation / Embedded Systems / Integration</div></div>, size);
}
