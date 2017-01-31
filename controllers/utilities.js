
module.exports = {
    sendJsonResponse: function (res, status, content) {
        res.status(status);
        res.json(content);
    },
    convertToArray: function (items, separator) {
        if (items) return items.split(separator);
        return items;
    }
}