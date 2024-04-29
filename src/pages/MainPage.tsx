import { useAuth } from "wasp/client/auth";

import { EmptyPlaceholder } from "../components/empty-placeholder";
import { Skeleton } from "../components/ui/skeleton";
import { GreetingCards } from "../components/greeting-card";

export const MainPage = () => {
	const { data: user, isLoading: isUserLoading } = useAuth();
	
	if (isUserLoading) {
		return (
			<div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
				<div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
					<Skeleton className="h-6 w-32 rounded-md" />
					<Skeleton className="h-4 w-60 rounded-md mt-4" />
				</div>
			</div>
		);
	}

	if (!user) {
		return <EmptyPlaceholder />;
	}

	return <GreetingCards />;
};
