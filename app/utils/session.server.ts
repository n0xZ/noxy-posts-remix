import { createCookieSessionStorage, redirect } from '@remix-run/node'
import { prisma } from '~/utils/prisma.server'
import bcryptjs from 'bcryptjs'

const sessionStorage = createCookieSessionStorage({
	cookie: {
		name: '_nx-session',
		secure: process.env.NODE_ENV === 'production',
		secrets: [process.env.SESSION_SECRET],
		sameSite: 'lax',
		path: '/',
		maxAge: 60 * 60 * 24 * 30,
		httpOnly: true,
	},
})

export const login = async ({
	email,
	password,
}: {
	email: string
	password: string
}) => {
	const existingUser = await prisma.user.findUnique({ where: { email } })
	if (!existingUser) return null

	const matchesPassword = await bcryptjs.compare(
		password,
		existingUser.passwordHashed
	)
	console.log(matchesPassword)
	if (!matchesPassword) return null

	return {
		id: existingUser.id,
	}
}

export const register = async ({
	email,
	password,
	username,
}: {
	username: string
	email: string
	password: string
}) => {
	const existingUser = await prisma.user.findUnique({ where: { email } })
	if (existingUser) return null
	const passwordHashed = await bcryptjs.hash(password, 10)
	const createdUser = await prisma.user.create({
		data: { email, passwordHashed, username },
	})
	return {
		id: createdUser.id,
	}
}

export async function getSession(request: Request) {
	const cookie = request.headers.get('Cookie')
	return sessionStorage.getSession(cookie)
}

export async function createUserSession(userId?: string) {
	const session = await sessionStorage.getSession()
	session.set('userId', userId)

	return redirect('/home', {
		headers: {
			'Set-Cookie': await sessionStorage.commitSession(session),
		},
	})
}
export async function logout(request: Request) {
	const session = await getSession(request)
	return redirect('/', {
		headers: {
			'Set-Cookie': await sessionStorage.destroySession(session),
		},
	})
}
