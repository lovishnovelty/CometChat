export const capitalizeInitials = (str: string) => {
  const arr = str.split(' ');
  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1).toLowerCase();
  }
  return arr.join(' ');
};

export const wait = (timeout: number) => {
  return new Promise((resolve: any) => setTimeout(resolve, timeout));
};
