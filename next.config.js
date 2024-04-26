/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'influchain.fra1.digitaloceanspaces.com',
                port: '',
                pathname: '/meemaw/static/**',
            },
        ],
    },
    env: {
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    }
}

module.exports = nextConfig