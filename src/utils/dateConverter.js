const getLocaleDateString = (dateObject, options) => {
  return new Date(dateObject[0], dateObject[1] - 1, dateObject[2]).toLocaleDateString('pl-PL', {
    day: 'day' in options ? options.day : '2-digit',
    month: 'month' in options ? options.month : '2-digit',
    year: 'numeric'
  });
};

export default getLocaleDateString;