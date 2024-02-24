import React from 'react';

import BaseToast from './base';
import { icons } from '../assets';
import colors from '../colors';

function ErrorToast(props) {
  return (
    <BaseToast
      {...props}
      style={{ borderTopColor: colors.blazeOrange }}
      text1Style={{ color: colors.blazeOrange }}
      text2Style={{ color: colors.blazeOrange }}
    />
  );
}

ErrorToast.propTypes = BaseToast.propTypes;

export default ErrorToast;
