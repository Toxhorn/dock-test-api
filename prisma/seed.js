import Prisma from '@prisma/client'

const { PrismaClient } = Prisma
const client = new PrismaClient()

async function main () {
  await client.pessoa.upsert({
    where: { cpf: '32801124001' },
    create: {
      nome: 'Carlos Henrique Ramos Silva',
      cpf: '32801124001',
      dataNascimento: '1994-05-03'
    }
  })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await client.$disconnect()
  })
