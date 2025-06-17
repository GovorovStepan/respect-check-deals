function normalizePhone(phone) {
  // Оставляем только цифры
  const digits = phone.replace(/\D/g, '');

  // Приведение российских номеров к формату +7
  if (digits.length === 11 && digits.startsWith('8')) {
    return '+7' + digits.slice(1);
  }

  // Добавим +, если это международный номер без +
  if (digits.length >= 10 && !phone.startsWith('+')) {
    return '+' + digits;
  }

  return phone.startsWith('+') ? '+' + digits : digits;
}

function findPhoneDuplicates(array) {
  const transformedArray = {};

  array.forEach(item => {
    if (item.hasOwnProperty('PHONE') && item.PHONE.length) {
      const phoneValue = item.PHONE[0].VALUE;
      const normalizedPhone = normalizePhone(phoneValue);
      if (!transformedArray[normalizedPhone]) {
        transformedArray[normalizedPhone] = [];
      }
      transformedArray[normalizedPhone].push(item);
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