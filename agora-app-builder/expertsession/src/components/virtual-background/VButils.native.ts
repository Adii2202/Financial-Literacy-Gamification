import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveImagesToAsyncStorage = async (
  base64Data: string,
): Promise<void> => {
  try {
    const timestampId = new Date().getTime();
    const key = `image_${timestampId}`;

    await AsyncStorage.setItem(key, base64Data);

    console.log('Image saved to AsyncStorage with key:', key);
  } catch (error) {
    console.error('Error saving image to AsyncStorage:', error);
  }
};

export const retrieveImagesFromAsyncStorage = async (): Promise<string[]> => {
  try {
    const keys = await AsyncStorage.getAllKeys();

    // filtering out keys that are saved for VB
    const imageKeys = keys.filter(key => key.startsWith('image_'));
    const retrievedImages: string[] = await Promise.all(
      imageKeys.map(async key => {
        const imageData = await AsyncStorage.getItem(key);
        return imageData || '';
      }),
    );

    console.log('Retrieved images from AsyncStorage:', retrievedImages);
    return retrievedImages;
  } catch (error) {
    console.error('Error retrieving images from AsyncStorage:', error);
    throw error;
  }
};
