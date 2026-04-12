import { SearchType } from "src/models/enum/TypeCardEnum";

export const getLink = (type: SearchType, value: number | string) => {
  let link = "/";
  if (type) {
    switch (type) {
      case SearchType.GAME:
        link = `/gamemode/${value}`;
        break;
      case SearchType.THEME:
        link = `/theme/${value}`;
        break;
      case SearchType.CATEGORY:
        link = `/category/${value}`;
        break;
      case SearchType.LIST:
        link = `/list/${value}`;
        break;
    }
  }
  return link;
};
