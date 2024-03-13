import Link from "next/link";
import React, { useContext } from "react";
import { UserContext } from "./Layout";
import { useRouter } from "next/router";

export const Header = () => {
	const authInfo = useContext(UserContext);
	const router = useRouter();

	const handleLogout = () => {
		localStorage.removeItem("jwt");
		authInfo.refetchLogin();
		router.push("/");
	};

	console.log("isLoggedIn", authInfo);
	return (
		<header className="header">
			<div className="main-menu">
				<h1>
					<Link href="/" className="button logo link-button">
						<span className="desktop-long-label">CITY GUIDE</span>
					</Link>
				</h1>
				<div className="auth-buttons">
					{authInfo.isLoggedIn ? (
						<>
							{authInfo.role === "admin" && (
								<Link href="/admin/users" className="button link-button">
									<span className="desktop-long-label">Admin Panel</span>
									<span className="mobile-short-label">Admin</span>
								</Link>
							)}
							<button className="button button-primary" onClick={handleLogout}>
								Logout
							</button>
						</>
					) : (
						<>
							<Link href="/login" className="button link-button">
								<span className="mobile-short-label">Login</span>
								<span className="desktop-long-label">Login</span>
							</Link>
							<Link
								href="/register"
								className="button link-button button-primary"
							>
								<span className="mobile-short-label">Sign Up</span>
								<span className="desktop-long-label">Sign Up</span>
							</Link>
						</>
					)}
				</div>
			</div>
		</header>
	);
};
