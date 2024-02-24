import {CommonLabels, I18nCommonLabelsInterface} from './commonLabels';
import {
  CreateScreenLabels,
  I18nCreateScreenLabelsInterface,
} from './createScreenLabels';
import {
  JoinScreenLabels,
  I18nJoinScreenLabelsInterface,
} from './joinScreenLabels';
import {
  ShareLinkScreenLabels,
  I18nShareLinkScreenLabelsInterface,
} from './shareLinkScreenLabels';
import {
  VideoCallScreenLabels,
  I18nVideoCallScreenLabelsInterface,
} from './videoCallScreenLabels';
import {
  PrecallScreenLabels,
  I18nPrecallScreenLabelsInterface,
} from './precallScreenLabels';

export interface TextDataInterface
  extends I18nCommonLabelsInterface,
    I18nCreateScreenLabelsInterface,
    I18nJoinScreenLabelsInterface,
    I18nShareLinkScreenLabelsInterface,
    I18nVideoCallScreenLabelsInterface,
    I18nPrecallScreenLabelsInterface {}

export const DEFAULT_LABELS: TextDataInterface = {
  ...CommonLabels,
  ...CreateScreenLabels,
  ...JoinScreenLabels,
  ...ShareLinkScreenLabels,
  ...PrecallScreenLabels,
  ...VideoCallScreenLabels,
};
