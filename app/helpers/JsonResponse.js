class JsonResponse {
  success = (res, data, status = 200, message = null) => {
    return res.status(status).json({
      data: data,
      status: status,
      message: message,
      success: true,
    });
  };

  error = (res, message, data = null, status = 400, type = "invalid-request") => {
    return res.status(status).json({
      data: data,
      status: status,
      type: type,
      message: message,
      success: false,
    });
  };

  pagination = (res, data, count, page, status = 200, message = null) => {
    return res.status(status).json({
      data: data,
      count: count,
      page: page,
      status: status,
      message: message,
      success: true,
    });
  };
}

module.exports = new JsonResponse();
