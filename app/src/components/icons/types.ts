/**
 * A hand-drawn category icon. `svg` is the inner markup of a `viewBox="0 0 48 48"` SVG: flat
 * shapes from the shared palette, each with a darker shade of the same hue for depth.
 */
export interface IconDef {
  label: string;
  /** Extra search words, lowercase. */
  tags: string[];
  svg: string;
}

export type IconSet = Record<string, IconDef>;
