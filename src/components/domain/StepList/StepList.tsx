import StepItem from '../StepItem/StepItem';
import styles from './StepList.module.css';
import { StepListProps } from './StepList.props';

export function StepList({ steps }: StepListProps) {
	if (!steps) {
		return <div>No steps</div>;
	}
	return (
		<>
			<h2 className={styles.title}>STEP-BY-STEP PHOTO RECIPE</h2>
			<ul className={styles.list}>
				{steps.map((step, index) => (
					<div key={step.id} className={styles.step}>
						<span className={styles['step-tag']}>
							Step {index + 1}
						</span>
						<StepItem step={step} />
					</div>
				))}
			</ul>
		</>
	);
}
