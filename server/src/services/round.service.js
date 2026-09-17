import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

async function assertDriveAccess(user, drive) {
  if (user.role === 'TPO' || user.role === 'ADMIN') return;
  if (user.role === 'RECRUITER') {
    const profile = await prisma.recruiterProfile.findUnique({ where: { userId: user.id } });
    if (profile && profile.companyId === drive.companyId) return;
  }
  throw new ApiError(403, 'You cannot manage rounds for this drive');
}

export async function createRound(user, driveId, data) {
  const drive = await prisma.drive.findUnique({ where: { id: driveId } });
  if (!drive) throw new ApiError(404, 'Drive not found');
  await assertDriveAccess(user, drive);

  const last = await prisma.round.findFirst({ where: { driveId }, orderBy: { sequence: 'desc' } });
  return prisma.round.create({
    data: {
      driveId,
      name: data.name,
      sequence: (last?.sequence || 0) + 1,
      scheduledAt: data.scheduledAt || null,
      venue: data.venue || null,
    },
  });
}

export async function listRounds(driveId) {
  return prisma.round.findMany({ where: { driveId }, orderBy: { sequence: 'asc' } });
}

export async function listResults(roundId) {
  const round = await prisma.round.findUnique({ where: { id: roundId } });
  if (!round) throw new ApiError(404, 'Round not found');
  return prisma.application.findMany({
    where: { driveId: round.driveId },
    include: {
      student: { include: { user: { select: { name: true, email: true } } } },
      roundResults: { where: { roundId } },
    },
    orderBy: { id: 'asc' },
  });
}

export async function recordResult(user, roundId, data) {
  const round = await prisma.round.findUnique({ where: { id: roundId }, include: { drive: true } });
  if (!round) throw new ApiError(404, 'Round not found');
  await assertDriveAccess(user, round.drive);

  const application = await prisma.application.findUnique({
    where: { id: data.applicationId },
    include: { student: true },
  });
  if (!application || application.driveId !== round.driveId) {
    throw new ApiError(400, 'Application does not belong to this drive');
  }

  const saved = await prisma.roundResult.upsert({
    where: { roundId_applicationId: { roundId, applicationId: data.applicationId } },
    create: { roundId, applicationId: data.applicationId, result: data.result, feedback: data.feedback },
    update: { result: data.result, feedback: data.feedback },
  });

  // business rule: failing a round rejects the application (valid transitions only)
  if (data.result === 'FAIL' && ['SHORTLISTED', 'IN_PROCESS'].includes(application.status)) {
    await prisma.application.update({ where: { id: applicationId }, data: { status: 'REJECTED' } });
  }

  // notify the student - first use of the Notification table!
  await prisma.notification.create({
    data: {
      userId: application.student.userId,
      message: data.result === 'PASS'
        ? 'You cleared the ' + round.name + ' round for ' + round.drive.jobTitle + '!'
        : 'You did not clear the ' + round.name + ' round for ' + round.drive.jobTitle + '.',
      type: data.result === 'PASS' ? 'SUCCESS' : 'WARNING',
    },
  });

  return saved;
}