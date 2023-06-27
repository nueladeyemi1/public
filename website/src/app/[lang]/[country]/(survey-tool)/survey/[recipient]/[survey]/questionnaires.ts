import { SurveyQuestionnaire } from '@socialincome/shared/src/types/admin/Survey';
import { TranslateFunction } from '@socialincome/shared/src/utils/i18n';
import {
	achievementsAchievedPage,
	basicNeedsCoveragePage,
	dependentsPage,
	deptPage,
	disabilityPage,
	educationAccessPage,
	employmentStatusPage,
	expensesCoveredPage,
	financialSituationPage,
	happierPage,
	livingLocationPage,
	longEnoughPage,
	maritalStatusPage,
	moreFinanciallySecurePage,
	ownIncomePage,
	plannedAchievementsPage,
	savingsPage,
	selfSustainablePage,
	spendingPage,
	unexpectedExpensesCoveredPage,
	welcomePage,
} from './questions';

export const getQuestionnaire = (questionnaire: SurveyQuestionnaire, t: TranslateFunction, name: string) => {
	switch (questionnaire) {
		case SurveyQuestionnaire.Onboarding:
			return onboardingQuestionnaire(t, name);
		case SurveyQuestionnaire.Checkin:
			return checkinQuestionnaire(t, name);
		case SurveyQuestionnaire.Offboarding:
			return offboardingQuestionnaire(t, name);
		case SurveyQuestionnaire.OffboardedCheckin:
			return offboardingCheckinQuestionnaire(t, name);
	}
	return [];
};

export const onboardingQuestionnaire = (t: TranslateFunction, name: string) => [
	welcomePage(t, name),
	financialSituationPage(t),
	maritalStatusPage(t),
	dependentsPage(t),
	employmentStatusPage(t),
	disabilityPage(t),
	livingLocationPage(t),
	basicNeedsCoveragePage(t),
	expensesCoveredPage(t),
	unexpectedExpensesCoveredPage(t),
	educationAccessPage(t),
	savingsPage(t),
	deptPage(t),
	plannedAchievementsPage(t, true),
];

export const checkinQuestionnaire = (t: TranslateFunction, name: string) => [
	welcomePage(t, name),
	financialSituationPage(t),
	maritalStatusPage(t),
	dependentsPage(t),
	employmentStatusPage(t),
	disabilityPage(t),
	livingLocationPage(t),
	spendingPage(t),
	ownIncomePage(t),
	plannedAchievementsPage(t, false),
	basicNeedsCoveragePage(t),
	expensesCoveredPage(t),
	unexpectedExpensesCoveredPage(t),
	educationAccessPage(t),
	savingsPage(t),
	deptPage(t),
];

export const offboardingQuestionnaire = (t: TranslateFunction, name: string) => [
	welcomePage(t, name),
	financialSituationPage(t),
	achievementsAchievedPage(t),
	moreFinanciallySecurePage(t),
	happierPage(t),
	longEnoughPage(t),
	selfSustainablePage(t),
	maritalStatusPage(t),
	dependentsPage(t),
	employmentStatusPage(t),
	disabilityPage(t),
	livingLocationPage(t),
	spendingPage(t),
	basicNeedsCoveragePage(t),
	expensesCoveredPage(t),
	unexpectedExpensesCoveredPage(t),
	educationAccessPage(t),
	savingsPage(t),
	deptPage(t),
];

export const offboardingCheckinQuestionnaire = (t: TranslateFunction, name: string) => [
	welcomePage(t, name),
	financialSituationPage(t),
	maritalStatusPage(t),
	dependentsPage(t),
	employmentStatusPage(t),
	disabilityPage(t),
	livingLocationPage(t),
	spendingPage(t),
	basicNeedsCoveragePage(t),
	expensesCoveredPage(t),
	unexpectedExpensesCoveredPage(t),
	educationAccessPage(t),
	savingsPage(t),
	deptPage(t),
];