export const getUserNameData = async (url, token) => {
  try {
    const result = await fetch(url + `/user-name-data`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      // body: JSON.stringify({})
    })

    if (!result.ok) {
      throw new Error('error occured');
    }

    const resData = await result.json();

    return resData;

  } catch(err) {
    console.log(err);
    throw err;
  }
};


export const updateLsNameDataList = (addList, userNameData) => {
  let lsNameDataList = localStorage.getItem('lsNameDataList');

  if (lsNameDataList) {
    lsNameDataList = JSON.parse(lsNameDataList);
  } else {
    lsNameDataList = [];
  }

  let useAddList = addList;

  if (userNameData) {
    useAddList = addList.concat(userNameData);
  }

  const deletedList = lsNameDataList.filter(element => {
    const isInList = useAddList.find(ele => {
      return ele.userId === element.userId;
    });

    if (!isInList) {
      return element;
    }
  });

  const newList = deletedList.concat(useAddList).slice(-100000);

  localStorage.setItem('lsNameDataList', JSON.stringify(newList));
};

// export const updateUserNameDataName = async (url, token, newName) => {
//   try {
//     const result = await fetch(url + `/user-name-data/user-name`, {
//       method: 'PUT',
//       headers: {
//         Authorization: 'Bearer ' + token,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         newName: newName,
//       })
//     })

//     if (!result.ok) {
//       throw new Error('error occured');
//     }

//     const resData = await result.json();

//     return resData;

//   } catch(err) {
//     console.log(err);
//     throw err;
//   }
// };