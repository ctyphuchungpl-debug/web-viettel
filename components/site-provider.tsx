"use client";
import { createContext, useContext, type ReactNode } from "react";
import type { PublicSite } from "../lib/site-data";

const Context = createContext<PublicSite | null>(null);
export function SiteProvider({ value, children }: { value: PublicSite; children: ReactNode }) {
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useSite() {
  const content = useContext(Context);
  if (!content) throw new Error("Thiếu cấu hình nội dung.");
  return content;
}
