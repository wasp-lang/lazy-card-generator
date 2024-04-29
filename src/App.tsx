import { Link } from "wasp/client/router";
import "./Main.css";
import { Separator } from "./components/ui/separator";
import { UserNav } from "./components/user-nav";
import { GithubIcon } from "./components/icons/GithubIcon";

export function App({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="h-full flex-1 flex-col space-y-8 p-8 md:p-16 flex max-w-[1200px] mx-auto">
			<div className="flex items-center justify-between space-y-2">
				<div>
					<h2 className="text-2xl font-bold tracking-tight">
						<Link to="/">Lazy Greeting Cards</Link>
					</h2>
					<p className="text-muted-foreground text-sm md:text-base">
						You gotta a thing coming up? We got you covered.
					</p>
				</div>
				<div className="flex items-center space-x-2">
					<UserNav />
				</div>
			</div>
			<Separator className="my-4" />
			<div className="h-full">{children}</div>
			<footer className="text-center text-muted-foreground py-16">
				Built with{" "}
				<a
					href="https://wasp-lang.dev/"
					className="underline underline-offset-2"
					target="_blank"
					rel="noreferrer"
				>
					Wasp
				</a>{" "}
				and{" "}
				<a
					href="https://supabase.com/"
					className="underline underline-offset-2"
					target="_blank"
					rel="noreferrer"
				>
					Supabase
				</a>
				<div className="mt-4 flex justify-center">
					<a
						href="https://github.com/wasp-lang/lazy-card-generator"
						target="_blank"
						rel="noreferrer"
						className="underline underline-offset-2 text-sm flex items-center"
					>
						<GithubIcon className="w-4 h-4 mr-2"/> This project is open-source
					</a>
				</div>
			</footer>
		</div>
	);
}
