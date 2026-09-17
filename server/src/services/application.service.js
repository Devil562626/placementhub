import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

function isEligible(student, eligibility) {
  if (!eligibility) return true;
  if (student.cgpa < eligibility.minCgpa) return false;
  if (student.activeBacklogs > eligibility.maxBacklogs) return false;
  if (eligibility.allowedBranches?.length && !eligibility.allowedBranches.includes(student.branch)) return false;
  if (eligibility.allowedGradYears?.length && !eligibility.allowedGradYears.includes(student.gradYear)) return false;
  return true;
}

export async function apply(studentUserId, driveId) {
  const student = await prisma.studentProfile.findUnique({ where: { userId: studentUserId } });
  if (!student) throw new ApiError(404, 'Student profile not found');

  // ? one-offer policy: placed students are done
  if (student.placedStatus === 'PLACED') {
    throw new ApiError(400, 'You are already placed and cannot apply to new drives');
  }

  const drive = await prisma.drive.findUnique({ where: { id: driveId }, include: { eligibility: true } });
  if (!drive) throw new ApiError(404, 'Drive not found');
  if (drive.status !== 'PUBLISHED') throw new ApiError(400, 'Drive is not open for applications');

  if (!isEligible(student, drive.eligibility)) {
    throw new ApiError(403, 'You are not eligible for this drive');
  }

  const existing = await prisma.application.findUnique({
    where: { studentId_driveId: { studentId: student.id, driveId } },
  });
  if (existing) throw new ApiError(409, 'You have already applied to this drive');

  return prisma.application.create({
    data: { studentId: student.id, driveId },
    include: { drive: { include: { company: true } } },
  });
}

export async function myApplications(studentUserId) {
  const student = await prisma.studentProfile.findUnique({ where: { userId: studentUserId } });
  if (!student) throw new ApiError(404, 'Student profile not found');

  return prisma.application.findMany({
    where: { studentId: student.id },
    include: {
      drive: { include: { company: true } },
      roundResults: { include: { round: true }, orderBy: { id: 'asc' } },
      offer: true,
    },
    orderBy: { appliedAt: 'desc' },
  });
}

export async function listByDrive(user, driveId) {
  const drive = await prisma.drive.findUnique({ where: { id: driveId } });
  if (!drive) throw new ApiError(404, 'Drive not found');

  if (user.role === 'RECRUITER') {
    const profile = await prisma.recruiterProfile.findUnique({ where: { userId: user.id } });
    if (!profile || profile.companyId !== drive.companyId) {
      throw new ApiError(403, 'You can only view applications for your own company drives');
    }
  }

  return prisma.application.findMany({
    where: { driveId },
    include: {
      student: { include: { user: { select: { name: true, email: true } } } },
      roundResults: { include: { round: true } },
    },
    orderBy: { appliedAt: 'asc' },
  });
}

const FLOW = {
  APPLIED: ['SHORTLISTED', 'WITHDRAWN'],
  SHORTLISTED: ['IN_PROCESS', 'REJECTED', 'WITHDRAWN'],
  IN_PROCESS: ['SELECTED', 'REJECTED'],
  SELECTED: [],
  REJECTED: [],
  WITHDRAWN: [],
};

export async function updateStatus(user, applicationId, status) {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { drive: { include: { company: true } }, student: true },
  });
  if (!application) throw new ApiError(404, 'Application not found');

  let allowed = false;
  if (user.role === 'TPO' || user.role === 'ADMIN') allowed = true;
  else if (user.role === 'RECRUITER') {
    const profile = await prisma.recruiterProfile.findUnique({ where: { userId: user.id } });
    allowed = !!profile && profile.companyId === application.drive.companyId && status !== 'WITHDRAWN';
  } else if (user.role === 'STUDENT') {
    const student = await prisma.studentProfile.findUnique({ where: { userId: user.id } });
    allowed = !!student && student.id === application.studentId && status === 'WITHDRAWN';
  }
  if (!allowed) throw new ApiError(403, 'You cannot perform this action');

  if (!FLOW[application.status].includes(status)) {
    throw new ApiError(400, 'Invalid transition: ' + application.status + ' cannot become ' + status);
  }

  return prisma.application.update({ where: { id: applicationId }, data: { status } });
}
