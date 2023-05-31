const getLocaleDateString = (dateObject, monthOption) => {
  return new Date(dateObject[0], dateObject[1] - 1, dateObject[2]).toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: monthOption ? monthOption : '2-digit',
    year: 'numeric'
  });
};

export default getLocaleDateString;