import type { Post } from '@prisma/client'
import type { LoaderArgs, V2_MetaFunction } from '@remix-run/node'
import { Link, useLoaderData, useRouteError } from '@remix-run/react'
import { HomeLayout } from '~/components/layout/home'
import { PostList } from '~/components/post/list'
import { getPostsByUserId } from '~/models/post.server'
import { requireUserId } from '~/utils/session.server'

type LoaderResponse = {
	posts: Post[]
} | null
export const loader = async ({ request }: LoaderArgs) => {
	const id = await requireUserId(request)
	const existingPosts = await getPostsByUserId(id)

	return {
		posts: existingPosts,
	}
}

export const meta: V2_MetaFunction = () => [{ title: 'Noxy - posts | Home' }]

export const ErrorBoundary = () => {
	const error = useRouteError()
	if (error instanceof Error)
		return (
			<HomeLayout>
				<h2 className="text-2xl text-center xl:text-4xl">
					Al parecer ocurrió un error.
				</h2>
				<p>Vuelva a intentarlo más tarde</p>
			</HomeLayout>
		)
}
export default function Home() {
	const loaderData = useLoaderData() as unknown as LoaderResponse

	return (
		<HomeLayout>
			<h2 className="text-3xl font-bold text-center ">Tus posts recientes</h2>

			{loaderData && loaderData.posts.length !== 0 ? (
				<PostList posts={loaderData.posts} />
			) : (
				<>
					<h3>Al parecer no tiene ningún post creado hasta el momento.</h3>
					<Link to="/home/post/create">Empezá a crear uno haciendo click acá</Link>
				</>
			)}
		</HomeLayout>
	)
}
