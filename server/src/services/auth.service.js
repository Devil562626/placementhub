import bcrypt from 'bcryptjs';
import { prisma } from '../config/db.js';
import { signToken } from '../utils/token.js';
import { ApiError } from '../utils/ApiError.js';

const safeUser = (u) => ({ id: u.id, name: u.name, email: u.email, role: u.role });

export async function register(data) {
  const exists = await prisma.user.findUnique({ where: { email: data.email } });
  if (exists) throw new ApiError(409, 'Email already registered');

  const requestedRole = data.role || 'STUDENT';
  // security rule: nobody can self-register as TPO or ADMIN
  if (requestedRole !== 'STUDENT' && requestedRole !== 'RECRUITER') {
    throw new ApiError(403, 'This role can only be created by an administrator');
  }
  if (requestedRole === 'STUDENT' && !data.rollNo) {
    throw new ApiError(400, 'rollNo is required for student registration');
  }
  // students must match college pattern (adjust domain to your college)
  if (requestedRole === 'STUDENT' && !data.email.endsWith('@college.edu')) {
    throw new ApiError(403, 'Students must register with their @college.edu email');
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
      role: requestedRole,
      ...(requestedRole === 'STUDENT' && {
        studentProfile: {
          create: {
            rollNo: data.rollNo,
            branch: data.branch || 'CSE',
            gradYear: data.gradYear || 2026,
            cgpa: data.cgpa || 0,
          },
        },
      }),
      ...(requestedRole === 'RECRUITER' && {
        recruiterProfile: {
          create: {
            company: { create: { name: data.companyName || data.name + ' Corp' } },
            designation: data.designation || 'HR',
          },
        },
      }),
    },
  });

  const token = signToken({ id: user.id, role: user.role, name: user.name });
  return { user: safeUser(user), token };
}

export async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new ApiError(401, 'Invalid email or password');

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) throw new ApiError(401, 'Invalid email or password');

  const token = signToken({ id: user.id, role: user.role, name: user.name });
  return { user: safeUser(user), token };
}

export async function me(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { studentProfile: true, recruiterProfile: { include: { company: true } } },
  });
  if (!user) throw new ApiError(404, 'User not found');
  const { passwordHash, passwordResetToken, passwordResetExpires, ...safe } = user;
  return safe;
}

// TPO-only: create TPO/ADMIN accounts (so roles stay controlled)
export async function createStaff(actor, data) {
  if (actor.role !== 'TPO' && actor.role !== 'ADMIN') {
    throw new ApiError(403, 'Only TPO/Admin can create staff accounts');
  }
  const exists = await prisma.user.findUnique({ where: { email: data.email } });
  if (exists) throw new ApiError(409, 'Email already registered');

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash: await bcrypt.hash(data.password, 10),
      role: data.role,
    },
  });
  return safeUser(user);
}

export async function listUsers(actor) {
  if (actor.role !== 'TPO' && actor.role !== 'ADMIN') {
    throw new ApiError(403, 'Only TPO/Admin can list users');
  }
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
}