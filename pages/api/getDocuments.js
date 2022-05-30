import connect from '../../lib/database';
import Document from '../../models/Document';

/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */

export default async function handler(req, res) {
  await connect();

  try {
    const result = await Document.find();
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.json({ error });
  }
}
