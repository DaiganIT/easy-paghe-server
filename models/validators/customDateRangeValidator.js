import validate from 'validate.js';
import moment from 'moment';

validate.validators.isGreaterThanStartDate = function(value, options, key, attributes) {
  const startDate = moment(attributes.startDate);
  const endDate = moment(value);

  if (endDate <= startDate) 
    return ';La data di fine assunzione deve essere futura a quella di inizio';
};
