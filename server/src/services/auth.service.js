import bcrypt from 'bcryptjs';
import { prisma } from '../config/db.js';
import { signToken } from '../utils/token.js';
import { ApiError } from '../utils/ApiError.js';

const safeUser = (u) => ({ id: u.id, name: u.name, email: u.email, role: u.role });

export async function register(data) {
  const exists = await prisma.user.findUnique({ where: { email: data.email } });
  if (exists) throw new ApiError(409, 'Email already registered');

  const role = data.role || 'STUDENT';
  if (role === 'STUDENT' && !data.rollNo) {
    throw new ApiError(400, 'rollNo is required for student registration');
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
      role,
      ...(role === 'STUDENT' && {
        studentProfile: {
          create: {
            rollNo: data.rollNo,
            branch: data.branch || 'CSE',
            gradYear: data.gradYear || 2026,
            cgpa: data.cgpa || 0,
          },
        },
      }),
      ...(role === 'RECRUITER' && {
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
  const { passwordHash, ...safe } = user;
  return safe;
}
