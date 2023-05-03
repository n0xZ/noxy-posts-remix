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
	tags,
	userId,
}: {
	userId: string
	title: string
	slug: string
	tags: string[]
	content: string
}) => {
	const createdPost = await prisma.post.create({
		data: { slug, title, author: { connect: { id: userId } }, content, tags },
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
	tags,
	title,
	id,
}: {
	id: string
	title?: string
	slug?: string
	tags?: string[]
	content?: string
}) => {
	const updatedPost = await prisma.post.update({
		data: { title, tags, slug, content },
		where: { id },
	})
	return updatedPost
}
