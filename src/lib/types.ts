export type MousePosition = {
  x: number;
  y: number;
};

export type AnimeId =
  | "demonSlayer"
  | "silentVoice"
  | "attackOnTitan"
  | "spiritedAway"
  | "bunnyGirl";

export type AnimeTitle = {
  id: AnimeId;
  displayName: string;
};