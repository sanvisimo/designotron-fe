import { Animation } from "@lottie-animation-community/lottie-types";
import collab from "@/lib/json/undamento_collab.json";
import event from "@/lib/json/undamento_evento.json";
import album from "@/lib/json/undamento_nuovo_album.json";
import { Palette, Template } from "@/lib/types";

export const animations: Template[] = [
  {
    id: 1,
    animation: album as Animation,
    title: "Album Release",
    screenshot: "Album_release.png",
  },
  {
    id: 2,
    animation: event as Animation,
    title: "Event",
    screenshot: "Event.png",
  },
  {
    id: 3,
    animation: collab as Animation,
    title: "Collaborazioni",
    screenshot: "undamento_collab.png",
  },
];
export const palettes: Palette[] = [
  {
    id: 0,
    name: "Dark / Yellow",
    color: "#1c1c1c",
    exclude: [0, 5],
  },
  {
    id: 1,
    name: "White",
    color: "#f2ede5",
    exclude: [1],
  },
  {
    id: 2,
    name: "Orange",
    color: "#f5ab57",
    exclude: [2],
  },
  {
    id: 3,
    name: "Cyan",
    color: "3b7aeb",
    exclude: [3, 4],
  },
  {
    id: 4,
    name: "Red",
    color: "#c12900",
    exclude: [4, 3],
  },
  {
    id: 5,
    name: "Burgundy",
    color: "#400D12",
    exclude: [5, 0],
  },
  {
    id: 6,
    name: "Green",
    color: "#3e8a3d",
    exclude: [3, 4, 5, 6],
  },
];
