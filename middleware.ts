// middleware.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import errors from './utils/ErrorsMiddlware';
import { jwtVerify } from 'jose';
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
	const { method } = request;

	type PayloadT = {
		id: string;
		iat: number;
		exp: number;
		nbf: number;
	};

	async function verify(token: string, secret: string): Promise<PayloadT> {
		const { payload } = await jwtVerify(
			token,
			new TextEncoder().encode(secret)
		);
		console.log({ payloadVerify: payload });
		return payload as PayloadT;
	}
	function startsWith(url: string) {
		return request.nextUrl.pathname.startsWith(url);
	}
	function error(message: string, status: string | number) {
		const url = request.nextUrl.clone();
		url.pathname = '/api/v1/error';
		url.search = `?message=${message}&status=${status.toString()}`;
		return url;
	}
	function validRol(userRol: string, validRol: string) {
		if (validRol === userRol) {
			return NextResponse.next();
		}
		const url = error(errors.forbidden.message, errors.forbidden.status);
		return NextResponse.rewrite(url);
	}

	if (!method) {
		const url = error(errors.noMethod.message, errors.noMethod.status);
		return NextResponse.rewrite(url);
	}
	if (startsWith('/api/v1/auth/login')) {
		return NextResponse.next();
	}
	if (startsWith('/api/v1/auth/register')) {
		return NextResponse.next();
	}
	console.log("flag1")
	// validations anythings  enviroment variables
	try {
		const TOKEN_SECRET = process.env.TOKEN_SECRET;
		const BASE_URL_API = process.env.BASE_URL_API;

		if (!TOKEN_SECRET) {
			throw new Error('No existe la variale TOKEN_SECRET en el archivo.env');
		}
		if (!BASE_URL_API) {
			throw new Error('No existe la variale BASE_URL_API en el archivo.env');
		}

		const token = request.cookies.get('x-access-token');
		if (!token) {
			const url = error(errors.noToken.message, errors.noToken.status);
			return NextResponse.rewrite(url);
		}
		const payload = await verify(token, process.env.TOKEN_SECRET!);
		//consult role

		const rol = await fetch(BASE_URL_API + '/api/v1/getRol', {
			method: 'POST',
			headers: {
				id: payload.id,
			},
		});
		const rolJSON = await rol.json();


		if (rolJSON.ok === false) {
			throw new Error(rolJSON.message);
		}
		if (startsWith('/api/v1/attendances')) {
			console.log("flag")
			switch (method) {
				case 'GET': {
					validRol(rolJSON.rol, 'docente');
				}
				default: {
					return NextResponse.next();
				}
			}
		}
	} catch (error: any) {
		console.error(error)
		const url = request.nextUrl.clone();
		url.pathname = '/api/v1/error';
		console.log({errormessage:error.message})
		url.search = `?message=${errors.forbidden.message}&${errors.forbidden.status}`;
		return NextResponse.rewrite(url);
	}
}

export const config = {
	matcher: ['/api/v1/:path*'],
};
