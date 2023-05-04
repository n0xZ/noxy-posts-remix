import type { LoaderArgs } from '@remix-run/node'
import {
	isRouteErrorResponse,
	useLoaderData,
	useRouteError,
} from '@remix-run/react'
import { HomeLayout } from '~/components/layout/home'

import { getPostbySlug } from '~/models/post.server'

export const loader = async ({ params }: LoaderArgs) => {
	const post = await getPostbySlug(params.slug)
	if (!post) throw new Response('Este post no existe', { status: 404 })
	return {
		post,
	}
}

export const ErrorBoundary = () => {
	const error = useRouteError()
	if (isRouteErrorResponse(error))
		return (
			<HomeLayout overrideClassStyles="prose xl:prose-xl prose-invert mt-6">
				<h2>Error: Este post no existe.</h2>
			</HomeLayout>
		)
}
export default function Post() {
	const loaderData = useLoaderData<typeof loader>()

	const publishedPostDate = new Date(
		loaderData.post.createdAt
	).toLocaleDateString()

	return (
		<HomeLayout overrideClassStyles="prose xl:prose-xl lg:prose-lg prose-md mt-6 prose-invert font-varta p-2">
			<h2 className="font-bold ">{loaderData.post.title}</h2>
			<time className="text-[#4a4a4a]" dateTime={publishedPostDate}>
				{publishedPostDate}
			</time>
			<div dangerouslySetInnerHTML={{ __html: loaderData.post.content }}></div>
		</HomeLayout>
	)
}
