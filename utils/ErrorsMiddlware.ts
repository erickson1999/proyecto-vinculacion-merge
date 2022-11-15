const ErrorsMiddleware = {
	noToken: {
		message: 'No se envió un token',
		status: 400,
	},
	invalidToken: {
		message: 'token inválido',
		status: 400,
	},
	noMethod: {
		message: 'no se envió un método',
		status: 400,
	},
	forbidden: {
		message: 'no estás autorizado',
		status: 403,
	},
};
export default ErrorsMiddleware;
