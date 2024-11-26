import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const drivers = [
    {
      driver_id: 1,
      name: 'Homer Simpson',
      description: `Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).`,
      comment:
        'Motorista simpático,mas errou o caminho 3 vezes. O carro cheira a donuts.',
      car: 'Plymouth Valiant 1973 rosa e enferrujado',
      rating: 2,
      rate: 2.5,
      minKm: 1,
    },
    {
      driver_id: 2,
      name: 'Dominic Toretto',
      description: `Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.`,
      comment:
        'Que viagem incrível! O carro é um show à parte e o motorista, apesar de ter uma cara de poucos amigos, foi super gente boa. Recomendo! ',
      car: 'Dodge Charger R/T 1970 modificado',
      rating: 4,
      rate: 5,
      minKm: 5,
    },
    {
      driver_id: 3,
      name: 'James Bond',
      description: `Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem.`,
      comment:
        'Serviço impecável! O motorista é a própria definição de classe e o carro é simplesmente magnífico. Uma experiência digna de um agente secreto. ',
      car: 'Aston Martin DB5 clássico',
      rating: 5,
      rate: 10,
      minKm: 10,
    },
  ];

  try {
    for (const driver of drivers) {
      const newDriver = await prisma.driver.create({
        data: driver,
      });
      console.log('Motorista criado:', newDriver);
    }
  } catch (error) {
    console.error('Erro ao criar os motoristas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
