
export const getUserNameData = async (textData: any, userId: string) => {
  try {
    const userNameData = {
      userId: userId,
      name: textData.fromName,
    }

    return userNameData;
  } catch(err) {
    console.log(err);
  }
}

