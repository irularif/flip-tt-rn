import { StyleProp } from "react-native";

export const getStyleValue = (
  style: StyleProp<any> = {},
  keys: Array<keyof StyleProp<any>> = [],
  defaultValue: any = undefined
) => {
  let value = defaultValue;
  keys.forEach((key) => {
    if (style[key] !== undefined) {
      value = style[key];
    }
  });
  return value;
};
