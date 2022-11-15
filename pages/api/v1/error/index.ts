import { NextApiRequest, NextApiResponse } from 'next';

type ResponseApi = {
	ok: boolean;
	message: string;
};

const handler = async (
	req: NextApiRequest,
	res: NextApiResponse<ResponseApi>
) => {
	const {
		query: { message = 'ocurrio un error', status = 400 },
	} = req;

	res.status(Number(status)).json({ ok: false, message: message.toString() });
};
export default handler;
