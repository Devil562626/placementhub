import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { cloudinary } from '../config/cloudinary.js';

export async function listStudents(filters = {}) {
  const where = {};
  if (filters.branch) where.branch = filters.branch;
  if (filters.placed) where.placedStatus = filters.placed;
  if (filters.q) where.user = { name: { contains: filters.q } };
  return prisma.studentProfile.findMany({
    where,
    include: { user: { select: { name: true, email: true } } },
    orderBy: { rollNo: 'asc' },
  });
}

export async function getMyProfile(userId) {
  const student = await prisma.studentProfile.findUnique({
    where: { userId },
    include: { user: { select: { name: true, email: true, role: true } } },
  });
  if (!student) throw new ApiError(404, 'Student profile not found');
  return student;
}

export async function updateMyProfile(userId, data) {
  const student = await prisma.studentProfile.findUnique({ where: { userId } });
  if (!student) throw new ApiError(404, 'Student profile not found');
  return prisma.studentProfile.update({ where: { id: student.id }, data });
}

export function uploadToCloudinary(file) {
  if (!cloudinary) throw new ApiError(503, 'Resume upload is not configured on this server (missing Cloudinary keys)');
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'placementhub/resumes', resource_type: 'raw' },
      (err, result) => (err ? reject(err) : resolve(result.secure_url))
    );
    stream.end(file.buffer);
  });
}

export async function saveResumeUrl(userId, url) {
  const student = await prisma.studentProfile.findUnique({ where: { userId } });
  if (!student) throw new ApiError(404, 'Student profile not found');
  return prisma.studentProfile.update({ where: { id: student.id }, data: { resumeUrl: url } });
}