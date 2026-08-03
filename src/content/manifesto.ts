/**
 * Manifesto beats — the "Reckoning" landing copy.
 * Source: PRD Appendix B (starter copy, may be refined later without changing structure).
 * Each beat maps to a section per PRD §7.1.
 */
export type ManifestoBeatId =
  | "hinge"
  | "two-stories"
  | "at-your-door"
  | "burden"
  | "fork"
  | "bridge"
  | "hand-back";

export const manifesto = {
  hinge: {
    id: "hinge",
    kicker: "Beat I — The Tipping Point",
    title: "We are at the tipping point.",
    body: [
      "We are living in the exponetial age, Intelligence & Energy are becoming abundant, Biotech and Space are no longer Sci-Fi. The forces that bottlenecked every human ambition are coming loose at the same time.",
      "For three hundred thousand years of our evolution arc, human has progressed without an urgency to ask the most important questions. That is over. For the first time ever, we must choose what it means to be a human.",
    ],
  },
  twoStories: {
    id: "two-stories",
    kicker: "Beat II — Two Stories",
    title: "Two stories. Both told by serious people.",
    lede: "Anyone who gives you only one is selling something.",
    panels: [
      {
        label: "Abundance",
        body: "Disease cured. Energy free. Work optional. The end of scarcity. The light of consciousness extended to the stars.",
      },
      {
        label: "Loss of control",
        body: "Power concentrates. Meaning evaporates. Truth becomes synthetic. The machine writes the prayer and the prayer wins.",
      },
    ],
  },
  atYourDoor: {
    id: "at-your-door",
    kicker: "Beat III — At Your Door",
    title: "Whatever comes, arrives personally.",
    body: "Not as a forecast. Not as a graph. As a question about your work, your purpose, your children, your faith, and your sense of who you are.",
    stakes: [
      "Your work",
      "Your purpose",
      "Your children",
      "Your faith",
      "Your sense of who you are",
    ],
  },
  burden: {
    id: "burden",
    kicker: "Beat IV — The Burden",
    title: "The deepest temptation of abundance is not that machines enslave us.",
    body: "It is that we hand over our freedom gladly in exchange for never having to choose again. The Grand Inquisitor offered the same trade. Most of us took it.",
  },
  fork: {
    id: "fork",
    kicker: "Beat V — The Fork",
    title: "Embrace. Ignore. Fight.",
    lede: "Even doing nothing is an answer.",
    paths: [
      {
        slug: "embrace",
        label: "Embrace",
        posture: "Build the curve. Move with it.",
        body: "Accept the new world is coming and stand near the wheel. Make the tools, draw the maps, take the responsibility.",
      },
      {
        slug: "ignore",
        label: "Ignore",
        posture: "Look away. Live now.",
        body: "Refuse to plan for a future you can't control. Tend your garden. The graph happens with or without your attention.",
      },
      {
        slug: "fight",
        label: "Fight",
        posture: "Slow it. Bend it. Refuse it.",
        body: "Build the friction. Reframe the question. The future is not given — it can still be argued for, and against.",
      },
    ],
  },
  bridge: {
    id: "bridge",
    kicker: "Beat VI — Where this gets serious",
    title: "Three pillars. Long-form. No theatre.",
    body: "The Force, the Break, and the Reckoning. Read where the curve actually bends.",
  },
  handBack: {
    id: "hand-back",
    kicker: "Beat VII — The Hand Back",
    title: "The future is not a forecast you receive. It is a position you take.",
    body: "We will teach you to read the tide. Then we will hand the choice back to you.",
  },
} as const;
