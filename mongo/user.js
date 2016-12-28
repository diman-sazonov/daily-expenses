var log = require("libs/log")(module);

var User = require("./models/user");

function save(data, callback) {

    log.info(data);

    var user = new User({
        username: data.username,
        setPassword: data.password
    });

    user.save(function(err, user) {

        if (err) {

            if (err.code == 11000) {
                return callback({
                    status_code: 403,
                    message: "Login exist"
                });
            }

            log.error(err);
            
            return callback({
                status_code: 500,
                message: "Server error"
            });

        }

        callback(null);

    });

}

function getByUsernameAndPassword(user, callback) {

    var md5 = require('crypto').createHash('md5');

    user = {
        username: user.username,
        password: md5.update(user.password).digest('hex')
    };

    User.findOne(user, function(err, user) {

        if (err) {
            log.error(err);
            return callback({
                status_code: 500,
                message: "Server error"
            });
        }

        if (user) return callback(null, user);

        callback({
            status_code: 404,
            message: "not auth"
        });

    });

}

function getById(user_id, callback) {

    User.findOne({_id: user_id}, function(err, user) {

        if (err) return callback(err);

        callback(null, user);
        
    });
    
}

exports.getByUsernameAndPassword = getByUsernameAndPassword;
exports.getById = getById;
exports.save = save;