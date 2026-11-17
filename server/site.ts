import { cache } from "react";
import { publicContent } from "../lib/site-data";
import { readContent } from "./db";

export const getPublicSite = cache(async () => publicContent((await readContent()).data));
