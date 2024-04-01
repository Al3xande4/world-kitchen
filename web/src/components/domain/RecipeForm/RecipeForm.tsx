import { FormEvent, useEffect, useState } from 'react';
import { Label } from '../../ui/Label/Label';
import { Input } from '../../ui/Input/Input';
import { Button } from '../../ui/Button/Button';
import styles from './RecipeForm.module.css';
import cn from 'classnames';
import { deleteImage, saveImage } from '../../../helpers/firebase';
import { Loader } from '../../ui/Loader/Loader';
import { authHost } from '../../../http';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { Textarea } from '../../ui/Textarea/Textarea';
import { IngredientsForm } from '../IngredientsForm/IngredientsForm';
import { Ingredient } from '../../../core/Ingredient';

interface RecipeFormState {
	title: {
		value: string;
	};

	description: {
		value: string;
	};
}

interface StepState {
	description: string;
	img: string | null;
	loading: boolean;
}

function RecipeForm() {
	const [steps, setSteps] = useState<StepState[]>([
		{ description: '', img: null, loading: false },
	]);
	const [preview, setPreview] = useState<string | null>(null);
	const [previewLoading, setPreviewLoading] = useState<boolean>(false);
	const [loading, setLoading] = useState(false);
	const [ingredients, setIngredients] = useState<Ingredient[]>([]);
	const navigate = useNavigate();

	const addStep = () => {
		if (loading) {
			setTimeout(() => {
				setSteps((prev) => [
					...prev,
					{ description: '', img: null, loading: false },
				]);
			}, 200);
			return;
		}
		setSteps((prev) => [
			...prev,
			{ description: '', img: null, loading: false },
		]);
	};

	useEffect(() => {
		return () => {
			if (preview) deleteImage(preview);
			steps.forEach((el) => {
				if (el.img) {
					deleteImage(el.img);
				}
			});
		};
	}, []);

	const previewChange = async (file: File | null) => {
		if (!file) {
			return;
		}
		setPreviewLoading(true);
		if (preview) await deleteImage(preview);
		const path = await saveImage(file);
		setPreviewLoading(false);
		setPreview(path);
	};

	const removeStepPhoto = async (id: number) => {
		setSteps((prev) =>
			prev.map((el, index) => {
				if (index == id) {
					if (el.img) {
						deleteImage(el.img);
					}

					return {
						...el,
						img: null,
						loading: false,
					};
				}
				return el;
			})
		);
	};

	const addIngredient = ({ measure, count, title, imageUrl }: Ingredient) => {
		setIngredients((prev) => [
			...prev,
			{ count, measure, title, imageUrl },
		]);
	};

	const handleStepPhotoChange = async (file: File | null, id: number) => {
		if (!file) {
			return;
		}
		setSteps((prev) =>
			prev.map((el, index) => {
				if (index == id) {
					return {
						...el,
						loading: true,
					};
				}
				return el;
			})
		);
		const path = await saveImage(file);
		setSteps((prev) =>
			prev.map((el, index) => {
				if (index == id) {
					if (el.img) {
						deleteImage(el.img);
					}

					return {
						...el,
						img: path,
						loading: false,
					};
				}
				return el;
			})
		);
	};

	const handleStepChangeDescription = (value: string, id: number) => {
		setSteps((prev) =>
			prev.map((el, index) => {
				if (index == id) {
					return {
						...el,
						description: value,
					};
				}
				return el;
			})
		);
	};

	const removeStep = (index: number) => {
		const newSteps = [...steps];
		const step = newSteps.splice(index, 1)[0];
		if (step.img) {
			deleteImage(step.img);
		}
		setSteps(newSteps);
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		const formData = e.target as typeof e.target & RecipeFormState;

		const newSteps =
			steps.length === 0
				? []
				: steps.map((el) => {
						if (el.img) {
							return {
								imageUrl: el.img,
								description: el.description,
							};
						}
						return null;
				  });

		const formatedSteps = [];
		for (let i = 0; i < newSteps.length; i++) {
			const item = newSteps[i];
			if (item) {
				formatedSteps.push(item);
			}
		}
		try {
			setLoading(true);
			const {} = await authHost.post('/recipes', {
				previewUrl: preview,
				title: formData.title.value,
				recipe: formData.description.value,
				ingredients,
				steps: formatedSteps,
			});
			setLoading(false);
			navigate('/account');
		} catch (error) {
			if (error instanceof AxiosError) {
				console.info(error.message);
			}
			setLoading(false);
		}
	};

	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			<Label>Ready course photo</Label>
			<div className={styles['img-uploader-wrapper']}>
				<input
					required
					onChange={(e) => {
						previewChange(
							e.target.files ? e.target.files[0] : null
						);
					}}
					className={cn(
						styles['visually-hidden'],
						styles['preview-input']
					)}
					id='preview'
					name='preview'
					type='file'
				></input>
				<label
					className={styles['preview-input-label']}
					htmlFor='preview'
				>
					<div
						className={cn(styles.container, {
							[styles.hidden]: preview || previewLoading,
						})}
					>
						<img src='/hand.svg'></img>
						<p className={styles['upload-btn']}>
							<img
								className={styles['upload-icon']}
								src='/camera-icon-green.svg'
							></img>
							Upload Photo
						</p>
					</div>
					<Loader
						className={cn({
							[styles.hidden]: !previewLoading,
						})}
					></Loader>
					<img
						src={preview ?? ''}
						className={cn(styles['preview-img'], {
							[styles.hidden]: !preview || previewLoading,
						})}
					></img>
				</label>
			</div>
			<fieldset className={styles.fieldset}>
				<Label htmlFor='title' className={styles.label}>
					Recipe Name
				</Label>
				<Input
					required
					placeholder='For example: Cake "Napoleon"'
					id='title'
					name='title'
					className={styles.input}
					type='text'
				/>
			</fieldset>

			<fieldset className={styles.fieldset}>
				<Label htmlFor='description' className={styles.label}>
					Recipe Description
				</Label>
				<Textarea
					required
					placeholder='Tell us why you chose this recipe'
					id='description'
					name='description'
					className={styles.input}
				/>
			</fieldset>
			<h3 className={styles['steps-title']}>Ingredients</h3>
			<ul className={styles['ingredients-list']}>
				{ingredients.map((el, index) => (
					<li className={styles.ingredient} key={index}>
						<span>{el.title}</span>, {el.count} {el.measure}
					</li>
				))}
			</ul>
			<IngredientsForm onAdd={addIngredient} />

			<h3 className={styles['steps-title']}>how to cook</h3>
			{steps.map((step, index) => (
				<div className={styles.step} key={index}>
					<div className={styles['step-row']}>
						<Label
							htmlFor={`step-details-${index}`}
							className={styles['step-tag']}
						>
							Step {index + 1}
						</Label>

						<button
							className={styles['remove-step-btn']}
							type='button'
							onClick={() => removeStep(index)}
						>
							<img
								className={styles['remove-step-icon']}
								src='/trash-can-svgrepo-com.svg'
							></img>
						</button>
					</div>

					<Textarea
						id={`step-details-${index}`}
						name={`step-details-${index}`}
						onChange={(e) => {
							handleStepChangeDescription(e.target.value, index);
						}}
						value={step.description}
						placeholder='For example, "Clean vegetables, boil water"'
					/>

					<fieldset className={styles['img-upload']}>
						<input
							className={cn(styles['visually-hidden'])}
							id={`step-file-${index}`}
							type='file'
							name='step-preview'
							onChange={(e) => {
								handleStepPhotoChange(
									e.target.files ? e.target.files[0] : null,
									index
								);
							}}
							value={''}
						/>
						{step.loading && <Loader></Loader>}
						<div
							className={cn(styles['step-img-container'], {
								[styles.hidden]: !step.img || step.loading,
							})}
						>
							<img
								src={step.img ?? ''}
								alt=''
								className={cn(styles['loaded-img'], {
									[styles.hidden]: !step.img || step.loading,
								})}
							/>

							<button
								className={cn(styles['remove-step-img'], {
									[styles.hidden]: !step.img || step.loading,
								})}
								onClick={() => {
									removeStepPhoto(index);
								}}
							>
								<img src='/trash-icon.svg' />
							</button>
						</div>
						<label
							className={cn(styles['upload-step-img'], {
								[styles.hidden]: step.img,
							})}
							htmlFor={`step-file-${index}`}
						>
							<img
								className={styles['camera-icon']}
								src='/camera-icon.svg'
							></img>
						</label>
					</fieldset>
				</div>
			))}
			<Button
				className={styles['add-btn']}
				fillType='outlined'
				type='button'
				onClick={addStep}
			>
				<svg
					className={styles['add-icon']}
					viewBox='0 0 14 14'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path
						d='M7 1v12m6-6H1'
						stroke='currentColor'
						strokeWidth='2'
						strokeLinecap='round'
					></path>
				</svg>
				Add Step
			</Button>

			<Button
				className={styles['submit-btn']}
				fillType='filled'
				type='submit'
				disabled={loading}
			>
				{loading ? 'Submitting...' : 'Send A Recipe'}
			</Button>
		</form>
	);
}

export default RecipeForm;
