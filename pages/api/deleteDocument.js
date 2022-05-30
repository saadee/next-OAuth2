import connect from '../../lib/database';
import Document from '../../models/Document';

/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */

export default async function handler(req, res) {
  await connect();

  try {
    if (req.method === 'GET') res.status(400).json('Invalid Req');
    else if (req.method === 'DELETE') {
      const documentId = req.body.documentId;
      await Document.deleteOne({ _id: documentId });
      res.status(201).json({ message: 'File Deleted', status: true });
    }
  } catch (error) {
    console.error(error);
    res.json({ error });
  }
}
