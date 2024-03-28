import { useParams } from 'react-router-dom';
import styles from './Reset.module.css';
import { Wrapper } from '../../components/ui/Wrapper/Wrapper';
import { Heading } from '../../components/ui/Heading/Heading';
import { ResetForm } from '../../components/domain/ResetForm/ResetForm';

export function ResetPage() {
	const { link } = useParams();
	return (
		<div className={styles.reset}>
			<Wrapper>
				<div className={styles['reset-inner']}>
					<Heading className={styles.title}>
						Reset account password
					</Heading>
					<ResetForm link={link ?? ''} />
				</div>
			</Wrapper>
		</div>
	);
}
