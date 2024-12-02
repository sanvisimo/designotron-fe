import { Animation } from "@lottie-animation-community/lottie-types";
import collab from "@/lib/json/undamento_collab.json";
import event from "@/lib/json/undamento_evento.json";
import album from "@/lib/json/undamento_nuovo_album.json";
import rotation from "@/lib/json/undamento_nuovo_album_rotazione.json";
import tour from "@/lib/json/undamento_tour.json";
import musica from "@/lib/json/undamento_tour_musica.json";
import { Palette, Template } from "@/lib/types";

export const animations: Template[] = [
  {
    id: 1,
    animation: album as Animation,
    title: "Album Release",
    screenshot: "undamento_nuovo_album.png",
  },
  {
    id: 2,
    animation: event as Animation,
    title: "Event",
    screenshot: "undamento_evento.png",
  },
  {
    id: 3,
    animation: collab as Animation,
    title: "Collaborazioni",
    screenshot: "undamento_collab.png",
  },
  {
    id: 4,
    animation: rotation as Animation,
    title: "Rotation",
    screenshot: "undamento_nuovo_album_rotazione.png",
  },
  {
    id: 5,
    animation: tour as Animation,
    title: "Tour",
    screenshot: "undamento_tour.png",
  },
  {
    id: 6,
    animation: musica as Animation,
    title: "Tour Musica",
    screenshot: "undamento_tour.png",
  },
];
export const palettes: Palette[] = [
  {
    id: 0,
    name: "Black",
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
    color: "#3b7ae6",
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
    color: "#400d12",
    exclude: [5, 0],
  },
  {
    id: 6,
    name: "Green",
    color: "#3e8a3d",
    exclude: [3, 4, 5, 6],
  },
];

/*
0.933
1(pin):0.914
2(pin):0.882

0(pin):0.949019667682
1(pin):0.929411824544
2(pin):0.898039275525
 */
