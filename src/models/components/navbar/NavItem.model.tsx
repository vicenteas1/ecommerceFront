export type NavItem = {
  menuname: string;
  route?: string;
  submenu?: NavItem[];
  displayMenuName?: boolean;
};
