import { NodeVM } from "vm2";
import { z } from "zod";

export const pluginManifestSchema = z.object({
  name: z.string(),
  slug: z.string(),
  version: z.string(),
  author: z.string(),
  description: z.string(),
  entrypoint: z.string(),
  permissions: z.array(z.string()),
  configSchema: z.record(z.any()).optional()
});

export type PluginManifest = z.infer<typeof pluginManifestSchema>;

export function runPlugin(code: string, api: Record<string, unknown>) {
  const vm = new NodeVM({
    console: "redirect",
    sandbox: { api },
    require: false
  });

  return vm.run(code, "plugin.js");
}

