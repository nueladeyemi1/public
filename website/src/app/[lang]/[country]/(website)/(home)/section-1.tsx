import { DefaultPageProps } from '@/app/[lang]/[country]';
import { Translator } from '@socialincome/shared/src/utils/i18n';
import { BaseContainer, Typography } from '@socialincome/ui';
import Section1Input from './section-1-input';

export default async function Section1({ params }: DefaultPageProps) {
	const translator = await Translator.getInstance({
		language: params.lang,
		namespaces: ['website-home'],
	});

	return (
		<BaseContainer className="bg-blue-50">
			<div className="flex min-h-[calc(100vh-theme(spacing.20))] flex-col items-center lg:flex-row">
				<div className="flex flex-1 items-center p-4 text-center lg:p-8 lg:text-left">
					<Typography size="4xl" weight="bold" lineHeight="relaxed">
						{translator.t('section-1.title-1')}
						<Typography as="span" size="4xl" weight="bold" color="accent" lineHeight="relaxed">
							{translator.t('section-1.title-2')}
						</Typography>
						{translator.t('section-1.title-3')}
					</Typography>
				</div>
				<div className="flex flex-1 flex-col p-4 text-center lg:p-8 lg:text-left">
					<Typography size="2xl">{translator.t('section-1.income-text')}</Typography>
					<Section1Input text={translator.t('section-1.income-text')} />
				</div>
			</div>
		</BaseContainer>
	);
}
