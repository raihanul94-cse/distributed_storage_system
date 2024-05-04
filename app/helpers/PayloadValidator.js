class PayloadValidator {
  constructor(schema) {
    this.schema = schema;
  }

  validate(payload) {
    let errors = [];
    let data = {};

    for (const field in this.schema) {
      const { type, required = false, nullable = true } = this.schema[field];

      if (required && !payload[field]) {
        errors.push({
          field: field,
          error: `Required ${field}`,
        });
      } else if (!nullable && typeof payload[field] !== type) {
        errors.push({
          field: field,
          error: `Invalid ${field}. Expected type: ${type}`,
        });
      } else {
        data[field] = payload[field];
      }
    }

    if (errors[0]) {
      return {
        isValid: false,
        errors: errors,
      };
    }

    return {
      isValid: true,
      data: data,
    };
  }
}

module.exports = PayloadValidator;
