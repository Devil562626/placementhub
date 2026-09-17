import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

// ? THE core business rule: does a student match a drive's criteria?
function isEligible(student, eligibility) {
  if (!eligibility) return true;
  if (student.cgpa < eligibility.minCgpa) return false;
  if (student.activeBacklogs > eligibility.maxBacklogs) return false;
  if (eligibility.allowedBranches?.length && !eligibility.allowedBranches.includes(student.branch)) return false;
  if (eligibility.allowedGradYears?.length && !eligibility.allowedGradYears.includes(student.gradYear)) return false;
  return true;
}

export async function createDrive(data) {
  const { eligibility, ...driveData } = data;
  return prisma.drive.create({
    data: {
      ...driveData,
      ...(eligibility && { eligibility: { create: eligibility } }),  // one transaction
    },
    include: { company: true, eligibility: true },
  });
}

export async function listDrives(user) {
  if (user.role === 'STUDENT') {
    const student = await prisma.studentProfile.findUnique({ where: { userId: user.id } });
    if (!student) throw new ApiError(404, 'Student profile not found');

    const drives = await prisma.drive.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        company: true,
        eligibility: true,
        applications: { where: { studentId: student.id }, select: { id: true, status: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return drives
      .filter((d) => isEligible(student, d.eligibility))   // ? server-side filter
      .map(({ applications, ...d }) => ({
        ...d,
        hasApplied: applications.length > 0,
        applicationStatus: applications[0]?.status || null,
      }));
  }

  if (user.role === 'RECRUITER') {
    const profile = await prisma.recruiterProfile.findUnique({ where: { userId: user.id } });
    if (!profile) throw new ApiError(404, 'Recruiter profile not found');
    return prisma.drive.findMany({
      where: { companyId: profile.companyId },
      include: { company: true, eligibility: true, _count: { select: { applications: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  // TPO / ADMIN see everything
  return prisma.drive.findMany({
    include: { company: true, eligibility: true, _count: { select: { applications: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getDrive(id) {
  const drive = await prisma.drive.findUnique({
    where: { id },
    include: {
      company: true,
      eligibility: true,
      rounds: { orderBy: { sequence: 'asc' } },
      _count: { select: { applications: true } },
    },
  });
  if (!drive) throw new ApiError(404, 'Drive not found');
  return drive;
}

// strict lifecycle: DRAFT -> PUBLISHED -> CLOSED (no going back)
const FLOW = { DRAFT: 'PUBLISHED', PUBLISHED: 'CLOSED' };

export async function updateDriveStatus(id, status) {
  const drive = await prisma.drive.findUnique({ where: { id } });
  if (!drive) throw new ApiError(404, 'Drive not found');
  if (drive.status === 'CLOSED') throw new ApiError(400, 'Drive is closed and cannot be changed');
  if (FLOW[drive.status] !== status) {
    throw new ApiError(400, 'Invalid transition: ' + drive.status + ' can only become ' + FLOW[drive.status]);
  }
  return prisma.drive.update({ where: { id }, data: { status } });
}
