import * as AppRootPath from "app-root-path";
import webpack from "webpack";

import {
    createWebpackConfig,
    DEFAULT_BUILD_CONFIG,
    DEFAULT_METADATA_SCHEMA,
} from "userscripter/build";
import METADATA from "./metadata";
import * as CONFIG from "./src/config";
import * as SITE from "./src/site";
import U from "./src/userscript";

const ENV_VAR_HOSTNAME = "REMOTE_PORTAL_HOSTNAME";
const hostname = process.env[ENV_VAR_HOSTNAME];

const w = createWebpackConfig({
    buildConfig: {
        ...DEFAULT_BUILD_CONFIG({
            rootDir: AppRootPath.path,
            id: U.id,
            now: new Date(),
        }),
        sassVariables: { CONFIG, SITE },
    },
    metadata: METADATA(hostname || ""),
    metadataSchema: DEFAULT_METADATA_SCHEMA,
    env: process.env,
});

class HostnamePlugin {
    constructor(private readonly envVarName: string) {}
    public apply(compiler: webpack.Compiler) {
        compiler.hooks.afterCompile.tap(
            HostnamePlugin.name,
            compilation => {
                if (hostname === undefined || hostname === "") {
                    compilation.errors.push([
                        `environment`,
                        `You must specify a hostname, for example:`,
                        ``,
                        `    export ${this.envVarName}=portal.example.com`,
                        ``,
                    ].join("\n"));
                }
            }
        );
    }
}

w.plugins?.push(new HostnamePlugin(ENV_VAR_HOSTNAME));

export default w;
