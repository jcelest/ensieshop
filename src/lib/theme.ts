export type Season = "commerce";

export interface SeasonTheme {
  id: Season;
  name: string;
  primary: string;
  primaryGlow: string;
  navy: string;
  logo: string;
  logoAlt: string;
}

export const SEASONS: Record<Season, SeasonTheme> = {
  commerce: {
    id: "commerce",
    name: "Launch Catalog",
    primary: "#0F8F83",
    primaryGlow: "#7AD9CA",
    navy: "#173533",
    logo: "/images/organizer-product.png",
    logoAlt: "EnsieShop product mark",
  },
};

export const CURRENT_SEASON: Season = "commerce";

export function getCurrentTheme(): SeasonTheme {
  return SEASONS[CURRENT_SEASON];
}
