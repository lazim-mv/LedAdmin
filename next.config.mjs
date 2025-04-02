/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'example.com',
            'dummyimage.com',
            'media.linealight.com',
            'project-bucket-001.s3.ap-south-1.amazonaws.com',
            'light-store-demo.s3.ap-south-1.amazonaws.com'
        ],
    },
    env: {
        NEXT_PUBLIC_SERVER_URL: "http://13.235.75.225:3000/api/v1/"
    },
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "http://13.235.75.225:3000/api/v1/:path*"
            }
        ];
    },


    experimental: {
        optimizePackageImports: ['react-quill', 'react-icons', 'jspdf', 'js-cookie'],
        turbo: {
            resolveAlias: {
                '@next/font': '@next/font/google',
            },
        },
    },

    compiler: {
        removeConsole: process.env.NODE_ENV === 'production' ? {
            exclude: ['error', 'warn'],
        } : false,
    },
};

export default nextConfig;