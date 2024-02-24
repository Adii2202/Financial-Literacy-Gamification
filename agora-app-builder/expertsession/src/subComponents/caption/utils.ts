import {ContentObjects} from '../../../agora-rn-uikit/src/Contexts/RtcContext';
import {TranscriptItem} from './useCaption';

export function formatTime(timestamp: number): string {
  const d = new Date(timestamp);
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  //const s = d.getSeconds().toString().padStart(2, '0');
  const suffix = h >= 12 ? 'PM' : 'AM';
  const H = h % 12 || 12;
  return `${H}:${m} ${suffix}`;
}

export type LanguageType =
  | 'en-US'
  | 'hi-IN'
  | 'zh-CN'
  | 'zh-HK'
  | 'fr-FR'
  | 'de-DE'
  | 'ko-KR'
  | 'en-IN'
  | 'ar'
  | 'ja-JP'
  | 'pt-PT'
  | 'es-ES'
  | 'it-IT'
  | 'id-ID'
  | '';

interface LanguageData {
  label: string;
  value: LanguageType;
}

export const langData: LanguageData[] = [
  {label: 'English (US)', value: 'en-US'},
  {label: 'English (India)', value: 'en-IN'},
  {label: 'Hindi', value: 'hi-IN'},
  {label: 'Chinese (Simplified)', value: 'zh-CN'},
  {label: 'Chinese (Traditional)', value: 'zh-HK'},
  {label: 'Arabic', value: 'ar'},
  {label: 'French', value: 'fr-FR'},
  {label: 'German', value: 'de-DE'},
  {label: 'Japanese', value: 'ja-JP'},
  {label: 'Korean', value: 'ko-KR'},
  {label: 'Portuguese', value: 'pt-PT'},
  {label: 'Spanish', value: 'es-ES'},
  {label: 'Italian', value: 'it-IT'},
  {label: 'Indonesian', value: 'id-ID'},
];

export function getLanguageLabel(
  languageCode: LanguageType[],
): string | undefined {
  const langLabels = languageCode.map(langCode => {
    return langData.find(data => data.value === langCode).label;
  });
  return langLabels ? langLabels.join(', ') : undefined;
}

export function formatDateWithTimeZone(date: Date): string {
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();

  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');

  const timeZoneOffset = 5.5 * 60; // Offset in minutes for GMT +5:30
  const offsetHours = Math.floor(timeZoneOffset / 60);
  const offsetMinutes = timeZoneOffset % 60;
  const offsetSign = '+';

  return `${day}/${month}/${year} ${hours}:${minutes} GMT ${offsetSign}${offsetHours}:${String(
    offsetMinutes,
  ).padStart(2, '0')}`;
}

export const formatTranscriptContent = (
  meetingTranscript: TranscriptItem[],
  meetingTitle: string,
  defaultContent: ContentObjects,
) => {
  const formattedContent = meetingTranscript
    .map(item => {
      if (item.uid.toString().indexOf('langUpdate') !== -1) {
        return `${defaultContent[item?.uid?.split('-')[1]]?.name} ${item.text}`;
      }
      return `${defaultContent[item.uid].name} ${formatTime(
        Number(item?.time),
      )}:\n${item.text}`;
    })
    .join('\n\n');

  const startTime = formatDateWithTimeZone(
    new Date(meetingTranscript[0]?.time),
  );

  const attendees = Object.entries(defaultContent)
    .filter(
      arr =>
        arr[1].type === 'rtc' &&
        (arr[1]?.isInWaitingRoom === true ? false : true),
    )
    .map(arr => arr[1].name)
    .join(',');

  const info =
    'This editable transcript was computer generated and might contain errors. People can also change\nthe text after it was created.';
  const finalContent = `${meetingTitle} (${startTime}) - Transcript \n\nParticipants\n${attendees} \n\nTranscript\n${info} \n\n${formattedContent}`;

  // to give unique file name
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().slice(0, 10);
  const formattedTime = currentDate
    .toTimeString()
    .slice(0, 8)
    .replace(/:/g, '');

  // adding the filename
  const fileName = `MeetingTranscript_${formattedDate}_${formattedTime}.txt`;

  return [finalContent, fileName];
};
