import { memo, useEffect, useState } from 'react';
import { useDebounce } from '../../../hooks/debounce.hook';
import axios from 'axios';
import { Input } from '../../ui/Input/Input';
import cn from 'classnames';
import styles from './IngredientSearch.module.css';
import { IngredientSearchProps } from './IngredientSearch.props';
import { Autocomplete, TextField } from '@mui/material';

export interface IngredientState {
	main_title: string;
	id: number;
	name: string;
	image: string;
	possibleUnits: string[];
}

function IngredientSearch(props: IngredientSearchProps) {
	const [ingredients, setIngredients] = useState<IngredientState[]>([]);
	const [selected, setSelected] = useState<
		IngredientState | null | undefined
	>(null);
	const [isFocused, setIsFocused] = useState(false);
	const [search, setSearch] = useState('');

	useEffect(() => {
		searchIngredient(search);
	}, [search]);

	useEffect(() => {
		props.setSelected(selected);
	}, [selected, props]);

	const searchIngredient = useDebounce(async (search: string) => {
		if (!search) {
			setIngredients([]);
			return;
		}
		try {
			// const { data } = await axios.get(
			// 	'https://tasty.p.rapidapi.com/recipes/auto-complete',
			// 	{
			// 		params: {
			// 			prefix: search,
			// 		},
			// 		headers: {
			// 			'X-RapidAPI-Key':
			// 				'fe0c02203dmsh410f1cfe2ac974fp10194cjsn9b33784633db',
			// 			'X-RapidAPI-Host': 'tasty.p.rapidapi.com',
			// 		},
			// 	}
			// );
			const { data } = await axios.get(
				`https://api.spoonacular.com/food/ingredients/autocomplete?number=5&apiKey=fa08b446af4b487a9c25cc0bdcf5b96e&query=${search}&number=5&metaInformation=true`
			);
			// 			const { data } = await axios.get(
			// 				`https://api.food.ru/content/products?page=1&query=${search}&max_per_page=3&format=json&lang=en`,
			// 				{
			// 					headers: {
			// 						Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJFRlBVcWRLamZTVG9vR09POWRpLURKQk4zWkgyaUxlcE5yWTF3dXgyNHFvIn0.eyJleHAiOjE3MTE4NjI2MDIsImlhdCI6MTcxMTg2MjI0MiwiYXV0aF90aW1lIjoxNzExODYyMjQwLCJqdGkiOiI4ZDk4NWY5YS0zNGEzLTRkZDEtOWUwMy04YWQwMTZmNTdlZjgiLCJpc3MiOiJodHRwczovL2lkLng1LnJ1L2F1dGgvcmVhbG1zL3Nzb3g1aWQiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiZjo2NmI5YWQ2MC00Y2I0LTRlZTEtYjlhMC0wNTI4ZmRlYWMyYjE6MzIyMTM5NjIiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJ4NW1lZGlhX3dlYiIsIm5vbmNlIjoiNmI4YTJkMTQtNmY0ZC00ZTgzLTgzYmYtZjM2ODY3NjhlZTNmIiwic2Vzc2lvbl9zdGF0ZSI6IjMyNmFmZDM0LWVkMTUtNDUzMC04ODU1LTY5MzYyYTVkYTEwYyIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBvZmZsaW5lX2FjY2VzcyBwcm9maWxlIGVtYWlsIiwic2lkIjoiMzI2YWZkMzQtZWQxNS00NTMwLTg4NTUtNjkzNjJhNWRhMTBjIiwic291cmNlX2RldGFpbCI6IndlYiIsInBlcm1pc3Npb25NYXJrZXRpbmciOiJZIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJuYW1lIjoi0JDQu9C10LrRgdCw0L3QtNGAINCc0YPRhdCw0YfQtdCyICIsImNpcF9pZCI6IklEWC4zMjIxMzk2MiIsInByZWZlcnJlZF91c2VybmFtZSI6Ijc5MTkzMzE5Njg3IiwiZ2l2ZW5fbmFtZSI6ItCQ0LvQtdC60YHQsNC90LTRgCIsImZhbWlseV9uYW1lIjoi0JzRg9GF0LDRh9C10LIgIiwiZW1haWwiOiJkamFkYXkyMDE2MUBnbWFpbC5jb20iLCJ4NWlkIjoiMzIyMTM5NjIifQ.fods7MjfD_DZVZ6_K_uzFg9VmrBJTdZLwwwyh8tXEJblC4LgYI3ICJMRmeX06S7-yqrcjzhOw0NgoNbfFCUE-sp8LQUdMM2a6ZZZ62B33jNP4WvN9Kdsogq2P8-w48qdzWmbdRRL8kSHM0Cl6hutS9oDtFd35nUmQUXo4U0ZE74QGqRwRQL2sofrDB5Jxg5w3Q4_0oz1NVb_HkIyCXT4rgXUIDtsjKwgyGo2wi1uNKlTl0gHazhaUNESgsTLVldqAxuDa71HfDSupS0KFBLBV_Tf5Ui9ZX7F4t1HZ8UpcqeSfcWhZOIWt-F3uiPhOjdHCrLclG-yk5-WSKpQslXd2g
			// `,
			// 					},
			// 				}
			// 			);
			setIngredients(data);
		} catch (e) {
			setIngredients([]);
		}
	}, 150);
	return (
		<Autocomplete
			className={cn(styles.autocomplete, props.className)}
			onChange={(_, newValue) => {
				setSelected(ingredients.find((el) => el.name == newValue));
			}}
			onInputChange={(_, newValue) => {
				setSearch(newValue);
			}}
			options={ingredients.map((el) => el.name)}
			renderInput={(params) => <TextField {...params} label='' />}
		/>
	);
	// return (
	// 	<div className={cn(styles.wrapper, props.className)}>
	// 		<Input
	// 			className={styles.input}
	// 			onFocus={() => {
	// 				setIsFocused(true);
	// 			}}
	// 			onBlur={() => {
	// 				setTimeout(() => {
	// 					setSearch('');
	// 					setIngredients([]);
	// 					setIsFocused(false);
	// 				}, 200);
	// 			}}
	// 			placeholder={selected ? selected.name : 'For example: Chicken'}
	// 			onChange={(e) => {
	// 				setSearch(e.target.value);
	// 			}}
	// 			value={search}
	// 		/>
	// 		<ul
	// 			className={cn(styles.list, {
	// 				[styles.hidden]: !isFocused,
	// 			})}
	// 		>
	// 			{(ingredients.length == 0 || search == '') && (
	// 				<div className={styles.item}>
	// 					Couldn't find the ingredient
	// 				</div>
	// 			)}
	// 			{ingredients.map((el) => (
	// 				<li
	// 					key={el.id}
	// 					onClick={() => {
	// 						setSelected(el);
	// 					}}
	// 					className={styles.item}
	// 					value={el.id}
	// 				>
	// 					{el.name}
	// 				</li>
	// 			))}
	// 		</ul>
	// 	</div>
	// );
}

export default memo(IngredientSearch);
