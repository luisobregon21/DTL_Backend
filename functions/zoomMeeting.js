const rp = require('request-promise')
const jwt = require('jsonwebtoken')

const payload = {
    iss: 'Q75WEks_RjWh3gNduIV6Ew',
    exp: new Date().getTime() + 5000,
}
const token = jwt.sign(payload, 'PgWDZhIyW79AOndVphU7GWsj3m82HJ8OxvKa')

exports.newMeeting = async () => {
    const email = 'dtl.downtolearn@gmail.com'
    console.log('INSIDE THE FUNCTION ')
    let options = {
        method: 'POST',
        url: 'https://api.zoom.us/v2/users/' + email + '/meetings',
        body: {
            topic: 'It is a Match',
            type: 2,
            settings: {
                // use_pmi: 'true',
                allow_multiple_devices: 'true',
                host_video: 'true',
                join_before_host: 'true',
                participant_video: 'true',
            },
        },
        auth: {
            bearer: token,
        },
        headers: {
            'User-Agent': 'Zoom-api-Jwt-Request',
            'content-type': 'application/json',
        },
        json: true, //Parse the JSON string in the response
    }

    const result = await rp(options)
    // .then(function (response) {
    //     console.log('response is: ', response)
    // })
    // .catch(function (err) {
    //     // API call failed...
    //     console.log('API call failed, reason ', err)
    // })
    return result
    //console.log('This is result: ', result)
}
