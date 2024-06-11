// Iniciamos prisma. modelo de usuario para prisma
import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient

export default prisma.user