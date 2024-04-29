import { googleSignInUrl, logout, useAuth } from "wasp/client/auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Skeleton } from "./ui/skeleton";

export function UserNav() {
	const { data: user, isLoading } = useAuth();

	if (isLoading) {
		return <Skeleton className="h-8 w-8 rounded-full" />;
	}

	if (!user) {
		return (
			<Button variant="secondary" asChild>
				<a href={googleSignInUrl}>Log in</a>
			</Button>
		);
	}

	const userInitials = user.name
		.split(" ")
		.map((name) => name[0])
		.join("");

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="relative h-8 w-8 rounded-full">
					<Avatar className="h-9 w-9">
						<AvatarImage src={user.avatar} alt={user.name} />
						<AvatarFallback>{userInitials}</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">{user.name}</p>
						<p className="text-xs leading-none text-muted-foreground">
							{user.email}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{/* <DropdownMenuGroup>
					<DropdownMenuItem>Profile</DropdownMenuItem>
					<DropdownMenuItem>Billing</DropdownMenuItem>
					<DropdownMenuItem>Settings</DropdownMenuItem>
					<DropdownMenuItem>New Team</DropdownMenuItem>
				</DropdownMenuGroup> */}
				{/* <DropdownMenuSeparator /> */}
				<DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
