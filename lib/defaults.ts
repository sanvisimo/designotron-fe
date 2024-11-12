import { Animation } from "@lottie-animation-community/lottie-types";
import album_release from "@/lib/album_release.json";
import concert from "@/lib/concert.json";
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
    animation: concert as Animation,
    title: "Concert",
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
    colors: ["#3f8b3e", "#3e8a3d", "#f2ede5"],
  },
  {
    name: "Pink / Yellow",
    colors: ["#f63", "#dad", "#1c1c1c"],
  },
];
