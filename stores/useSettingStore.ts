import { FIREBASE_DB } from '@/firebase';
import { log } from '@/utils/logger'
import { addDoc, collection } from 'firebase/firestore';
import * as CollectionStrings from '../constants/Firebase';

interface CreateNewBugReportParams {
	userId: string,
	description: string,
	title: string,
	contact?: string
}

interface SendFeedbackRequestParams {
	userId: string,
	title: string,
	message: string,
	contact?: string
}

export const createNewBugReport = async ({ contact, userId, description, title }: CreateNewBugReportParams) => {
	try {
		log.debug(`Creating new bug report for user: ${userId}`);

		await addDoc(collection(
			FIREBASE_DB,
			CollectionStrings.FIREBASE_BUG_REPORT_COLLECTION,
			new Date().toISOString(),
			userId
		), {
			description,
			title,
			userId,
			contact
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
			CollectionStrings.FIREBASE_BUG_REPORT_COLLECTION,
			new Date().toISOString(),
			crypto.randomUUID()
		), {
			message,
			title,
			userId,
			contact
		});

		log.debug('New feature request submitteed!');
	} catch (error) {
		log.debug(`Error submitting feature request for user: ${userId}`);
		log.error(error);
		throw error;
	}
}
