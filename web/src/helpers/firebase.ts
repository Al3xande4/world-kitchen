import { initializeApp } from 'firebase/app';
import {
	deleteObject,
	getDownloadURL,
	getStorage,
	ref,
	uploadBytes,
} from 'firebase/storage';
import { v4 } from 'uuid';

// Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyAnjqOJdAByWu3ybi4lHtr_7RzoxfJntK0',
	authDomain: 'world-kitchen-84f19.firebaseapp.com',
	projectId: 'world-kitchen-84f19',
	storageBucket: 'gs://world-kitchen-84f19.appspot.com',
	messagingSenderId: '101092178476',
	appId: '1:101092178476:web:35752c2b9083ab7d1c2f89',
	measurementId: 'G-8TK8CX446Y',
};

// Initialize Firebase
export const initFirebase = () => {
	return initializeApp(firebaseConfig);
};

export const saveImage = async (img: File) => {
	const storage = getStorage();
	const storageRef = ref(storage, `images/${v4()}`);
	const snapshot = await uploadBytes(storageRef, img);
	return getDownloadURL(snapshot.ref);
};

export const deleteImage = async (path: string) => {
	try {
		const storage = getStorage();
		const storageRef = ref(storage, path);
		return await deleteObject(storageRef);
	} catch (e) {}
};
