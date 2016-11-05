/**
 * Created by YS on 2016-11-05.
 */
var request = require('request');

module.exports.checkToken = checkToken;

function checkToken(data) {
    // 페이스북에 유효 토큰 질의
    return new Promise(function(resolved, rejected) {
        // 유저 상태 인증
        if (process.env.NODE_ENV == 'development') {
            return resolved(data);
        } else {
            request.get({
                url: 'https://graph.facebook.com/v2.7/me',
                qs: {
                    access_token: data.access_token,
                    field: "id, name"
                }
            }, function (err, httpResponse, body) {
                if (err) {
                    var error = new Error("사용자 인증 에러");
                    error.status = 401;
                    console.error(err);
                    return rejected(error);
                }

                var fb_profile = JSON.parse(body);
                if (fb_profile.error) {
                    var error = new Error("사용자 인증 에러");
                    error.status = 401;
                    console.error(err);
                    return rejected(error);
                }
                console.log(fb_profile);
                data.user_id = fb_profile.id;
                data.username = fb_profile.name;
                return resolved(data);
            });
        }
    });
}