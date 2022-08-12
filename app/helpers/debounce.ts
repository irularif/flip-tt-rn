const debounce = (func: Function, timeout: number = 300) => {
  let timer: any = undefined;
  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

export default debounce;
