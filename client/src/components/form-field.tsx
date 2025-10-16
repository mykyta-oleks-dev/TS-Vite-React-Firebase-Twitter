import type { ReactNode } from 'react';
import type { Control, ControllerRenderProps, Path } from 'react-hook-form';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from './ui/form';

interface GenericFormFieldsProps<
	TFormFields extends Record<string, string | number>
> {
	label?: string;
	control: Control<TFormFields>;
	name: Path<TFormFields>;
	render: (field: ControllerRenderProps<TFormFields, Path<TFormFields>>) => ReactNode
}

function FormFieldGroup<TFormFields extends Record<string, string | number>>({
	label,
	control,
	name,
	render,
}: Readonly<GenericFormFieldsProps<TFormFields>>) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					{label && <FormLabel>{label}</FormLabel>}
					<FormControl>
						{render(field)}
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

export default FormFieldGroup;
