var config = {
    port: process.env.PORT || 3000,
    mongoUrl: "mongodb://user:1NR02AC4@ds127928.mlab.com:27928/heroku_pljk4xgk",
    session: {
        secret: "myKey",
        key: "sid",
        cookie: {
            path: "/",
            httpOnly: true,
            maxAge: null
        }
    }
};

module.exports = config;