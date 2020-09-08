import { Operation, operation } from "userscripter/lib/operations";

import assembleLinks from "./operations/assemble-links";

const OPERATIONS: ReadonlyArray<Operation<any>> = [
    operation({
        description: "assemble link(s)",
        condition: w => w.location.pathname.includes("DanaInfo"),
        dependencies: {
            body: "body",
        },
        action: assembleLinks,
    }),
];

export default OPERATIONS;
