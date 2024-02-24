import {formatTranscriptContent} from './utils';
import {useCaption} from './useCaption';
import RNFetchBlob from 'rn-fetch-blob';
import {isAndroid, isIOS, useRoomInfo, useContent} from 'customization-api';
import Share from 'react-native-share';

const useTranscriptDownload = (): {
  downloadTranscript: () => Promise<string | null>;
} => {
  const {meetingTranscript} = useCaption();
  const {defaultContent} = useContent();
  const {
    data: {meetingTitle},
  } = useRoomInfo();

  const downloadTranscript = (): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      try {
        const [finalContent, fileName] = formatTranscriptContent(
          meetingTranscript,
          meetingTitle,
          defaultContent,
        );

        // get path to the Documents directory, don't have access to Downloads folder so saving in documents 1
        const documentsDir = RNFetchBlob.fs.dirs.DocumentDir;

        // setting file path
        const filePath = `${documentsDir}/${fileName}`;

        // Writing content to the file
        RNFetchBlob.fs
          .writeFile(filePath, finalContent, 'utf8')
          .then(() => {
            console.warn('Content downloaded successfully on native.');
            // display preview of the document and option to share
            if (isIOS()) {
              RNFetchBlob.ios.previewDocument(filePath);
            } else if (isAndroid()) {
              console.warn('android download complete !');
              // need to show the preview of downloaded file
              Share.open({url: `file://${filePath}`, type: 'text/plain'})
                .then(res => {
                  console.warn('File shared successfully:', res);
                  resolve(filePath);
                })
                .catch(error => {
                  console.error('Error sharing file:', error);
                  reject(error);
                });
            }
            resolve(filePath);
          })
          .catch(error => {
            console.error('Error downloading content:', error);
            reject(error);
          });
      } catch (error) {
        console.error('Error downloading content:', error);
        reject(error);
      }
    });
  };

  return {downloadTranscript};
};

export default useTranscriptDownload;
