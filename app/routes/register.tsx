import type { ActionArgs, V2_MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, Link, useActionData, useNavigation } from '@remix-run/react'
import {
	errorMessagesForSchema,
	inputFromForm,
	makeDomainFunction,
} from 'domain-functions'
import { z } from 'zod'
import { Spinner } from '~/components/icon/spinner'
import { createUserSession, register } from '~/utils/session.server'

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
export const meta: V2_MetaFunction = () => [
	{ title: 'Noxy - posts | Crear nueva cuenta' },
]
export default function Register() {
	const actionData = useActionData<typeof action>()
	const navigation = useNavigation()
	const isSubmitting = navigation.state === 'submitting'
	return (
		<main className="h-screen grid place-items-center">
			<Form
				method="POST"
				className="container flex flex-col justify-center max-w-3xl p-2 space-y-3 xl:p-0 h-full"
			>
				<h1 className="text-center xl:text-4xl text-3xl font-bold mb-6">
					Creá tu nueva cuenta en Noxy - posts!
				</h1>
				<aside className="flex flex-col justify-center space-y-2">
					<label htmlFor="username" className="xl:text-xl font-medium">
						Nombre de usuario
					</label>
					<input
						type="text"
						name="username"
						disabled={isSubmitting}
						placeholder="janedoe"
						className="w-full p-3 rounded-md shadow-md bg-[#181818] hover:bg-[#1c1c1e] duration-100 ease-in-out outline-none"
					/>
					<span className="text-red-500 h-6">
						{actionData && actionData.username && actionData?.username[0]}
					</span>
				</aside>

				<aside className="flex flex-col justify-center space-y-2">
					<label htmlFor="email" className="xl:text-xl font-medium">
						Correo electrónico
					</label>
					<input
						type="email"
						name="email"
						disabled={isSubmitting}
						placeholder="janedoe@example.com"
						className="w-full p-3 rounded-md shadow-md bg-[#181818] hover:bg-[#1c1c1e] duration-100 ease-in-out outline-none"
					/>
					<span className="text-red-500 h-6">
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
					<span className="text-red-500 h-6">
						{actionData && actionData.password && actionData?.password[0]}
					</span>
				</aside>
				<button
					type="submit"
					disabled={isSubmitting}
					className="w-full p-3 rounded-lg bg-violet-600 c-white hover:bg-violet-700 duration-100 ease-in-out flex flex-row items-center justify-center space-x-2"
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
				<span className="text-red-500 h-6">
					{actionData &&
						actionData.prismaErrors &&
						actionData?.prismaErrors[0].message}
				</span>
				<Link
					to="/login"
					className="underline text-gray-300 hover:text-gray-500 duration-100 ease-in-out"
				>
					Ya tengo una cuenta
				</Link>
			</Form>
		</main>
	)
}
