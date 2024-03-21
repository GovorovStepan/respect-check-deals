function findPhoneDuplicates(array) {
  const transformedArray = {};

  array.forEach(item => {
    if (item.hasOwnProperty('PHONE') && item.PHONE.length) {
      const phoneValue = item.PHONE[0].VALUE;
      if (!transformedArray[phoneValue]) {
        transformedArray[phoneValue] = [];
      }
      transformedArray[phoneValue].push(item);
    } else {
      if (transformedArray.hasOwnProperty('Без номера')) {
        transformedArray['Без номера'].push(item);
      } else {
        transformedArray['Без номера'] = [item];
      }
    }
  });

  return Object.keys(transformedArray).filter(key => transformedArray[key].length > 1).reduce((obj, key) => {
    obj[key] = transformedArray[key];
    return obj;
  }, {});
}


export default findPhoneDuplicates;