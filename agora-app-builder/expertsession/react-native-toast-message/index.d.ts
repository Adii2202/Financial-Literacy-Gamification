import React from 'react';
import { ViewStyle, TextStyle, ImageSourcePropType } from 'react-native';
import { IconsInterface } from '../src/atoms/CustomIcon';
declare module 'react-native-toast-message' {
  interface AnyObject {
    [key: string]: any;
  }

  export type ToastPosition = 'top' | 'bottom';

  export interface BaseToastProps {
    leadingIcon?: React.ReactNode;
    trailingIcon?: React.ReactNode;
    text1?: string;
    text2?: string;
    onPress?: () => void;
    style?: ViewStyle;
    contentContainerStyle?: ViewStyle;
    text1Style?: TextStyle;
    text2Style?: TextStyle;
    activeOpacity?: number;
    text1NumberOfLines: number;
    text2NumberOfLines: number;
    primaryBtn?: React.ReactNode;
    secondaryBtn?: React.ReactNode;
  }
  export const BaseToast: React.FC<BaseToastProps>;

  export interface ToastProps {
    ref: (ref: any) => any;
    config?: AnyObject;
    style?: ViewStyle;
    topOffset?: number;
    bottomOffset?: number;
    keyboardOffset?: number;
    visibilityTime?: number;
    autoHide?: boolean;
    height?: number;
    position?: ToastPosition;
    type?: string;
  }

  export default class Toast extends React.Component<ToastProps> {
    static show(options: {
      type: string;
      position?: ToastPosition;
      text1?: string;
      text2?: string;
      primaryBtn?: React.ReactNode;
      secondaryBtn?: React.ReactNode;
      visibilityTime?: number;
      autoHide?: boolean;
      topOffset?: number;
      bottomOffset?: number;
      props?: AnyObject;
      onShow?: () => void;
      onHide?: () => void;
      onPress?: () => void;
      leadingIcon?: React.ReactNode;
      leadingIconName?: keyof IconsInterface;
    }): void;

    static hide(): void;

    static getToastId(): number;

    static setRef(ref: any): any;
  }
}
