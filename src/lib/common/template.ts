import * as fs from "fs";
import * as path from "path";

import * as handlebars from "handlebars";

import { TTemplateName } from "@/types/global";

export const GetTemplate = (name: TTemplateName, context: any): string => {
  const rootDir = process.cwd();
  const templatePath = path.join(rootDir, "hbs", `${name}.hbs`);
  const templateSource = fs.readFileSync(templatePath, "utf8");
  const template = handlebars.compile(templateSource);
  return template(context);
};
