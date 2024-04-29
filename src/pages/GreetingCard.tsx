import { useParams } from "react-router-dom";
import { Tilt } from "react-tilt";
import ConfettiExplosion from "react-confetti-explosion";
import { getGreetingCard, useQuery } from "wasp/client/operations";

import { GreetingCard } from "../components/greeting-card";
import { Skeleton } from "../components/ui/skeleton";
import { DownloadIcon } from "../components/icons/DownloadIcon";
import { Button } from "../components/ui/button";

import { toJpeg } from "html-to-image";

function downloadCard() {
	const card = document.getElementById("greeting-card");
	if (!card) {
		return;
	}

	const cardRect = card.getBoundingClientRect();
	const cardWidth = cardRect.width;
	const cardHeight = cardRect.height;

	toJpeg(card, {
		canvasWidth: 700,
		canvasHeight: (700 / cardWidth) * cardHeight,
	}).then((dataUrl) => {
		const link = document.createElement("a");
		link.download = "greeting-card.jpeg";
		link.href = dataUrl;
		link.click();
	});
}

export function GreetingCardPage() {
	const params = useParams<{ id: string }>();
	const {
		data: card,
		isLoading,
		isError,
	} = useQuery(
		getGreetingCard,
		{
			id: params.id,
		},
		{
			retry: false,
		},
	);

	if (isLoading) {
		return (
			<div className="lg:w-2/3 flex justify-center mx-auto relative flex-col">
				<Skeleton className="w-full rounded-md aspect-[3/4]" />
				<Skeleton className="h-4 w-48 rounded-md mt-2" />
			</div>
		);
	}

	if (isError) {
		return <div>We couldn't get the greeting card you are looking for.</div>;
	}

	if (!card) {
		return <div>We couldn't find the greeting card you are looking for.</div>;
	}

	if (card.status === "error") {
		return <div>Something went wrong while trying to generate this greeting card.</div>;
	}

	return (
		<div className="lg:w-2/3 max-w-2xl flex justify-center mx-auto relative">
			<div>
				<Tilt
					options={{
						max: 35,
						scale: 1.01,
						perspective: 2000,
					}}
				>
					<GreetingCard
						card={card}
						textClassName="md:text-2xl"
						id="greeting-card"
					/>
				</Tilt>
				<div className="flex justify-center mt-4 p-4">
					<Button variant="outline" onClick={downloadCard}>
						<DownloadIcon className="w-4 h-4 mr-2" /> Download Card
					</Button>
				</div>
			</div>
			<div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
				<ConfettiExplosion />
			</div>
		</div>
	);
}
