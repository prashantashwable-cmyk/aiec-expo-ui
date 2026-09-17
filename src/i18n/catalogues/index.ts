import { en } from "./en";
import { hi } from "./hi";
import { mr } from "./mr";

import type { Language } from "../../design/themes";
import type { Catalogue } from "./en";

export const CATALOGUES: Record<Language, Catalogue> = { en, mr, hi };

export type { Catalogue };
