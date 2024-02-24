import hexadecimalTransparency from '../utils/hexadecimalTransparency';

const EmphasisOpacity = {
  high: 1,
  medium: 0.85,
  disabled: 0.4,
};
const EmphasisPlus = {
  high: '',
  medium: hexadecimalTransparency['85%'],
  disabled: hexadecimalTransparency['40%'],
};
export interface FontSizes {
  extraLarge: number;
  large: number;
  medium: number;
  normal: number;
  small: number;
  tiny: number;
}
const FontSize: {
  extraLarge: 32;
  large: 20;
  medium: 18;
  normal: 16;
  small: 14;
  tiny: 12;
} = {
  extraLarge: 32,
  large: 20,
  medium: 18,
  normal: 16,
  small: 14,
  tiny: 12,
};

const FontFamily = {
  sansPro: 'Source Sans Pro',
};

const BorderRadius: {small: 4; medium: 8; large: 12; extraLarge: 20} = {
  small: 4,
  medium: 8,
  large: 12,
  extraLarge: 20,
};

const ThemeConfig = {
  EmphasisOpacity,
  EmphasisPlus,
  FontSize,
  FontFamily,
  BorderRadius,
};
export default ThemeConfig;
