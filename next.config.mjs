/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["img.clerk.com"],
  },
  async headers() {
    return [
        {
            source: '/api/:path*', // Match all routes
            headers: [
                { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
                { key: 'Pragma', value: 'no-cache' },
                { key: 'Expires', value: '0' },
            ],
        },
    ];
  },
};

export default nextConfig;
