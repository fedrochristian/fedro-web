/**
 * Components mapped into the MDX scope. These are the only custom JSX names
 * available inside essay .mdx files (per PRD §7.3 supported components).
 */
import { Callout } from "./Callout";
import { PullQuote } from "./PullQuote";
import { Figure } from "./Figure";
import { YouTubeEmbed } from "./YouTubeEmbed";
import { TwoHorizons } from "./TwoHorizons";
import { TheChoice } from "./TheChoice";

export const mdxComponents = {
  Callout,
  PullQuote,
  Figure,
  YouTubeEmbed,
  TwoHorizons,
  TheChoice,
};

export { Callout, PullQuote, Figure, YouTubeEmbed, TwoHorizons, TheChoice };
