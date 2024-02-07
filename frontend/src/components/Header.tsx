import Link from "next/link";
import React from "react";
import { SearchForm } from "./SearchForm";

export const Header = () => {
	return (
		<header className="header">
			<div className="main-menu">
				<h1>
					<Link href="/" className="button logo link-button">
						<span className="desktop-long-label">CITY GUIDE</span>
					</Link>
				</h1>
				<SearchForm />
			</div>
		</header>
	);
};
