import { Animation } from "@lottie-animation-community/lottie-types";
import album_release from "@/lib/album_release.json";
import event from "@/lib/event.json";
import { Palette, Template } from "@/lib/types";

export const animations: Template[] = [
  {
    id: 1,
    animation: album_release as Animation,
    title: "Album Release",
    screenshot: "Album_release.png",
  },
  {
    id: 2,
    animation: event as Animation,
    title: "Event",
    screenshot: "Event.png",
  },
];
export const palettes: Palette[] = [
  {
    name: "Dark / Yellow",
    colors: ["#1c1c1c", "#f7ad57", "#f5ab57"],
  },
  {
    name: "Light / Green",
    colors: ["#f2ede5", "#3f8b3e", "#3e8a3d"],
  },
  {
    name: "Pink / Yellow",
    colors: ["#1c1c1c", "#f63", "#dad"],
  },
];
