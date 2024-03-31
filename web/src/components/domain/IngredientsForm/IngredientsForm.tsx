import { useEffect, useState } from 'react';
import { useDebounce } from '../../../hooks/debounce.hook';
import axios from 'axios';
import { Input } from '../../ui/Input/Input';
import { IngredientSearch } from '../IngredientSearch/IngredientSearch';

export function IngredientsForm({}) {
	return <IngredientSearch />;
}
