import { UnitSelectorProps } from './UnitSelector.props';
import styles from './UnitSelector.module.css';
import cn from 'classnames';
import { MenuItem, Select } from '@mui/material';

export function UnitSelector({ className, units, setUnit }: UnitSelectorProps) {
	if (units.length === 0) {
		return;
	}
	return (
		<Select
			onChange={(e) => {
				setUnit(e.target.value);
			}}
			className={cn(styles.select, className)}
		>
			{units.map((el) => (
				<MenuItem key={el} value={el}>
					{el}
				</MenuItem>
			))}
		</Select>
	);
}
