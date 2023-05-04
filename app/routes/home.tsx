import { Menu, Transition } from '@headlessui/react'
import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { Form, NavLink, Outlet, useLoaderData } from '@remix-run/react'
import { Fragment } from 'react'
import { prisma } from '~/utils/prisma.server'
import { logout, requireUserId } from '~/utils/session.server'

export const loader = async ({ request }: LoaderArgs) => {
	const userId = await requireUserId(request)
	const loggedUser = await prisma.user.findUnique({ where: { id: userId } })

	return { username: loggedUser?.username }
}

export const action = async ({ request }: ActionArgs) => logout(request)

export const HamburguerIcon = () => {
	return (
		<svg
			fill="currentColor"
			strokeWidth={0}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 16 16"
			height="1em"
			width="1em"
			className="w-6 h-6"
		>
			<path
				fillRule="evenodd"
				d="M14 5H2V3h12v2zm0 4H2V7h12v2zM2 13h12v-2H2v2z"
				clipRule="evenodd"
			></path>
		</svg>
	)
}
export const LogoutIcon = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="32"
			height="32"
			viewBox="0 0 256 256"
			className="w-4 h-4"
		>
			<path
				fill="currentColor"
				d="M112 216a8 8 0 0 1-8 8H48a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h56a8 8 0 0 1 0 16H48v160h56a8 8 0 0 1 8 8Zm109.66-93.66l-40-40a8 8 0 0 0-11.32 11.32L196.69 120H104a8 8 0 0 0 0 16h92.69l-26.35 26.34a8 8 0 0 0 11.32 11.32l40-40a8 8 0 0 0 0-11.32Z"
			/>
		</svg>
	)
}

export const AddPost = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="32"
			height="32"
			viewBox="0 0 24 24"
			className="w-4 h-4"
		>
			<path
				fill="currentColor"
				d="M17 19.22H5V7h7V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-7h-2v7.22z"
			/>
			<path
				fill="currentColor"
				d="M19 2h-2v3h-3c.01.01 0 2 0 2h3v2.99c.01.01 2 0 2 0V7h3V5h-3V2zM7 9h8v2H7zm0 3v2h8v-2h-3zm0 3h8v2H7z"
			/>
		</svg>
	)
}
export const HomeMenu = () => {
	return (
		<Menu
			as="div"
			className="relative inline-block text-left xl:hidden lg:hidden"
		>
			<div>
				<Menu.Button className="justify-center w-full text-sm font-medium text-white rounded-md hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
					<HamburguerIcon />
				</Menu.Button>
			</div>
			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items className="absolute right-0 mt-2 origin-top-right bg-[#1b1b1b] divide-y divide-gray-100  rounded-md shadow-lg w-60 ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="px-1 py-1 ">
						<Menu.Item>
							{({ active }) => (
								<NavLink
									to="/home/post/create"
									className={`${
										active ? 'bg-[#181818] ' : 'bg-[#1f1f1f]'
									} group flex w-full items-center rounded-md px-2 py-2 text-sm space-x-2 text-white`}
								>
									<AddPost />
									<span>Crear nuevo post</span>
								</NavLink>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<Form method="POST">
									<button
										type="submit"
										className={`${
											active ? 'bg-[#181818] ' : 'bg-[#1f1f1f]'
										} group flex w-full items-center  rounded-md px-2 py-2 text-sm space-x-2 text-white`}
									>
										<LogoutIcon />
										<span>Cerrar sesión</span>
									</button>
								</Form>
							)}
						</Menu.Item>
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	)
}
export default function Home() {
	const user = useLoaderData<typeof loader>()
	return (
		<>
			<header className="p-10 border-b-2 dark:border-[#181818] border-gray-50">
				<nav className="container flex flex-row items-center justify-between max-w-3xl mx-auto text-xl font-sarabun">
					<NavLink to="/home" className="font-bold">
						👋🏻 {user.username}
					</NavLink>
					<ul className="flex-row items-center hidden space-x-5 xl:flex">
						<li>
							<NavLink to="/home/post/create">Publicar nuevo post</NavLink>
						</li>
						<li>
							<Form method="POST">
								<button type="submit" className="rounded-lg p-3 bg-[#323232] font-bold">
									Cerrar sesión
								</button>
							</Form>
						</li>
					</ul>
					<HomeMenu />
				</nav>
			</header>
			<Outlet />
		</>
	)
}
