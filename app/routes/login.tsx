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
	makeDomainFunction,
	errorMessagesForSchema,
	inputFromForm,
} from 'domain-functions'
import { z } from 'zod'
import { Spinner } from '~/components/icon/spinner'
import { createUserSession, getSession, login } from '~/utils/session.server'

const signInValidator = z.object({
	email: z.string().email({ message: 'Formato de email ingresado no válido' }),
	password: z.string().min(3, { message: 'Campo requerido' }),
})

const parseFormEntries = makeDomainFunction(signInValidator)(
	async ({ password, email }) => {
		const id = await login({ email, password })
		if (!id) throw new Error('Datos ingresados incorrectos')
		return id
	}
)

export const loader = async ({ request }: LoaderArgs) => {
	const existingSession = await getSession(request)
	if (!existingSession.get('userId')) return null
	return redirect('/home', 302)
}
export const action = async ({ request }: ActionArgs) => {
	const result = await parseFormEntries(await inputFromForm(request))

	if (result.success) return createUserSession(result.data.id)

	const inputErrors = errorMessagesForSchema(result.inputErrors, signInValidator)

	return json(
		{
			email: inputErrors.email,
			password: inputErrors.password,
			prismaErrors: result.errors,
		},
		{ status: result.success ? 200 : 400 }
	)
}

export const meta: V2_MetaFunction = () => [
	{ title: 'Noxy - posts | Iniciar sesión' },
]
export default function Login() {
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
					Iniciá sesión en Noxy - posts!
				</h1>
				<aside className="flex flex-col justify-center space-y-2">
					<label htmlFor="email" className="xl:text-xl font-medium">
						Correo electrónico
					</label>
					<input
						type="email"
						name="email"
						disabled={isSubmitting}
						placeholder="janedoe@example.com"
						className="w-full p-3 rounded-md shadow-md bg-[#181818] outline-none"
					/>
					<span className="text-red-500 h-6">
						{actionData && actionData.email && actionData?.email[0]}
					</span>
				</aside>

				<aside className="flex flex-col justify-center space-y-2">
					<label htmlFor="password" className="xl:text-xl font-medium">
						Contraseña
					</label>
					<input
						type="password"
						name="password"
						disabled={isSubmitting}
						placeholder="***********"
						className="w-full p-3 rounded-md shadow-md bg-[#181818] outline-none"
					/>
					<span className="text-red-500 h-6">
						{actionData && actionData.password && actionData?.password[0]}
					</span>
				</aside>
				<button
					type="submit"
					disabled={isSubmitting}
					className="w-full p-3 rounded-lg bg-violet-600 text-white font-bold hover:bg-violet-700 duration-100 ease-in-out flex flex-row items-center justify-center space-x-2"
				>
					{isSubmitting ? (
						<>
							<Spinner />
							<span>Cargando...</span>
						</>
					) : (
						'Iniciar sesión'
					)}
				</button>
				<span className="text-red-500 h-6">
					{actionData &&
						actionData.prismaErrors &&
						actionData?.prismaErrors[0].message}
				</span>
				<Link
					to="/register"
					className="underline text-gray-300 hover:text-gray-500 duration-100 ease-in-out"
				>
					No tengo una cuenta
				</Link>
			</Form>
		</main>
	)
}
