import { NextApiRequest, NextApiResponse } from 'next';
import {
	ModelPersona_rol,
	ModelPersona_rolT,
	ModelRol,
	ModelRolT,
} from '../../../models';

type ResponseApi = {
	ok: boolean;
	message?: string;
	rol?: string;
};

const handler = async (
	req: NextApiRequest,
	res: NextApiResponse<ResponseApi>
) => {
	const { headers } = req;
	const { id } = headers;
	try {
		if (!id) {
			return res.status(400).json({ ok: false, message: 'no se envió un id' });
		}
		const personRol = await ModelPersona_rol.findOne({
			where: { id_persona: Number(id) },
		});
		if (!personRol) {
			return res
				.status(404)
				.json({ ok: false, message: 'la persona no tiene un rol' });
		}
		const personRolJSON: ModelPersona_rolT = personRol.toJSON();
		if (personRolJSON.estado !== 'activo') {
			return res
				.status(403)
				.json({ ok: false, message: 'el rol de la persona está inactivo' });
		}
		const rol = await ModelRol.findByPk(personRolJSON.id_rol);
		if (!rol) {
			return res.status(404).json({ ok: false, message: 'el rol no existe' });
		}
		const rolJSON: ModelRolT = rol.toJSON();
		return res.status(200).json({ ok: true, rol: rolJSON.nombre });
	} catch {
		return res
			.status(500)
			.json({ ok: false, message: 'ocurrió un error inesperado en getRol' });
	}
};
export default handler;
