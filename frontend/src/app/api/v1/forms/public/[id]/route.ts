import { prisma } from '@/lib/db';
import { getRouteParam, type RouteContext } from '@/lib/routeParams';

export async function GET(_req: Request, ctx: RouteContext<'id'>) {
  const id = await getRouteParam(ctx, 'id');
  if (!id) return Response.json({ message: 'Not found' }, { status: 404 });

  const form = await prisma.form.findFirst({ where: { id, isPublished: true } });
  if (!form) return Response.json({ message: 'Not found' }, { status: 404 });
  return Response.json({
    id: form.id,
    title: form.title,
    description: form.description,
    structure: form.schema,
  });
}
