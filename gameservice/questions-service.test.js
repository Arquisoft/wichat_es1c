const request = require("supertest");
const jwt = require("jsonwebtoken");
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let app;

jest.mock("axios");
jest.mock("jsonwebtoken");
jest.mock("./models/question-model.js");
jest.mock("./models/template-model.js");
jest.mock("./models/score-model.js");

const Question = require("./models/question-model.js");
const Template = require("./models/template-model.js");
const Score = require("./models/score-model.js");
const axios = require("axios");

describe('Questions Service API', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    process.env.MONGODB_URI = mongoUri;
    app = require('./questions-service');
});

  afterAll(async () => {
    app.close();
    await mongoServer.stop();
  });

describe("GET /test", () => {
  it("should return OK status", async () => {
    const res = await request(app).get("/test");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("OK");
  });
});

describe("GET /ranking", () => {
  it("should return ranking data", async () => {
    const fakeRanking = [{ email: "user@example.com", correct: 5 }];
    Score.find.mockResolvedValue(fakeRanking);

    const res = await request(app).get("/ranking");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(fakeRanking);
  });
});

describe("GET /generateQuestions", () => {
    it("should return mocked questions", async () => {
      // Mock de 10 preguntas
      Question.aggregate.mockResolvedValue(
        Array.from({ length: 10 }, (_, index) => ({
          title: `Pregunta ${index + 1}`,
          correctAnswer: `Correcta ${index + 1}`,
          allAnswers: `Correcta ${index + 1},Incorrecta${index + 1}a,Incorrecta${index + 1}b,Incorrecta${index + 1}c`,
          category: "geography"
        }))
      );
  
      const res = await request(app).get("/generateQuestions").query({ type: "general" });
  
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(10); // Aseguramos que se devuelven 10 preguntas
    });

    it("should return general questions", async () => {
        // Mock de preguntas
        Question.aggregate.mockResolvedValue(
            Array.from({ length: 10 }, (_, index) => ({
              title: `Pregunta ${index + 1}`,
              correctAnswer: `Correcta ${index + 1}`,
              allAnswers: `Correcta ${index + 1},Incorrecta${index + 1}a,Incorrecta${index + 1}b,Incorrecta${index + 1}c`,
              category: "geography"
            }))
          );

        const res = await request(app).get("/generateQuestions").query({ type: "general" });

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(10); // Se esperan 10 preguntas
    });

    it("should return questions for a specific category", async () => {
        // Mock de preguntas para una categoría específica
        Question.aggregate.mockResolvedValue(
            Array.from({ length: 10 }, (_, index) => ({
              title: `Pregunta ${index + 1}`,
              correctAnswer: `Correcta ${index + 1}`,
              allAnswers: `Correcta ${index + 1},Incorrecta${index + 1}a,Incorrecta${index + 1}b,Incorrecta${index + 1}c`,
              category: "geography"
            }))
          );

        const res = await request(app).get("/generateQuestions").query({ type: "geography" });

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(10); // Se esperan 10 preguntas
    });

    it("should return 500 if no questions found", async () => {
        Question.aggregate.mockResolvedValue([]); // Simulamos que no hay preguntas

        const res = await request(app).get("/generateQuestions").query({ type: "general" });

        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe("Error interno en el servicio de preguntas.");
    });
  });
  
  describe("POST /saveScore", () => {
    const validToken = "valid.jwt.token";
  
    it("should return 401 without token", async () => {
      const res = await request(app).post("/saveScore").send({});
      expect(res.statusCode).toBe(401);
    });
  
    it("should save score and return 200 with valid token", async () => {
      jwt.verify.mockReturnValue({ email: "test@example.com" });
      Score.prototype.save = jest.fn().mockResolvedValue(true);
  
      const res = await request(app)
        .post("/saveScore")
        .set("Authorization", `Bearer ${validToken}`)
        .send({
          correct: 5,
          wrong: 3,
          totalTime: 120,
          question: "Q1",
          correctAnswer: "A",
          givenAnswer: "B"
        });
  
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Puntuación guardada correctamente");
    });

    it("should return 500 if there is an error saving score", async () => {
        jwt.verify.mockReturnValue({ email: "test@example.com" });
        Score.prototype.save = jest.fn().mockRejectedValue(new Error("Error al guardar la puntuación"));
    
        const res = await request(app)
            .post("/saveScore")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                correct: 5,
                wrong: 3,
                totalTime: 120,
                question: "Q1",
                correctAnswer: "A",
                givenAnswer: "B"
            });
    
        expect(res.statusCode).toBe(500);
        expect(res.body.message).toBe("Error al guardar la puntuación");
    });
  });
})

