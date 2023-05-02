
import type { LinksFunction, V2_MetaFunction } from '@remix-run/node'
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from '@remix-run/react'
import stylesheet from '~/tailwind.css'

export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: stylesheet },
]

export const meta :V2_MetaFunction = () =>[{title:"Bienvenido a Noxy - posts!"}]
export default function App() {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Radio+Canada:wght@300&family=Sarabun:wght@300&display=swap"
					rel="stylesheet"
				/>
				<Meta />
				<Links />
			</head>
			<body className=" font-sarabun bg-[#0f0f0f] text-white ">
				<Outlet />
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	)
}
