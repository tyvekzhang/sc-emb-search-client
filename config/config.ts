import { defineConfig } from "@umijs/max";
import routes from "./routes";

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: "ScDifformer",
  },
  locale: {
    default: "en-US",
    baseSeparator: "-",
  },
  routes: routes,
  npmClient: "pnpm",
  tailwindcss: {},
});
