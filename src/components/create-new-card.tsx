import { Button } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { CreateNewCardSchema, type CreateNewCard } from "../schemas/cards";
import { createGreetingCard } from "wasp/client/operations";
import { useState } from "react";

export function CreateCardButton() {
	const [open, setOpen] = useState(false);

	const form = useForm<CreateNewCard>({
		resolver: zodResolver(CreateNewCardSchema),
		defaultValues: {
			description: "",
		},
	});

	const onSubmit = form.handleSubmit(async (data) => {
		try {
			await createGreetingCard(data);
			setOpen(false);
		} catch (error) {
			console.error(error);
		}
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size="sm" className="relative">
					Create Card
				</Button>
			</DialogTrigger>
			<DialogContent>
				<Form {...form}>
					<form onSubmit={onSubmit}>
						<DialogHeader>
							<DialogTitle>Create Card</DialogTitle>
							<DialogDescription>
								Write some interesting description to base your card on.
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="grid gap-2">
								<FormField
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Card Description</FormLabel>
											<FormControl>
												<Input
													placeholder="e.g. I'm going to a birthday of someone who loves legos"
													{...field}
												/>
											</FormControl>
											{/* <FormDescription>
										We will use this description to create the message
										and the design of the card.
									</FormDescription> */}
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
						<DialogFooter>
							<Button type="submit">Create Card</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
