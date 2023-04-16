// file for setting up different classnames per theme

const light = {
  icon: "sun",
  dark: false,
  bg: "bg-light",
  bgHex: "#FBFBFB",
  text: "text-dark",
  skin: "light-skin",
  topbar: "light-topbar",
  skinText: "text-dark",
  color: "light",
  reverse: "dark",
  hex: "#1266F1",
  border: "dark",
  borderHex: "#262626",
};

const dark = {
  icon: "moon",
  dark: true,
  bg: "bg-dark",
  bgHex: "#332D2D",
  text: "text-white",
  skin: "dark-skin",
  skinText: "text-white",
  topbar: "dark-topbar",
  color: "dark",
  reverse: "light",
  hex: "#FFA900",
  border: "white",
  borderHex: "#FBFBFB",
};

export { light, dark };
