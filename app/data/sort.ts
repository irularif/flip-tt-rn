export type ISortOptions = Array<{
  label: string;
  value: string;
}>;

export const sortOptions = [
  {
    label: "URUTKAN",
    value: "",
  },
  {
    label: "Nama A-Z",
    value: "beneficiary_name-asc",
  },
  {
    label: "Nama Z-A",
    value: "beneficiary_name-desc",
  },
  {
    label: "Tanggal Terbaru",
    value: "created_at-desc",
  },
  {
    label: "Tanggal Terlama",
    value: "created_at-asc",
  },
];
