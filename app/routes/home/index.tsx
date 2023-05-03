import type { Post } from '@prisma/client'
import type { LoaderArgs, V2_MetaFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { PostList } from '~/components/post/list'
import { getPostsByUserId } from '~/models/post.server'
import { prisma } from '~/utils/prisma.server'
import { requireUserId } from '~/utils/session.server'

type LoaderResponse = {
	posts: Post[]
	avatarUrl: string
} | null
export const loader = async ({ request }: LoaderArgs) => {
	const id = await requireUserId(request)
	const existingPosts = await getPostsByUserId(id)
	const user = await prisma.user.findUnique({ where: { id } })

	return {
		posts: existingPosts,
		avatarUrl: user?.avatarUrl,
	}
}

export const meta: V2_MetaFunction = () => [{ title: 'Noxy - posts | Home' }]
export default function Home() {
	const loaderData = useLoaderData() as unknown as LoaderResponse

	return (
		<main className="container w-full max-w-3xl min-h-screen mx-auto mt-12">
			<Link to="/home/posts/create">Crear proyecto</Link>
			<h2 className="text-3xl font-bold text-center">Tus posts recientes</h2>

			{loaderData && loaderData.posts.length ? (
				<PostList posts={loaderData.posts} />
			) : null}
		</main>
	)
}
