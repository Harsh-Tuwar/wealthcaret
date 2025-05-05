import { FIREBASE_DB } from '@/firebase';
import { log } from '@/utils/logger'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import * as CollectionStrings from '../constants/Firebase';
import { CreateNewBugReportParams, SendFeedbackRequestParams, UpdateAccountInfoParams } from '@/types/types';
import { useAuthStore } from './useAuthStore';

export const createNewBugReport = async ({ contact, userId, description, title }: CreateNewBugReportParams) => {
	try {
		log.debug(`Creating new bug report for user: ${userId}`);

		await addDoc(collection(
			FIREBASE_DB,
			CollectionStrings.FIREBASE_BUG_REPORT_COLLECTION,
			userId,
			new Date().toISOString().split('T')[0],
		), {
			description,
			title,
			userId,
			contact,
			submittedAt: new Date().toISOString()
		});

		log.debug('New bug report created!');
	} catch (error) {
		log.debug(`Error creating new bug report for user: ${userId}`);
		log.error(error);
		throw error;
	}
}

export const sendFeedbackRequest = async (params: SendFeedbackRequestParams) => {
	const { message, title, userId, contact } = params;

	try {
		log.debug(`Creating new feature request for user: ${userId}`);

		await addDoc(collection(
			FIREBASE_DB,
			CollectionStrings.FIREBASE_FEATURE_REQ_COLLECTION,
			userId,
			new Date().toISOString().split('T')[0],
		), {
			message,
			title,
			userId,
			contact,
			submittedAt: new Date().toISOString()
		});

		log.debug('New feature request submitteed!');
	} catch (error) {
		log.debug(`Error submitting feature request for user: ${userId}`);
		log.error(error);
		throw error;
	}
}

export const updateAccountInfo = async (params: UpdateAccountInfoParams) => {
	const { bio, dob, name, phone, uid, email } = params;

	try {
		log.debug(`Updating information for user: ${uid}`);

		const userRef = doc(FIREBASE_DB, CollectionStrings.FIREBASE_USERS_COLLECTION, uid);

		await updateDoc(userRef, {
			bio,
			dob,
			name,
			phone
		});

		useAuthStore.getState().setFsUser({
			email,
			bio,
			dob,
			name,
			phone,
			uid,
		});

		log.debug('Updated user information!');
	} catch (error) {
		log.debug(`Error updating user info for user: ${uid}`);
		log.error(error);
		throw error;
	}
}