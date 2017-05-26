/**
 * @module dataSF/dataSfCtrl
 * @description controller function of datasf module
 * @author deepak.ambekar [5/25/2017].
 */
var filePath = "login/dataSfCtrl.js";
var dataSfCtrl = {};
var requestAPI = require('request');

/**
 * get all data of datasf service
 * @memberof module:dataSF/dataSfCtrl
 * @param request {object} service request
 * @param response {object} service response
 */
function getAllData(request, response) {
    var functionName = _utils.formatFunctionName(filePath, getAllData.name);
    requestAPI(_constants.DATA_SF.url, function (error, res, body) {
        if (!error && res.statusCode == 200) {
            _logger.info(functionName + "dataSF service success response");
            var result = null;
            if (typeof body == "string") {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    _logger.error(functionName + "parsing response body failed", e);
                }
            } else
                result = body;
            _utils.send(response, {type: _constants.RESPONSE_MESSAGES.SUCCESS, data: result});
        }
        else {
            _logger.error(functionName + "dataSF service failed. Error", error);
            _utils.send(response, {type: _constants.RESPONSE_MESSAGES.FAILED, err: error});
        }
    });

};
dataSfCtrl.getAllData = getAllData;

/**
 * get circle data from lat,long and radius distance using datasf service
 * @memberof module:dataSF/dataSfCtrl
 * @param request {object} service request
 * @param response {object} service response
 */
function getCircleData(request, response) {
    var functionName = _utils.formatFunctionName(filePath, getCircleData.name);
    var requiredParam = ['lat', 'long', 'distance'];
    var data = {
        distance: request.params["distance"] || 500
    };
    for (var key in request.query) {
        if (!_utils.isEmpty(request.query[key]))
            data[key] = request.query[key];
    }
    var missingParam = _utils.checkRequiredMissingParam(data, requiredParam);
    if (missingParam) {
        _utils.send(response, {
            type: _constants.RESPONSE_MESSAGES.INCOMPLETE,
            custom_msg: missingParam
        });
    } else {
        var url = _constants.DATA_SF.url + "?$where=within_circle(location," + data.lat + "," + data.long + "," + data.distance + ")";
        _logger.info(functionName+"circle service url :",url);
        requestAPI(url, function (error, res, body) {
            if (!error && res.statusCode == 200) {
                _logger.info(functionName + "dataSF circle service success response");
                var result = null;
                if (typeof body == "string") {
                    try {
                        result = JSON.parse(body);
                    } catch (e) {
                        _logger.error(functionName + "parsing response body failed", e);
                    }
                } else
                    result = body;
                _utils.send(response, {type: _constants.RESPONSE_MESSAGES.SUCCESS, data: result});
            }
            else {
                _logger.error(functionName + "dataSF circle service failed. Error", error);
                _utils.send(response, {type: _constants.RESPONSE_MESSAGES.FAILED, err: error});
            }
        });
    }
};
dataSfCtrl.getCircleData = getCircleData;

module.exports = dataSfCtrl;
