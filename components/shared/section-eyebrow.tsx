import { FC, ReactNode } from "react";

/**
 * Eyebrow pill above home section headings. Green literals stay: green is a
 * brand accent with no semantic token equivalent today.
 */
const SectionEyebrow: FC<{ children: ReactNode }> = ({ children }) => (
  <span className="inline-flex rounded-full border border-green-200 bg-green-100 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-green-700">
    {children}
  </span>
);

export default SectionEyebrow;
