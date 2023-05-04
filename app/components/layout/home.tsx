import type { ReactNode } from 'react'

export function HomeLayout(props: {
	children: ReactNode
	overrideClassStyles?: string
}) {
	return (
		<main
			className={`container w-full max-w-3xl min-h-screen pl-5 mx-auto  xl:pl-0 ${
				props.overrideClassStyles ? props.overrideClassStyles : null
			}`}
		>
			{props.children}
		</main>
	)
}
