import type { Post } from '@prisma/client'
import { Link } from '@remix-run/react'

type Props = {
	post: Post
}
export default function PostItem(props: Props) {
	const parsedSlug = props.post.slug.replaceAll(' ', '-').toLowerCase()

	return (
		<Link
			to={`/home/post/${parsedSlug}`}
			className="flex flex-col justify-center h-48 pl-5 rounded-lg bg-[#1b1b1b] border-2 border-[#2d2d2d] hover:opacity-80 duration-100 ease-in-out gap-3"
		>
			<h2 className="text-2xl font-bold xl:text-4xl">{props.post.title}</h2>

			<aside className="mt-3 text-gray-400">#{props.post.tag}</aside>
		</Link>
	)
}
