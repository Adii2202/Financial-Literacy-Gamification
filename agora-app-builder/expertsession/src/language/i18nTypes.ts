import {TextDataInterface} from './default-labels/index';

export type I18nBaseType<T = any> = string | ((template: T) => string);
export type I18nDynamicType = I18nBaseType<string>;
export type I18nConditionalType = I18nBaseType<boolean>;
export interface I18nInterface {
  locale: string;
  label?: string;
  data: TextDataInterface;
}
