var log = require("libs/log")(module);

var User = require("mongo").User;

// POST /signIn
function signIn(req, res) {

    var user = {
        username: req.body.username,
        password: req.body.password
    };

    User.getByUsernameAndPassword(user, function(err, user) {

        if (err) return res.send(err.status_code, err.message);

        var resp = {
            username: user.username,
            email: user.email
        };

        req.session.user_id = user._id.toString();
        req.session.username = user.username;
        req.session.isAuth = true;
        
        res.send(resp);
        
    });

}

// POST /signUp
function signUp(req, res) {

    var user = {
        username: req.body.username,
        password: req.body.password
    };

    User.save(user, function(err) {

        if (err) return res.send(err.status_code, err.message);
        
        res.send(200);
        
    });

}

//POST /signOut
function signOut(req, res) {

    req.session.destroy();
    res.send(200);

}

exports.signIn = signIn;
exports.signUp = signUp;
exports.signOut = signOut;