const getLocaleDateString = (dateObject) => {
  return new Date(dateObject.startDate[0], dateObject.startDate[1] - 1, dateObject.startDate[2]).toLocaleDateString();
};

export default getLocaleDateString;