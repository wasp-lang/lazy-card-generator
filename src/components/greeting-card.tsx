import type { GreetingCard as GreetingCardEntity } from "wasp/entities";
import { cn } from "./utils";
import { Skeleton } from "./ui/skeleton";
import { CreateCardButton } from "./create-new-card";
import { getMyGreetingCards, useQuery } from "wasp/client/operations";
import { EmptyPlaceholder } from "./empty-placeholder";
import { Link } from "wasp/client/router";

interface GreetingCardsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function GreetingCards({ className, ...props }: GreetingCardsProps) {
	const { data: cards, isLoading } = useQuery(getMyGreetingCards, undefined, {
		refetchInterval: 5000,
		retry: false,
	});

	const wrapperClassName = cn(
		"grid md:grid-cols-2 lg:grid-cols-3 gap-6",
		className,
	);
	const createCardWrapper = cn(
		"flex items-center justify-center h-full border-2 border-dashed rounded-md min-h-40",
	);

	if (isLoading) {
		return (
			<div className={wrapperClassName} {...props}>
				<div className={createCardWrapper}>
					<CreateCardButton />
				</div>
				{[1, 2, 3, 4].map((i) => (
					<GreetingCardSkeleton key={i} />
				))}
			</div>
		);
	}

	if (cards?.length === 0) {
		return <EmptyPlaceholder />;
	}

	return (
		<div className={wrapperClassName} {...props}>
			<div className={createCardWrapper}>
				<CreateCardButton />
			</div>
			{cards?.map((card) => (
				<Link to="/greeting-card/:id" params={{ id: card.id }} key={card.id}>
					<GreetingCard card={card} />
					<div className="space-y-1 text-sm mt-3">
						<h3 className="font-medium leading-none text-gray-500">
							{card.prompt}
						</h3>
					</div>
				</Link>
			))}
		</div>
	);
}

interface GreetingCardProps extends React.HTMLAttributes<HTMLDivElement> {
	textClassName?: string;
	card: GreetingCardEntity;
}

export function GreetingCard({
	card,
	className,
	textClassName,
	...props
}: GreetingCardProps) {
	const lines = card.poem?.split("\n") ?? ["Waiting for poem..."];
	return (
		<div className={cn(className)} {...props}>
			<div
				className={cn("overflow-hidden rounded-lg relative group")}
				style={{
					boxShadow: `0 0 0 2px ${card.imageAverageColor}, 0 0 10px ${card.imageAverageColor}`,
				}}
			>
				{card.imageUrl ? (
					<div className="">
						<div
							className={cn(
								"absolute left-1/2 transform -translate-x-1/2 bottom-10",
								"w-3/4 text-wradiv overflow-hidden",
								"flex flex-col items-center justify-center gap-2",
								"text-center z-10",
								"rotate-[-5deg] font-serif",
							)}
						>
							{lines.map((line, i) => (
								<div
									key={line}
									className={cn(
										"leading-tight text-lg font-bold",
										"text-white",
										textClassName,
									)}
									style={{ textShadow: "0 2px 3px rgba(0,0,0,0.7)" }}
								>
									{line}
								</div>
							))}
						</div>
						<div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-9 from-50%" />
						<img
							src={card.imageUrl}
							alt={card.poem ?? card.prompt}
							width={250}
							height={350}
							style={{
								backgroundColor: card.imageAverageColor ?? "transparent",
							}}
							className={cn("h-auto w-auto object-cover z-8", "aspect-[3/4]")}
						/>
					</div>
				) : (
					<div className="relative">
						<GreetingCardStatus status={card.status} />
						<GreetingCardImageSkeleton />
					</div>
				)}
			</div>
		</div>
	);
}

function GreetingCardStatus({
	status,
}: { status: GreetingCardEntity["status"] }) {
	const statusToText: { [key: string]: string } = {
		pending: "Warming up the AI",
		"generating-poem": "Writing the text",
		"generated-poem": "Imagining an image",
		"generating-image": "Drawing the image",
		error: "There was an error",
	};
	const text = statusToText[status];

	if (!text) {
		return null;
	}

	return (
		<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
			<div className="text-dark text-lg text-center">{text}</div>
		</div>
	);
}

function GreetingCardImageSkeleton() {
	return (
		<Skeleton className="object-cover transition-all hover:scale-105 aspect-[3/4] w-full" />
	);
}

function GreetingCardSkeleton() {
	return (
		<div className="space-y-3">
			<div className="overflow-hidden rounded-md">
				<GreetingCardImageSkeleton />
			</div>
			<div className="space-y-1 text-sm">
				<Skeleton className="h-3 w-32" />
				<Skeleton className="h-3 w-32 mt-2" />
				{/* <Skeleton className="h-3 w-24" /> */}
			</div>
		</div>
	);
}
