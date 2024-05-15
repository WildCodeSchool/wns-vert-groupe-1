const nextConfig = {
    
};
module.exports = {
	images: {
		domains: ["localhost"],
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost",
				port: "8000",
				pathname: "/files/**",
			},
		],
	},
};
export default nextConfig;
