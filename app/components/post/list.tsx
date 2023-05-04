import type { Post } from '@prisma/client'
import PostItem from './item'

type Props = {
	posts: Post[]
}
export function PostList(props: Props) {
	return (
		<section className="container grid h-full max-w-3xl grid-rows-2 p-3 mx-auto mt-8 xl:p-0 ">
			{props.posts.map((p) => (
				<PostItem post={p} key={p.id} />
			))}
		</section>
	)
}
