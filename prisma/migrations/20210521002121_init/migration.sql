-- CreateTable
CREATE TABLE "Pessoa" (
    "idPessoa" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("idPessoa")
);

-- CreateTable
CREATE TABLE "Conta" (
    "idConta" SERIAL NOT NULL,
    "idPessoa" INTEGER NOT NULL,
    "saldo" DECIMAL(65,30) NOT NULL,
    "limiteSaqueDiario" DECIMAL(65,30) NOT NULL,
    "flagAtivo" BOOLEAN NOT NULL,
    "tipoConta" INTEGER NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("idConta")
);

-- CreateTable
CREATE TABLE "Transacao" (
    "idTransacao" SERIAL NOT NULL,
    "idConta" INTEGER NOT NULL,
    "valor" DECIMAL(65,30) NOT NULL,
    "dataTransacao" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("idTransacao")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pessoa.cpf_unique" ON "Pessoa"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Conta_idPessoa_unique" ON "Conta"("idPessoa");

-- AddForeignKey
ALTER TABLE "Transacao" ADD FOREIGN KEY ("idConta") REFERENCES "Conta"("idConta") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conta" ADD FOREIGN KEY ("idPessoa") REFERENCES "Pessoa"("idPessoa") ON DELETE CASCADE ON UPDATE CASCADE;
