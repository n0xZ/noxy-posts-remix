import { prisma } from '~/utils/prisma.server'

export const getPostsByUserId = async (userId?: string) => {
	const existingPosts = await prisma.post.findMany({
		where: { author: { id: userId } },
	})
	return existingPosts
}

export const createPost = async ({
	title,
	content,
	slug,
	tag,
	userId,
}: {
	userId?: string
	title: string
	slug: string
	tag: string
	content: string
}) => {
	const createdPost = await prisma.post.create({
		data: { slug, title, author: { connect: { id: userId } }, content, tag },
	})
	return createdPost
}

export const deletePost = async ({ id }: { id: string }) => {
	const deletedPost = await prisma.post.delete({ where: { id } })
	return deletedPost
}

export const updatePost = async ({
	content,
	slug,
	tag,
	title,
	id,
}: {
	id: string
	title?: string
	slug?: string
	tag?: string
	content?: string
}) => {
	const updatedPost = await prisma.post.update({
		data: { title, tag, slug, content },
		where: { id },
	})
	return updatedPost
}
