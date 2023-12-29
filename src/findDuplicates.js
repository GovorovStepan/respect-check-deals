function findDuplicates(data) {
  const contactIDMap = {};

  for (const item of data) {
    const contactID = item.CONTACT_ID;
    const id = item.ID;

    if (contactIDMap.hasOwnProperty(contactID)) {
      // Ключ уже существует, добавляем ID в массив
      contactIDMap[contactID].push(id);
    } else {
      // Ключ не существует, создаем новый массив и добавляем ID
      contactIDMap[contactID] = [id];
    }
  }

  // Фильтруем только те записи, у которых больше одного ID (дубликаты)
  const duplicates = {};
  for (const contactID in contactIDMap) {
    if (contactIDMap[contactID].length > 1) {
      duplicates[contactID] = contactIDMap[contactID];
    }
  }

  return duplicates;
}


export default findDuplicates;