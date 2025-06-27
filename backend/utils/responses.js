const missingFieldsResponse = (res, missingFields) => {
    const errors = Object.entries(missingFields).map(([key, label]) => ({
        field: key,
        message: `Field ${label} is missing`,
        errorType: 'missingField'
    }));

    return res.status(400).json({ errors });
};

module.exports = {
    missingFieldsResponse,
};