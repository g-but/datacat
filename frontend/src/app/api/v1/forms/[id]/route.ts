import { prisma } from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';
import { getRouteParam, type RouteContext } from '@/lib/routeParams';

export async function PUT(req: Request, ctx: RouteContext<'id'>) {
  const id = await getRouteParam(ctx, 'id');
  if (!id) return Response.json({ success: false, message: 'Not found' }, { status: 404 });
  const user = await getAuthUserFromRequest(req);
  if (!user) return Response.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { title, description, structure, status, isTemplate } = body || {};
  const isPublished = status === 'published';

  const found = await prisma.form.findFirst({ where: { id, userId: user.id } });
  if (!found) return Response.json({ success: false, message: 'Not found' }, { status: 404 });

  const updated = await prisma.form.update({
    where: { id },
    data: {
      title: title ?? found.title,
      description: description ?? found.description,
      schema: structure ?? found.schema,
      isPublished,
      isTemplate: isTemplate === undefined ? found.isTemplate : Boolean(isTemplate),
    },
  });

  return Response.json({
    id: updated.id,
    title: updated.title,
    description: updated.description,
    structure: updated.schema,
    status: updated.isPublished ? 'published' : 'draft',
    is_template: updated.isTemplate,
    created_at: updated.createdAt,
    updated_at: updated.updatedAt,
  });
}

export async function DELETE(req: Request, ctx: RouteContext<'id'>) {
  const id = await getRouteParam(ctx, 'id');
  if (!id) return Response.json({ success: false, message: 'Not found' }, { status: 404 });
  const user = await getAuthUserFromRequest(req);
  if (!user) return Response.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  const found = await prisma.form.findFirst({ where: { id, userId: user.id } });
  if (!found) return Response.json({ success: false, message: 'Not found' }, { status: 404 });
  await prisma.form.delete({ where: { id } });
  return Response.json({ success: true });
}
