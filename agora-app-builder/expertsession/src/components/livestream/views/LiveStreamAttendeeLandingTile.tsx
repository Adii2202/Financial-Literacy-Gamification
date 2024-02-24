import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import ImageIcon from '../../../atoms/ImageIcon';
import {IconsInterface} from '../../../atoms/CustomIcon';
import hexadecimalTransparency from '../../../utils/hexadecimalTransparency';
import MeetingLink from '../../../atoms/MeetingLink';
import {
  SHARE_LINK_CONTENT_TYPE,
  useShareLink,
} from '../../../components/useShareLink';
import {isMobileUA, useIsDesktop} from '../../../utils/common';
import TertiaryButton from '../../../atoms/TertiaryButton';
import ThemeConfig from '../../../theme';
import {useString} from '../../../utils/useString';
import {TextDataInterface} from '../../../language/default-labels';
import {
  livestreamingAttendeeChatWithOthersInfoHeading,
  livestreamingAttendeeChatWithOthersInfoSubHeading,
  livestreamingAttendeeInviteOthersText,
  livestreamingAttendeeJoinWithActivitiesInfoHeading,
  livestreamingAttendeeJoinWithActivitiesInfoSubHeading,
  livestreamingAttendeePresentYourScreenInfoHeading,
  livestreamingAttendeePresentYourScreenInfoSubHeading,
  livestreamingAttendeeRaiseHandInfoHeading,
  livestreamingAttendeeRaiseHandInfoSubHeading,
  livestreamingAttendeeWaitingForHostToJoinText,
  livestreamingAttendeeWhatYouCanDoText,
} from '../../../language/default-labels/videoCallScreenLabels';

