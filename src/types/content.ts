// Content structures for the ozgur.design clone.

export interface SocialLink {
  name: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
}

/** Mono section label e.g. "01 / Recently". */
export interface SectionLabel {
  num: string;
  word: string;
}

export interface MetaItem {
  key: string; // Who / What / Where / How / When
  value: string;
}

export interface SelectedProject {
  title: string;
  category: string;
  href: string;
  /** index into THUMB_SVGS in components/thumbnails.tsx */
  thumbIndex: number;
}

export interface ArchivedEntry {
  title: string;
  category: string;
}

export interface TinkerItem {
  name: string;
  description: string;
  href?: string; // absent => placeholder card
  placeholder?: boolean;
  /** index into TINKER_SVGS in components/icons.tsx */
  iconIndex: number;
}

export interface TakeItem {
  date: string;
  title: string;
  category: string;
  href: string;
}

/** Generic label + heading + paragraphs section (Beginnings/Trajectory/Approach/Tools/Colophon). */
export interface TextSectionData {
  id: string;
  label: SectionLabel;
  heading: string;
  numeral: string;
  paragraphs: string[];
}
