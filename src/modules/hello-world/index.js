const uuid = require('uuid'); 
const utils = require('/opt/nodejs/utils/layer_func');

exports.handler = async (event) => {

    // TODO implement
    console.log(utils.layerFunc());
    const response = {
        statusCode: 200,
        body: JSON.stringify(uuid.v4()),
    };
    return response;
};
