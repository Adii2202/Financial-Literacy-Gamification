import {I18nBaseType} from '../i18nTypes';

export const cancelText = 'cancelText';
export const loadingText = 'loadingText';
export const logoutText = 'logoutText';
export const authLogoutPopupHeading = 'authLogoutPopupHeading';
export const authLogoutPopupSubHeading = 'authLogoutPopupSubHeading';
export const authLogoutPopupPrimaryBtnText = 'authLogoutPopupPrimaryBtnText';
export const authLogInRequiredPopupHeading = 'authLogInRequiredPopupHeading';
export const authLogInRequiredPopupSubHeading =
  'authLogInRequiredPopupSubHeading';
export const authLogInRequiredPopupPrimaryBtnText =
  'authLogInRequiredPopupPrimaryBtnText';
export const authLogInRequiredPopupSecondaryBtnText =
  'authLogInRequiredPopupSecondaryBtnText';

export const authSessionTimeoutToastHeading = 'authSessionTimeoutToastHeading';
export const authErrorOnLoginToastHeading = 'authErrorOnLoginToastHeading';
export const authAuthenticationFailedText = 'authAuthenticationFailedText';
export const authAuthorizingApplicationText = 'authAuthorizingApplicationText';

export interface I18nCommonLabelsInterface {
  [cancelText]?: I18nBaseType;
  [loadingText]?: I18nBaseType;
  [logoutText]?: I18nBaseType;
  [authLogoutPopupHeading]?: I18nBaseType;
  [authLogoutPopupSubHeading]?: I18nBaseType;
  [authLogoutPopupPrimaryBtnText]?: I18nBaseType;

  [authLogInRequiredPopupHeading]?: I18nBaseType;
  [authLogInRequiredPopupSubHeading]?: I18nBaseType;
  [authLogInRequiredPopupPrimaryBtnText]?: I18nBaseType;
  [authLogInRequiredPopupSecondaryBtnText]?: I18nBaseType;

  [authSessionTimeoutToastHeading]?: I18nBaseType;
  [authErrorOnLoginToastHeading]?: I18nBaseType;
  [authAuthenticationFailedText]?: I18nBaseType;
  [authAuthorizingApplicationText]?: I18nBaseType;
}

export const CommonLabels: I18nCommonLabelsInterface = {
  [cancelText]: 'CANCEL',
  [loadingText]: 'Loading...',
  [logoutText]: 'Logout',
  [authLogoutPopupHeading]: 'Logout?',
  [authLogoutPopupSubHeading]: 'Are you sure you wanna log out?',
  [authLogoutPopupPrimaryBtnText]: 'CONFIRM',

  [authLogInRequiredPopupHeading]: 'Login Required',
  [authLogInRequiredPopupSubHeading]: 'Log-in to your organization to contiue',
  [authLogInRequiredPopupPrimaryBtnText]: 'LOGIN',
  [authLogInRequiredPopupSecondaryBtnText]: 'CLOSE APP',

  [authSessionTimeoutToastHeading]: 'Your session has timed out, Retrying...',
  [authErrorOnLoginToastHeading]: 'Error occured on Login, Please login again.',
  [authAuthenticationFailedText]: 'Authentication failed',
  [authAuthorizingApplicationText]: 'Authorizing app...',
};
