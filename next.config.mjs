/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "api.iconify.design",
            },
            {
                protocol: "http",
                hostname: "localhost",
            },
            {
                protocol: "http",
                hostname: "192.168.1.12",
            }
        ],
    },
    // Transpile packages that use modern JavaScript syntax
    transpilePackages: [
        '@react-three/drei',
        '@react-three/fiber',
        'three',
        'three-stdlib',
    ],
    webpack: (config) => {
        // Ensure proper handling of ES modules in node_modules
        config.resolve.extensionAlias = {
            '.js': ['.js', '.ts', '.tsx'],
            '.jsx': ['.jsx', '.tsx'],
        };
        return config;
    },
    turbopack: {},
};

export default nextConfig;