interface Feature {
  id: number;
  icon: keyof IconsInterface;
  tint: string;
  titleTranslationKey: keyof TextDataInterface;
  descriptionTranslationKey: keyof TextDataInterface;
}
const features: Feature[] = [
  {
    id: 1,
    icon: 'raise-hand',
    tint: $config.SEMANTIC_WARNING,
    titleTranslationKey: livestreamingAttendeeRaiseHandInfoHeading,
    descriptionTranslationKey: livestreamingAttendeeRaiseHandInfoSubHeading,
  },
  {
    id: 2,
    icon: 'chat-filled',
    titleTranslationKey: livestreamingAttendeeChatWithOthersInfoHeading,
    tint: $config.SEMANTIC_SUCCESS,
    descriptionTranslationKey:
      livestreamingAttendeeChatWithOthersInfoSubHeading,
  },
  {
    id: 3,
    icon: 'screen-share',
    titleTranslationKey: livestreamingAttendeePresentYourScreenInfoHeading,
    tint: $config.PRIMARY_ACTION_BRAND_COLOR,
    descriptionTranslationKey:
      livestreamingAttendeePresentYourScreenInfoSubHeading,
  },
  {
    id: 4,
    icon: 'celebration',
    titleTranslationKey: livestreamingAttendeeJoinWithActivitiesInfoHeading,
    tint: $config.SEMANTIC_ERROR,
    descriptionTranslationKey:
      livestreamingAttendeeJoinWithActivitiesInfoSubHeading,
  },
];
function FeatureTile({feature}: {feature: Feature}) {
  const isDesktop = useIsDesktop();
  const isMobile = isMobileUA();
  const title = useString(feature.titleTranslationKey)();
  const desc = useString(feature.descriptionTranslationKey)();
  return (
    <View
      style={[
        style.card,
        isDesktop() && !isMobile ? style.cardWeb : style.cardMobile,
      ]}>
      <View style={style.cardHeader}>
        <View style={style.cardHeaderAvatar}>
          <View style={style.cardHeaderAvatarIcon}>
            <ImageIcon
              iconSize={24}
              iconType="plain"
              name={feature.icon}
              tintColor={feature.tint}
            />
          </View>
        </View>
        <View style={style.cardHeaderContent}>
          <View>
            <Text style={style.cardTitle}>{title}</Text>
          </View>
          <View style={{flexShrink: 1, paddingTop: 2}}>
            <Text style={style.cardDesc}>{desc}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function LiveStreamAttendeeLandingTile() {
  const isMobile = isMobileUA();
  const {copyShareLinkToClipboard, getShareLink} = useShareLink();
  const inviteOtherAttendee = useString(
    livestreamingAttendeeInviteOthersText,
  )();
  const whatYouCanDoHere = useString(livestreamingAttendeeWhatYouCanDoText)();
  const waitingForHostToJoin = useString(
    livestreamingAttendeeWaitingForHostToJoinText,
  )();
  return (
    <View style={style.tileBackdrop}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={style.tileContainer}>
          <View style={style.tile}>
            <View style={[style.tileSection, style.tileheader]}>
              <Text style={style.tileHeading}>{waitingForHostToJoin}</Text>
            </View>
            <View style={[style.tileSection, style.tilebody]}>
              <View>
                <Text style={style.tileSubheading}>{whatYouCanDoHere}</Text>
              </View>
              <View style={style.tileSectionGrid}>
                {features.map(feature => (
                  <FeatureTile key={feature.id} feature={feature} />
                ))}
              </View>
            </View>
            <View style={[style.tileSection]}>
              <View>
                {isMobile ? (
                  <>
                    <TertiaryButton
                      text={inviteOtherAttendee}
                      containerStyle={{
                        width: '100%',
                        height: 48,
                        paddingVertical: 12,
                        paddingHorizontal: 12,
                        borderRadius: ThemeConfig.BorderRadius.medium,
                      }}
                      iconName="share"
                      iconSize={20}
                      iconColor={$config.SECONDARY_ACTION_COLOR}
                      onPress={() => {
                        copyShareLinkToClipboard(
                          SHARE_LINK_CONTENT_TYPE.ATTENDEE,
                        );
                      }}
                    />
                  </>
                ) : (
                  <>
                    <View>
                      <Text style={[style.cardTitle, {paddingBottom: 3}]}>
                        {inviteOtherAttendee?.toLowerCase()}
                      </Text>
                    </View>
                    <MeetingLink
                      styleProps={{
                        size: 'tiny',
                        variant: 'secondary',
                        linkFontSize: 'tiny',
                      }}
                      label=""
                      link={getShareLink(SHARE_LINK_CONTENT_TYPE.ATTENDEE)}
                      linkToCopy={SHARE_LINK_CONTENT_TYPE.ATTENDEE}
                    />
                  </>
                )}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const style = StyleSheet.create({
  tileBackdrop: {
    flex: 1,
    backgroundColor: $config.VIDEO_AUDIO_TILE_COLOR,
    justifyContent: 'center',
    marginHorizontal: 'auto',
    marginVertical: 4,
  },
  tileContainer: {
    maxWidth: 600,
    minWidth: 200,
    margin: 'auto',
    padding: 20,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tile: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: $config.CARD_LAYER_2_COLOR,
    backgroundColor: $config.CARD_LAYER_1_COLOR,
  },
  tileSection: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  tileSectionGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tileheader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tilebody: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: $config.CARD_LAYER_2_COLOR,
  },
  tileHeading: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 20,
    color: $config.FONT_COLOR,
    fontFamily: 'Source Sans Pro',
  },
  tileSubheading: {
    color: $config.VIDEO_AUDIO_TILE_AVATAR_COLOR,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 14,
    fontFamily: 'Source Sans Pro',
  },
  // Feature card css
  card: {
    minHeight: 50,
    width: '100%',
    paddingTop: 16,
    paddingRight: 16,
  },
  cardWeb: {
    flexBasis: '50%',
  },
  cardMobile: {
    flexBasis: '100%',
  },
  cardHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cardHeaderAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    flexShrink: 0,
    backgroundColor:
      $config.CARD_LAYER_5_COLOR + hexadecimalTransparency['10%'],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardHeaderAvatarIcon: {
    flexShrink: 0,
  },
  cardHeaderContent: {
    flex: 1,
    marginTop: 2,
  },
  cardTitle: {
    color: $config.FONT_COLOR,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 12,
    fontFamily: 'Source Sans Pro',
  },
  cardDesc: {
    color: $config.FONT_COLOR + hexadecimalTransparency['70%'],
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    fontFamily: 'Source Sans Pro',
  },
});
