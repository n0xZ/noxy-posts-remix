import type { V2_MetaFunction } from '@remix-run/node'
import { Link } from '@remix-run/react'

export const meta: V2_MetaFunction = () => {
	return [{ title: 'Bienvenido a Noxy - posts!' }]
}

export default function Index() {
	return (
		<>
			<header className="p-10">
				<nav className="container flex flex-row items-center justify-between max-w-2xl mx-auto text-xl font-bold font-radioCanada xl:text-2xl lg:text-2xl">
					<Link to="/" className="text-violet-500">
						{' '}
						Noxy-posts
					</Link>
					<ul className="flex flex-row items-center space-x-5">
						<li>
							<Link
								to="/login"
								className="duration-100 ease-in-out hover:text-violet-500"
							>
								Iniciar sesión
							</Link>
						</li>
					</ul>
				</nav>
			</header>

			<main className="container flex flex-col items-center justify-center h-screen max-w-2xl mx-auto space-y-5">
				<h2 className="text-5xl font-bold text-center">
					Publicá lo que quieras,{' '}
					<span className="text-violet-700">y que se entere todo el mundo.</span>
				</h2>
				<p className="mt-3 text-center text-[#4a4a4a] xl:text-lg">
					En noxy-blume, podrás publicar y ver posts de las temáticas que vos
					prefieras, y reaccionar a las mísmas.
				</p>
				<Link
					to="/login"
					className="p-5 rounded-lg dark:bg-[#1b1b1b] bg-violet-700 hover:bg-violet-800 dark:hover:bg-[#181818] text-white duration-100 ease-in-out w-64 text-center"
				>
					Empezar ya!
				</Link>
			</main>
			<footer className="p-5 text-center text-[#4a4a4a]">
				<p>© n0xZ. Powered by Remix 🖤</p>
			</footer>
		</>
	)
}
