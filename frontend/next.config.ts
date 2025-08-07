import type { NextConfig } from "next";
import { withContentlayer } from "next-contentlayer";

const nextConfig: NextConfig = {
  /* existing config options */
};

export default withContentlayer(nextConfig);
