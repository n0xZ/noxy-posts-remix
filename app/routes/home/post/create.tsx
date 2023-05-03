import type { ActionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useActionData, useNavigation } from '@remix-run/react'
import {
	errorMessagesForSchema,
	inputFromForm,
	makeDomainFunction,
} from 'domain-functions'
import { z } from 'zod'
import { Spinner } from '~/components/icon/spinner'
import { createPost } from '~/models/post.server'
import { prisma } from '~/utils/prisma.server'
import { getUserId } from '~/utils/session.server'

const createPostSchema = z.object({
	title: z.string().min(5, { message: 'Campo requerido' }),
	tag: z.string().min(5, { message: 'Campo requerido' }),
	content: z.string().min(10, { message: 'Campo requerido' }),
})

export const action = async ({ request }: ActionArgs) => {
	const userId = await getUserId(request)
	const parseFormEntries = makeDomainFunction(createPostSchema)(
		async ({ content, tag, title }) => {
			const newSlug = title.replaceAll(' ', '-').toLowerCase()
			const newPost = await createPost({ content, slug:newSlug, tag, title, userId })
			if (!newPost) throw new Error('Ocurrió un error al crear el post')
			return newPost
		}
	)
	const result = await parseFormEntries(await inputFromForm(request))

	if (result.success) return redirect('/home', 302)

	const inputErrors = errorMessagesForSchema(
		result.inputErrors,
		createPostSchema
	)

	return json(
		{
			title: inputErrors.title,
			content: inputErrors.content,
			tag: inputErrors.tag,
			prismaErrors: result.errors,
		},
		{ status: result.success ? 200 : 400 }
	)
}
export default function CreatePost() {
	const actionData = useActionData<typeof action>()
	const navigation = useNavigation()
	const isSubmitting = navigation.state === 'submitting'
	return (
		<main className="grid h-screen place-items-center">
			<Form
				method="POST"
				className="container flex flex-col justify-center h-full max-w-3xl p-2 space-y-3 xl:p-0"
			>
				<h1 className="mb-6 text-3xl font-bold text-center xl:text-4xl">
					Crear nuevo post
				</h1>
				<aside className="flex flex-col justify-center space-y-2">
					<label htmlFor="title" className="font-medium xl:text-xl">
						Título de tu post
					</label>
					<input
						type="text"
						name="title"
						disabled={isSubmitting}
						placeholder="janedoe@example.com"
						className="w-full p-3 rounded-md shadow-md bg-[#181818] outline-none"
					/>
					<span className="h-6 text-red-500">
						{actionData && actionData.title && actionData?.title[0]}
					</span>
				</aside>

				<aside className="flex flex-col justify-center space-y-2">
					<label htmlFor="tags" className="font-medium xl:text-xl">
						Tags del post
					</label>
					<input
						type="text"
						name="tag"
						disabled={isSubmitting}
						placeholder="React, Sofware development."
						className="w-full p-3 rounded-md shadow-md bg-[#181818] outline-none"
					/>
					<span className="h-6 text-red-500">
						{actionData && actionData.tag && actionData?.tag[0]}
					</span>
				</aside>
				<aside className="flex flex-col justify-center space-y-2">
					<label htmlFor="content" className="font-medium xl:text-xl">
						Contenido del post
					</label>
					<textarea
						name="content"
						disabled={isSubmitting}
						placeholder="***********"
						className="w-full p-3 rounded-md shadow-md bg-[#181818] outline-none min-h-64"
					/>
					<span className="h-6 text-red-500">
						{actionData && actionData.content && actionData?.content[0]}
					</span>
				</aside>
				<button
					type="submit"
					disabled={isSubmitting}
					className="flex flex-row items-center justify-center w-full p-3 space-x-2 font-bold text-white duration-100 ease-in-out rounded-lg bg-violet-600 hover:bg-violet-700"
				>
					{isSubmitting ? (
						<>
							<Spinner />
							<span>Cargando...</span>
						</>
					) : (
						'Crear nuevo post'
					)}
				</button>
				<span className="h-6 text-red-500">
					{actionData &&
						actionData.prismaErrors &&
						actionData?.prismaErrors[0].message}
				</span>
			</Form>
		</main>
	)
}
