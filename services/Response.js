module.exports = {
    json: function(status = 200, res, message, data) {
        const response = { message };
        if (data) response.data = data;
        return res.status(status).json(response);
    },
    serverError: function(res, error, message = "Something went wrong", data) {
        console.log(error);
        const response = { message };
        if (data) response.data = data;
        return res.status(500).json(response);
    },
};