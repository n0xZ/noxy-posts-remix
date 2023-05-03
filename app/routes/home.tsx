import type { LoaderArgs } from '@remix-run/node'
import { NavLink, Outlet, useLoaderData } from '@remix-run/react'
import { prisma } from '~/utils/prisma.server'
import { requireUserId } from '~/utils/session.server'

export const loader = async ({ request }: LoaderArgs) => {
	const userId = await requireUserId(request)
	const loggedUser = await prisma.user.findUnique({ where: { id: userId } })
	return { username: loggedUser?.username }
}

export default function Home() {
	const user = useLoaderData<typeof loader>()
	return (
		<>
			<header className="p-10 border-b-2 dark:border-[#181818] border-gray-50">
				<nav className="font-sarabun container flex flex-row items-center justify-between max-w-3xl mx-auto text-xl">
					<NavLink to="/home" className="font-bold">
						👋🏻 {user.username}
					</NavLink>
					<ul className="flex flex-row items-center space-x-5">
						<li>
							<NavLink to="/home/post/create">Publicar nuevo post</NavLink>
						</li>
					</ul>
				</nav>
			</header>
			<Outlet />
		</>
	)
}
