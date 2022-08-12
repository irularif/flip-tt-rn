export const moneyFormat = (
  number: string | number = 0,
  prefix: string = "Rp"
) => {
  let res = String(number).replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, `$1.`);
  return `${prefix}${res}`;
};

export const dateFormat = (date: string) => {
  const dateObj = new Date(date);
  const bulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  return `${dateObj.getDate()} ${bulan[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
}