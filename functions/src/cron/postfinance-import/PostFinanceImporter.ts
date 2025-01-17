import * as functions from 'firebase-functions';

import imaps from 'imap-simple';

import _ from 'lodash';
import { Source, simpleParser } from 'mailparser';
import { FirestoreAdmin } from '../../../../shared/src/firebase/admin/FirestoreAdmin';
import { BANK_BALANCE_FIRESTORE_PATH, BankBalance, getIdFromBankBalance } from '../../../../shared/src/types';
import { POSTFINANCE_EMAIL_PASSWORD, POSTFINANCE_EMAIL_USER } from '../../config';

export class PostFinanceImporter {
	private readonly accountRegex = /(?<=account\W)(?<account>.*?)(?=\W)/; // regex to retrieve the account name from the email
	private readonly balanceRegex = /balance: CHF (?<balance>[0-9’.]*)/; // regex to retrieve the balance from the email
	// we retrieve only unseen mails and mark them as seen once we imported the balance
	private readonly searchCriteria = ['UNSEEN'];
	private readonly fetchOptions = { bodies: ['HEADER', 'TEXT', ''], markSeen: true };
	private readonly firestoreAdmin: FirestoreAdmin;

	constructor() {
		this.firestoreAdmin = new FirestoreAdmin();
	}

	extractBalance = (html: String) => {
		return Number.parseFloat(html.match(this.balanceRegex)!.groups!['balance'].replace('’', ''));
	};

	storeBalances = async (balances: BankBalance[]): Promise<void> => {
		for await (const balance of balances) {
			await this.firestoreAdmin
				.doc<BankBalance>(BANK_BALANCE_FIRESTORE_PATH, getIdFromBankBalance(balance))
				.set(balance);
		}
	};

	extractAccount = (html: String) => {
		return html.match(this.accountRegex)!.groups!['account'].toLowerCase();
	};

	retrieveBalanceMails = async (): Promise<BankBalance[]> => {
		try {
			functions.logger.info('Start checking balance inbox');
			const config = {
				imap: {
					user: POSTFINANCE_EMAIL_USER,
					password: POSTFINANCE_EMAIL_PASSWORD,
					host: 'imap.gmail.com',
					port: 993,
					tls: true,
					tlsOptions: { rejectUnauthorized: false },
					authTimeout: 10000,
				},
			};
			const connection = await imaps.connect(config);
			await connection.openBox('INBOX');
			functions.logger.info('Connected to inbox');
			const messages = await connection.search(this.searchCriteria, this.fetchOptions);
			const balances = await Promise.all(
				messages.map(async (item: any) => {
					const all = _.find(item.parts, { which: '' });
					const id = item.attributes.uid;
					const idHeader = 'Imap-Id: ' + id + '\r\n';
					const source = idHeader + all?.body;
					return this.parseEmail(source);
				}),
			);
			connection.end();
			functions.logger.info('Retrieved balances');
			return balances.flat();
		} catch (error) {
			functions.logger.error('Could not ingest balance mails', error);
			return [];
		}
	};

	parseEmail = async (source: Source): Promise<BankBalance[]> => {
		const mail = await simpleParser(source);
		if (!mail || !mail.html) return [];
		try {
			return [
				{
					timestamp: mail.date!.getTime() / 1000,
					account: this.extractAccount(mail.html),
					balance: this.extractBalance(mail.html),
					currency: 'CHF',
				} as BankBalance,
			];
		} catch {
			functions.logger.info(`Could not parse email with subject ${mail.subject}`);
			return [];
		}
	};
}
