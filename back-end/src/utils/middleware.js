function bodyDataHas(propertyName) {
    return function (req, res, next) {
      const { data = {} } = req.body;
      if (data[propertyName]) {
        return next();
      }
      next({ status: 400, message: `Reservation must include ${propertyName}` });
    };
}

module.exports = {
    bodyDataHas,
}