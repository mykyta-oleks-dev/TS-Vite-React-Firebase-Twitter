import { ChevronDownIcon } from 'lucide-react';
import { Button } from './ui/button/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const DatePicker = ({
	date,
	setDate,
	className,
}: {
	date?: Date;
	setDate: (date?: Date) => void;
	className?: string;
}) => {
	const [open, setOpen] = useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					id="date"
					className={cn(
						'min-w-48 justify-between font-normal',
						className
					)}
				>
					{date ? date.toLocaleDateString() : 'Select date'}
					<ChevronDownIcon />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="w-auto overflow-hidden p-0"
				align="start"
			>
				<Calendar
					mode="single"
					selected={date}
					captionLayout="dropdown"
					onSelect={(date) => {
						setDate(date);
						setOpen(false);
					}}
				/>
			</PopoverContent>
		</Popover>
	);
};

export default DatePicker;
