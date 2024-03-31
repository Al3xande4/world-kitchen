import { StepItemProps } from './StepItem.props';
import styles from './StepItem.module.css';
import { memo, useState } from 'react';
import { Modal } from '../../ui/Modal/Modal';
import cn from 'classnames';

function StepItem({ step }: StepItemProps) {
	const [modal, setModal] = useState(false);

	return (
		<div className={styles.step}>
			<Modal
				className={cn(styles['modal_wrapper'], {
					[styles.hidden]: !modal,
				})}
			>
				<div className={styles.modal}>
					<button
						onClick={() => {
							setModal(false);
						}}
						className={styles.close}
					>
						<img
							className={styles['close-icon']}
							src='/close.svg'
						></img>
					</button>
					<img
						src={step.imageUrl}
						className={styles['modal_img']}
					></img>
				</div>
			</Modal>
			<img
				onClick={() => {
					setModal(true);
				}}
				className={styles.preview}
				src={step.imageUrl}
				alt='Step preview'
			></img>
			<h3 className={styles.description}>{step.description}</h3>
		</div>
	);
}

export default memo(StepItem);
