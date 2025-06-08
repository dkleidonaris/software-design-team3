const missingFieldResponse = (res, fieldName) => {
    res.status(400).json({ error: `Field ${fieldName} is missing` , fieldName: fieldName, errorType: "missingField"});
};

module.exports = {
    missingFieldResponse,
};