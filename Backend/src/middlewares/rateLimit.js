import rateLimit from 'express-rate-limit'

export const sendRateLimiter = rateLimit({
    windowMs: 30 * 1000, // 30 sec
    max:10, // Allow 10 Max request per IP with windowMs
    standardHeaders:true, // return rate Limit info from 'rateLimit-*'
    legacyHeaders:false, // Disable the "X-rateLimit-*" Headers
    handler: (req, res) => {
        // Calculate time until the next request can be made
        // This is the time until the oldest request in the window expires
        const retryAfter = 30; // 30 seconds until request to be made
        res.set('retryAfter', retryAfter.toString())
        res.status(429).json({
            error: "Too many requests",
            message: `Rate limit hit. Try again in ${retryAfter} seconds.`,
            retryAfter: retryAfter
        })
    }  
})