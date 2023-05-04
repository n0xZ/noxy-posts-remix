import type {
	ActionArgs,
	LoaderArgs,
	V2_MetaFunction} from '@remix-run/node';
import {
	redirect,
} from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, Link, useActionData, useNavigation } from '@remix-run/react'
import {
	errorMessagesForSchema,
	inputFromForm,
	makeDomainFunction,
} from 'domain-functions'
import { z } from 'zod'
import { Spinner } from '~/components/icon/spinner'
import { createUserSession, getSession, register } from '~/utils/session.server'

const signUpValidator = z.object({
	username: z.string().min(3, { message: 'Campo requerido' }),
	email: z.string().email({ message: 'Formato de email ingresado no válido' }),
	password: z.string().min(3, { message: 'Campo requerido' }),
})

const parseFormEntries = makeDomainFunction(signUpValidator)(
	async ({ password, email, username }) => {
		const id = await register({ email, password, username })
		if (!id) throw new Error('Este usuario ya existe')
		return id
	}
)
export const action = async ({ request }: ActionArgs) => {
	const result = await parseFormEntries(await inputFromForm(request))

	if (result.success) return createUserSession(result.data.id)

	const inputErrors = errorMessagesForSchema(result.inputErrors, signUpValidator)

	return json(
		{
			username: inputErrors.username,
			email: inputErrors.email,
			password: inputErrors.password,
			prismaErrors: result.errors,
		},
		{ status: result.success ? 200 : 400 }
	)
}
export const loader = async ({ request }: LoaderArgs) => {
	const existingSession = await getSession(request)
	if (!existingSession.get('userId')) return null
	return redirect('/home', 302)
}
export const meta: V2_MetaFunction = () => [
	{ title: 'Noxy - posts | Crear nueva cuenta' },
]
export default function Register() {
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
					Creá tu nueva cuenta en Noxy - posts!
				</h1>
				<aside className="flex flex-col justify-center space-y-2">
					<label htmlFor="username" className="font-medium xl:text-xl">
						Nombre de usuario
					</label>
					<input
						type="text"
						name="username"
						disabled={isSubmitting}
						placeholder="janedoe"
						className="w-full p-3 rounded-md shadow-md bg-[#181818] hover:bg-[#1c1c1e] duration-100 ease-in-out outline-none"
					/>
					<span className="h-6 text-red-500">
						{actionData && actionData.username && actionData?.username[0]}
					</span>
				</aside>

				<aside className="flex flex-col justify-center space-y-2">
					<label htmlFor="email" className="font-medium xl:text-xl">
						Correo electrónico
					</label>
					<input
						type="email"
						name="email"
						disabled={isSubmitting}
						placeholder="janedoe@example.com"
						className="w-full p-3 rounded-md shadow-md bg-[#181818] hover:bg-[#1c1c1e] duration-100 ease-in-out outline-none"
					/>
					<span className="h-6 text-red-500">
						{actionData && actionData.email && actionData?.email[0]}
					</span>
				</aside>

				<aside className="flex flex-col justify-center space-y-2">
					<label htmlFor="password" className="text-xl font-medium">
						Contraseña
					</label>
					<input
						type="password"
						name="password"
						disabled={isSubmitting}
						placeholder="***********"
						className="w-full p-3 rounded-md shadow-md bg-[#181818] hover:bg-[#1c1c1e] duration-100 ease-in-out outline-none"
					/>
					<span className="h-6 text-red-500">
						{actionData && actionData.password && actionData?.password[0]}
					</span>
				</aside>
				<button
					type="submit"
					disabled={isSubmitting}
					className="flex flex-row items-center justify-center w-full p-3 space-x-2 duration-100 ease-in-out rounded-lg bg-violet-600 c-white hover:bg-violet-700"
				>
					{isSubmitting ? (
						<>
							<Spinner />
							<span>Cargando...</span>
						</>
					) : (
						'Crear nueva cuenta'
					)}
				</button>
				<span className="h-6 text-red-500">
					{actionData &&
						actionData.prismaErrors &&
						actionData?.prismaErrors[0].message}
				</span>
				<Link
					to="/login"
					className="text-gray-300 underline duration-100 ease-in-out hover:text-gray-500"
				>
					Ya tengo una cuenta
				</Link>
			</Form>
		</main>
	)
}
