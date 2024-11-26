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
    name: "Dark / Yellow",
    colors: ["#1c1c1c", "#f5ab57"],
  },
  {
    name: "Light / Green",
    colors: ["#f2ede5", "#3e8a3d"],
  },
  {
    name: "Red / White",
    colors: ["#c12900", "#f2ede5"],
  },
];
