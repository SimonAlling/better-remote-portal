import {
    BuildConfig,
} from "userscripter/build";
import { Metadata } from "userscript-metadata";

import U from "./src/userscript";

export default function(hostname: string): (_: BuildConfig) => Metadata {
    return _ => ({
        name: U.name,
        version: U.version,
        description: U.description,
        author: U.author,
        match: [
            `*://${hostname}/*`,
        ],
        run_at: U.runAt,
    });
}
