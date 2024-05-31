const DEFAULT_LIMIT = 20;


exports.fetchDatatableRecordsWithMongoosePopulate = async (req, res, modelObj, dbQuery, afterSaveCB) => {
    const { code, body: input } = req;
    try {
        // INIT
        let drawRecord = Number(input.draw) || 0;
        const skipRecord = Number(input.start) || 0;
        const limitRecord = Number(input.length) || DEFAULT_LIMIT;

        // EXTRACT VALUES
        const {
            conditionQuery = {},
            searchFields = {},
            projectionQuery = {},
            sortingQuery = {},
            populateQuery = [],
        } = dbQuery;

        // Copy 'conditionQuery' to totalFindQuery
        const totalFindQuery = conditionQuery? JSON.parse(JSON.stringify(conditionQuery)) : {};

        // DEFAULT RESPONSE
        var responseJson = {
            "draw": drawRecord++,
            "recordsFiltered": 0,
            "recordsTotal": 0,
            "data": []
        };

        if (input.search && input.search.value !== "" && Object.keys(searchFields).length > 0) {
            const value = input.search.value;
            const orQueryList = [];

            const regexFields = searchFields["regex"] || [];
            const elemMatchFields = searchFields["elemMatch"] || [];

            // REGEX
            if (Array.isArray(regexFields) && regexFields.length > 0) {
                const regex = new RegExp(value, "i");
                for (const field of regexFields) {
                    const searchJson = {};
                    searchJson[field] = regex;
                    orQueryList.push(searchJson);
                }
            }

            // ELEMACTH
            if (Array.isArray(elemMatchFields) && elemMatchFields.length > 0) {
                for (const field of elemMatchFields) {
                    const searchJson = {};
                    const elemMatchQuery = { "$elemMatch": { "$eq": value } };
                    searchJson[field] = elemMatchQuery;
                    orQueryList.push(searchJson);
                }
            }

            // FINAL QUERY
            if(orQueryList.length > 0){
                conditionQuery["$or"] = orQueryList;
            }
           
        }

        // SET TOTAL-RECORD
        const totalRecordsCount = await modelObj.countDocuments(totalFindQuery);
        responseJson.recordsTotal = totalRecordsCount || 0;

        // SET FILTERED-RECORD
        const recordsFilteredCount = await modelObj.countDocuments(conditionQuery);
        responseJson.recordsFiltered = recordsFilteredCount || 0;

        let recordsData;
        if (Array.isArray(populateQuery) && populateQuery.length > 0) {
            recordsData = await modelObj.find(conditionQuery).select(projectionQuery).skip(skipRecord).limit(limitRecord).sort(sortingQuery).lean().populate(populateQuery).lean();
        } else {
            recordsData = await modelObj.find(conditionQuery).select(projectionQuery).skip(skipRecord).limit(limitRecord).sort(sortingQuery).lean();
        }

        // SET DATA-RECORD
        if (recordsData) {
            responseJson.data = recordsData;

            //AFTER CALLBACK
            if (afterSaveCB) await afterSaveCB(responseJson.data);
        }
        return res.status(code.success).json(responseJson);
    } catch (err) {
        console.error("CATCH ::fn[fetchDatatableRecordsWithMongoosePopulate]:::>", err);
        return res.status(code.internalServerError).json({ error: "Internal Server Error", "data": [] });
    }
};


