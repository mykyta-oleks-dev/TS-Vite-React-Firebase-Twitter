import type { ReactNode } from 'react';
import type {
	Control,
	ControllerRenderProps,
	FieldValues,
	Path,
} from 'react-hook-form';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from './ui/form';

interface GenericFormFieldsProps<TFormFields extends FieldValues> {
	label?: string;
	control: Control<TFormFields>;
	name: Path<TFormFields>;
	render: (
		field: ControllerRenderProps<TFormFields, Path<TFormFields>>
	) => ReactNode;
	className?: string;
}

function FormFieldGroup<TFormFields extends FieldValues>({
	label,
	control,
	name,
	render,
	className,
}: Readonly<GenericFormFieldsProps<TFormFields>>) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className={className}>
					{label && <FormLabel>{label}</FormLabel>}
					<FormControl>{render(field)}</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

export default FormFieldGroup;
