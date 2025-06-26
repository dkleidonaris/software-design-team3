const { missingFieldsResponse } = require('./responses');

function checkMissingFields(res, obj, requiredFields) {
    const missingFields = {};
    for (const key in requiredFields) {
        if (!obj[key]) {
            missingFields[key] = requiredFields[key];
        }
    }
    return missingFieldsResponse(res, missingFields);
}

module.exports = { checkMissingFields };