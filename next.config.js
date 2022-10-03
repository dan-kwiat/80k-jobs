/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    remotePatterns: [
      { hostname: "cdn.sanity.io" },
      { hostname: "source.unsplash.com" },
      { hostname: "80000hours.org" },
      { hostname: "cdn.80000hours.org" },
    ],
  },
}
