module.exports = {
    secret: process.env.JWT_SECRET,
    ttl: process.env.JWT_TTL,
    refresh_ttl: process.env.JWT_REFRESH_TTL
};