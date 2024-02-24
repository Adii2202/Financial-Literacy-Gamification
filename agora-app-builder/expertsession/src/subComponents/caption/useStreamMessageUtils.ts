import React from 'react';
import {useCaption} from './useCaption';
import protoRoot from './proto/ptoto';
import PQueue from 'p-queue';

type StreamMessageCallback = (args: [number, Uint8Array]) => void;
type FinalListType = {
  [key: string]: string[];
};

const useStreamMessageUtils = (): {
  streamMessageCallback: StreamMessageCallback;
} => {
  const {
    setCaptionObj,
    setMeetingTranscript,
    activeSpeakerRef,
    prevSpeakerRef,
  } = useCaption();

  let captionStartTime: number = 0;
  const finalList: FinalListType = {};
  const finalTranscriptList: FinalListType = {};
  const queue = new PQueue({concurrency: 1});
  let counter = 0;
  let lastOfftime = 0;

  const streamMessageCallback: StreamMessageCallback = args => {
    const queueCallback = (args1: [number, Uint8Array]) => {
      /* uid - bot which sends stream message in channel
       payload - stream message in Uint8Array format
      */
      const [, payload] = args1;
      let nonFinalText = ''; // holds intermediate results
      let finalText = ''; // holds final strings
      let currentFinalText = ''; // holds current caption
      let isInterjecting = false;

      const textstream = protoRoot
        .lookupType('Text')
        .decode(payload as Uint8Array) as any;

      //console.log('STT - Parsed Textstream : ', textstream);
      // console.log(
      //   `STT-callback(${++counter}): %c${textstream.uid} %c${textstream.words
      //     .map(word =>
      //       word.text === '.'
      //         ? ''
      //         : word.isFinal
      //         ? word.text + ' --Final--'
      //         : word.text,
      //     )
      //     .join(' ')}`,
      //   'color:red',
      //   'color:blue',
      // );

      // Identifing Current & Prev Speakers for the Captions
      /*
      t0 A : Hi All!
      t1 B : Hi A
      t2 A : Hi B
      t3 C : What's Plan
      t4 B : Goal Planning
      t5 C : Yes Agree

     Screen:
     Time           :  t0       |   t1      |    t2     |      t3         |       t4          |    t5
     Prev Speaker   :           | A:Hi All! |  B: Hi A  |  A: Hi  B       |  C: What's Plan   |  B: Goal Planning
     Active Speaker : A:Hi All! | B: Hi A   |  A: Hi B  |  C: What's Plan |  B: Goal Planning |  C: Yes Agree
     Clearing Required:                           A               B                A                     C

     Logic:
     time           :  t0  t1 t2 t3 t4 t5
     textstream.uid :   A  B  A  C  B  C
     (B)prevSpeaker :   -  -  A  B  A  C
     (B)activeSpeake:   -  A  B  A  C  B
     Prev Data clear:   -  -  A  B  A  C
     ################## CHANGE ######################
     (A)prevSpeaker :   -  A  B  A  C  B
     (A)activeSpeake:   A  B  A  C  B  C

     Clear when textStream.uid == prevSpeakerRef.current

    */

      const finalWord = textstream.words.filter(word => word.isFinal === true);
      // when we only get final word for the previous speaker then don't flip previous speaker as active but update in place.

      if (
        textstream.uid !== activeSpeakerRef.current &&
        !(finalWord.length > 0 && textstream.uid === prevSpeakerRef.current)
      ) {
        // we have a speaker change so clear the context for prev speaker
        if (prevSpeakerRef.current !== '') {
          finalList[prevSpeakerRef.current] = [];
          isInterjecting = true;
          // console.log(
          //   '%cSTT-callback%c Interjection! ',
          //   'color:#fff',
          //   'background: #222; color: #bada55',
          // );
        }
        prevSpeakerRef.current = activeSpeakerRef.current;
        activeSpeakerRef.current = textstream.uid;
      }

      /* creating [] for each user to store their complete transcripts
       initializing captions state for cuurent speaker
       ex: {282190954:[]}
    */
      if (!finalList[textstream.uid]) {
        finalList[textstream.uid] = [];
        finalTranscriptList[textstream.uid] = [];
      }

      const words = textstream.words; //[Word,Word]

      /* categorize words into final & nonFinal objects per uid
      Final Word Ex : {
      "text": "Hello, are you doing?",
      "durationMs": 960,
      "isFinal": true,
      "confidence": 0.8549408316612244
      }
  */

      for (const word of words) {
        if (word.isFinal) {
          finalText = finalText + word.text;
        } else {
          nonFinalText =
            word.text !== '.' ? nonFinalText + word.text : nonFinalText;
          if (!captionStartTime) {
            captionStartTime = performance.now();
          }
        }
      }

      if (finalText) {
        finalList[textstream.uid].push(finalText);
        finalTranscriptList[textstream.uid].push(finalText);
        currentFinalText = finalText;
        // log info to show measure the duration of passes in which a sentence gets finalized
        const duration = performance.now() - captionStartTime;
        console.log(
          `stt-Time taken to finalize caption ${currentFinalText}: ${duration}ms`,
        );
        captionStartTime = null; // Reset start time
      }

      /* Updating Meeting Transcript */
      if (currentFinalText.length) {
        setMeetingTranscript(prevTranscript => {
          const lastTranscriptIndex = prevTranscript.length - 1;
          const lastTranscript =
            lastTranscriptIndex >= 0
              ? prevTranscript[lastTranscriptIndex]
              : null;

          /*
            checking if the last item transcript matches with current uid
            If yes then updating the last transcript msg with current text
            If no then adding a new entry in the transcript
          */
          if (lastTranscript && lastTranscript.uid === textstream.uid) {
            const updatedTranscript = {
              ...lastTranscript,
              //text: lastTranscript.text + ' ' + currentFinalText, // missing few updates with reading prev values
              text: finalTranscriptList[textstream.uid].join(' '),
            };

            return [
              ...prevTranscript.slice(0, lastTranscriptIndex),
              updatedTranscript,
            ];
          } else {
            finalTranscriptList[textstream.uid] = [currentFinalText];

            return [
              ...prevTranscript,
              {
                uid: textstream.uid,
                time: new Date().getTime(),
                text: currentFinalText,
              },
            ];
          }
        });
      }

      /*
     Previous final words of the uid are prepended and
     then current non final words so that context of speech is not lost
    */
      const existingStringBuffer = isInterjecting
        ? ''
        : finalList[textstream.uid]?.join(' ');
      const latestString = nonFinalText;
      const captionText =
        existingStringBuffer.length > 0
          ? existingStringBuffer + ' ' + latestString
          : latestString;

      // updating the captions
      captionText &&
        setCaptionObj(prevState => {
          return {
            ...prevState,
            [textstream.uid]: {
              text: captionText,
              lastUpdated: new Date().getTime(),
            },
          };
        });

      // console.group('STT-logs');
      // console.log('Recived uid =>', textstream.uid);
      // console.log('PrevSpeaker uid =>', prevSpeakerRef.current);
      // console.log('ActiveSpeaker uid=>', activeSpeakerRef.current);
      // console.log('final List =>', finalList);
      // console.groupEnd();
    };
    (async () => {
      await queue.add(() => queueCallback(args));
      console.log('stt- using pq queue');
    })();
  };

  return {
    streamMessageCallback,
  };
};

export default useStreamMessageUtils;
