/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {
        relay: {
            // This should match relay.config.js
            src: "./",
            language: "typescript", // "javascript" | "typescript" | "flow"
            schema: "./graphql/schema.graphql",
            excludes: ["**/node_modules/**", "**/__mocks__/**", "**/__generated__/**", "./composites/**"],
        },
    },
    webpack: config => {
        config.externals.push('pino-pretty', 'lokijs', 'encoding')
        return config
    }
};

export default nextConfig;
