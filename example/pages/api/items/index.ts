import { NextApiRequest, NextApiResponse } from 'next';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const cursor =
    (typeof req.query.cursor === 'string' && parseInt(req.query.cursor, 10)) ||
    0;

  const data = Array(10)
    .fill(0)
    .map((_, i) => ({
      id: i + cursor,
      name: `Item ${i + cursor}`,
    }));

  const nextCursor = cursor < 50 ? data[data.length - 1].id + 1 : null;

  setTimeout(() => res.json({ data, nextCursor }), 1000);
};

export default handler;
