

exports.base64decode = async (data) => {
    while (data.length % 4 !== 0) {
        data += '=';
    }
    data = data.replace(/-/g, '+').replace(/_/g, '/');
    return new Buffer(data, 'base64').toString('utf-8');
}


exports.validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}