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
    else if (req.method === 'POST') {
      const document = req.body.document;
      const fileName = req.body.fileName;
      const result = await Document.create({ document, fileName });
      res.status(201).json({ message: 'File Uploaded', status: 200 });
    }
  } catch (error) {
    console.error(error);
    res.json({ error });
  }
}
