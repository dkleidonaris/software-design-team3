const { missingFieldsResponse } = require('./responses');

function checkMissingFields(res, obj, requiredFields) {
    const missingFields = {};
    for (const key in requiredFields) {
        if (!obj[key]) {
            missingFields[key] = requiredFields[key];
        }
    }

    if (Object.keys(missingFields).length > 0) {
        missingFieldsResponse(res, missingFields);  // στείλε απάντηση μόνο αν λείπουν
        return true; // ένδειξη ότι απάντηση στάλθηκε
    }

    return false; // όλα καλά, δεν στάλθηκε απάντηση
}

module.exports = { checkMissingFields };