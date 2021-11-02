import * as path from "path";
import moduleAlias from "module-alias";

const rootPath = path.resolve(__dirname, "../..");

moduleAlias.addAliases({
  "@src": path.join(rootPath, "src"),
  "@test": path.join(rootPath, "test"),
});
