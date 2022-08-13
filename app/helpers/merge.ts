export const merge = (
  array1: Array<any> = [],
  array2: Array<any> = [],
  calback?: (array: Array<any>) => Array<any>
) => {
  let newArray = array1.concat(array2);
  if (!!calback) {
    const res = calback(newArray);
    if (!!res) {
      newArray = res;
    }
  }
  return newArray;
};
