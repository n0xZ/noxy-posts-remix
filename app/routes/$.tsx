import type { LoaderArgs} from '@remix-run/node';
import { redirect } from '@remix-run/node'
import { getSession } from '~/utils/session.server'

export const loader = async ({ request }: LoaderArgs) => {
	const session = await getSession(request)
	if (session.get('userId')) return redirect('/home', 302)
	return redirect('/', 302)
}
