import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';
import { getRouteParam, type RouteContext } from '@/lib/routeParams';
import { parseSubmissionFilters } from '@/lib/submissionFilters';

type SubmissionRow = {
  id: string;
  data: Prisma.JsonValue;
  submittedAt: Date;
};

/**
 * List one form's submissions, for the form's owner.
 *
 * Raw SQL rather than `prisma.submission.findMany` because the search box spans
 * whatever shape the form happens to have: `data` is a Json column, and Prisma's
 * Json filters can only match a known path, not "any value in this document
 * contains X". `data::text ILIKE` is one indexed-by-formId query; every value
 * below is a bound parameter, never interpolated.
 */
export async function GET(req: Request, ctx: RouteContext<'formId'>) {
  const formId = await getRouteParam(ctx, 'formId');
  if (!formId) return Response.json({ success: false, message: 'Not found' }, { status: 404 });

  const user = await getAuthUserFromRequest(req);
  if (!user) return Response.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  const parsed = parseSubmissionFilters(new URL(req.url).searchParams);
  if (!parsed.success) {
    return Response.json({ success: false, message: parsed.error }, { status: 400 });
  }
  const { searchPattern, startDate, endDate, page, limit, skip } = parsed.filters;

  // Ownership is the authorization boundary: a form you do not own is a 404,
  // not an empty list, so the endpoint never confirms that an id exists.
  const form = await prisma.form.findFirst({
    where: { id: formId, userId: user.id },
    select: { id: true, title: true },
  });
  if (!form) {
    return Response.json(
      { success: false, message: 'Form not found or you do not have access' },
      { status: 404 },
    );
  }

  const conditions = [Prisma.sql`"formId" = ${form.id}`];
  if (startDate) conditions.push(Prisma.sql`"submittedAt" >= ${startDate}`);
  if (endDate) conditions.push(Prisma.sql`"submittedAt" <= ${endDate}`);
  if (searchPattern) conditions.push(Prisma.sql`data::text ILIKE ${searchPattern}`);
  const where = Prisma.join(conditions, ' AND ');

  const [submissions, totals] = await Promise.all([
    prisma.$queryRaw<SubmissionRow[]>`
      SELECT id, data, "submittedAt"
      FROM submissions
      WHERE ${where}
      ORDER BY "submittedAt" DESC
      LIMIT ${limit} OFFSET ${skip}
    `,
    prisma.$queryRaw<{ total: bigint }[]>`
      SELECT COUNT(*) AS total FROM submissions WHERE ${where}
    `,
  ]);

  const total = Number(totals[0]?.total ?? 0);

  return Response.json({
    success: true,
    form,
    submissions,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}
