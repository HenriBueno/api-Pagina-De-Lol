import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.listen(port, () => console.log(`Server iniciado: ${port}`));

const usuarios = [];
let contador = 1;

app.post("/signup", async (req, res) => {
  const email = req.body.email;
  const senha = req.body.senha;
  const senhacriptografada = await bcrypt.hash(senha, 10);

  const usuario = {
    id: contador,
    nome: req.body.nome,
    email: req.body.email,
    senha: senhacriptografada,
  };

  const verificaConta = usuarios.find((usuario) => usuario.email === email);

  if (verificaConta) {
    res.status(404).send("Usuário existente!");
  } else {
    res.status(201).send("Usuário criado com sucesso!");
    usuarios.push(usuario);
    contador++;
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.email;
  const senha = req.body.senha;

  const pessoaUsuaria = usuarios.find((usuario) => usuario.email === email);
  const senhaCriptografada = await bcrypt.hash(senha, 10);

  if (pessoaUsuaria) {
    bcrypt.compare(senha, senhaCriptografada, (error, result) => {
      if (result) {
        res
          .status(200)
          .json({ sucess: true, message: "Login realizado com sucesso" });
      } else {
        res
          .status(400)
          .json({ sucess: false, message: "Email ou senha inválido!" });
      }
    });
  } else {
    res.status(404).send("Email ou senha inválido!");
  }
});

app.get("/verUsuarios", (req, res) => {
    res.status(200).json(usuarios);
})




