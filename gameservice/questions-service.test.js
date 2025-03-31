const fs = require("fs");
const path = require("path");
const request = require("supertest");
const app = require("./questions-service");

const { getTemplate, generateQuestions, NUMBER_OF_QUESTIONS } = require("./questions-service");
const { Question } = require("./models/question-model");
const { Template } = require("./models/template-model");

// Mock the Question and Template models
jest.mock("./models/question-model");
jest.mock("./models/template-model");

// All templates
const templatesPath = path.join(__dirname, "data", "questions-templates.json");
const templates = JSON.parse(fs.readFileSync(templatesPath, "utf8"));

describe( "get template" , () =>
{
    /**
     * TEST:
     *  Get a template from the templates JSON file, given a param that can be
     *  either number, string or undefined.
     * 
     * ✅ VALID CASES:
     * - Return random template with undefined param
     * - Return first template with param = 0
     * - Return second template with param = 1
     * - Return template about flags with param = 'Geografía'
     * - Return template about chem elements with param = 'Ciencia'
     * 
     * ❌ INVALID CASES:
     * - Param of different type than string or number
     * - No template found in the database
     */

    // ✅ Undefined param -> Random template
    it("should return a random template when param is undefined", async () =>
    {
        // Mock Template data
        Template.aggregate.mockResolvedValue([{ category: "Geografía" }]);

        const template = await getTemplate(); // should return first template - mocked above

        const expectedTemplate = templates[0];

        expect(template.question).toBe(expectedTemplate.question);
        expect(template.query).toBe(expectedTemplate.query);
        expect(template.type).toBe(expectedTemplate.type);
        expect(template.category).toBe(expectedTemplate.category);
    });

    // ✅ Param = 0 -> First template
    it("should return first template when param is 0", async () =>
    {
        const template = await getTemplate(0); // should return first template 
        
        const expectedTemplate = templates[0];

        expect(template.question).toBe(expectedTemplate.question);
        expect(template.query).toBe(expectedTemplate.query);
        expect(template.type).toBe(expectedTemplate.type);
        expect(template.category).toBe(expectedTemplate.category);
    });

    // ✅ Param = 1 -> Second template
    it("should return second template when param is 1", async () =>
    {
        const template = await getTemplate(1); // should return second template 
        
        const expectedTemplate = templates[1];

        expect(template.question).toBe(expectedTemplate.question);
        expect(template.query).toBe(expectedTemplate.query);
        expect(template.type).toBe(expectedTemplate.type);
        expect(template.category).toBe(expectedTemplate.category);
    });

    // ✅ Param = 1 -> Second template
    it("should return first template when param is 'Geografía'", async () =>
    {
        const template = await getTemplate("Geografía"); // should return template about flags 
        
        const expectedTemplate = templates[0];

        expect(template.question).toBe(expectedTemplate.question);
        expect(template.query).toBe(expectedTemplate.query);
        expect(template.type).toBe(expectedTemplate.type);
        expect(template.category).toBe(expectedTemplate.category);
    });

    // ✅ Param = 1 -> Second template
    it("should return fourth template when param is 'Ciencia'", async () =>
    {
        const template = await getTemplate("Ciencia"); // should return template chem elements 
        
        const expectedTemplate = templates[3];

        expect(template.question).toBe(expectedTemplate.question);
        expect(template.query).toBe(expectedTemplate.query);
        expect(template.type).toBe(expectedTemplate.type);
        expect(template.category).toBe(expectedTemplate.category);
    });

    // ❌ Param of different type than string or number -> Error
    it("should throw error when parameter type is invalid", async () =>
    {
        // Null
        await expect(() => getTemplate(null)).rejects
            .toThrow("Invalid parameter type (expected int or string)");

        // Float
        await expect(() => getTemplate(1.4)).rejects
            .toThrow("Invalid parameter type (expected int or string)");

        // Array
        await expect(() => getTemplate( [] )).rejects
            .toThrow("Invalid parameter type (expected int or string)");

        // Object
        await expect(() => getTemplate( {} )).rejects
            .toThrow("Invalid parameter type (expected int or string)");
    });

    // ❌ No templates found in database -> Error
    it("should throw error when no templates are found", async () =>
    {
        Template.aggregate.mockResolvedValue([]); // No templates found
    
        await expect(getTemplate()).rejects
            .toThrow("No se han encontrado preguntas");
    });
});

describe( "generate questions", () =>
{
    const exampleQuestion =
    {
        title: "¿De dónde es esta bandera?",
        allAnswers: "España,Francia,Alemania,Italia",
        correctAnswer: "España",
        category: "Geografía",
    };

    /**
     * TEST:
     *  Generate the full list of questions for a game
     * 
     * ✅ POSITIVE CASES:
     * - Get a list of 10 questions with sufficient data in the database
     * 
     * ❌ NEGATIVE CASES:
     * - No questions in the database
     * - Insufficient number of questions in the database
     */
    
    // ✅ Sufficient data in the database -> Get list of 10 questions
    it("should return list of questions when the database has sufficient data", async () =>
    {
        // Mock Template and Question data
        Template.aggregate.mockResolvedValue([{ category: "Geografía" }]);
        Question.aggregate.mockResolvedValue([
            {
                title: exampleQuestion.title,
                allAnswers: exampleQuestion.allAnswers,
                correctAnswer: exampleQuestion.correctAnswer,
                category: exampleQuestion.category,
            }
        ]);

        const questions = await generateQuestions(); // should return 10 questions

        expect(questions).toHaveLength(NUMBER_OF_QUESTIONS);
        for (let i = 0; i < NUMBER_OF_QUESTIONS; i++)
        {
            let question = questions[i];

            expect(question).toHaveProperty("title", exampleQuestion.title);
            expect(question).toHaveProperty("allAnswers", exampleQuestion.allAnswers);
            expect(question).toHaveProperty("correctAnswer", exampleQuestion.correctAnswer);
            expect(question).toHaveProperty("category", exampleQuestion.category);
        }
    });

    // ❌ No questions in the database -> Error
    it("should throw error when no questions are returned from database", async () =>
    {
        // Mock Template and Question data
        Template.aggregate.mockResolvedValue([{ category: "Geografía" }]);
        Question.aggregate.mockResolvedValue([]); // No questions found

        await expect(generateQuestions()).rejects.toThrow("No se han encontrado preguntas");
    });

    // ❌ Insufficient number of questions in the database -> Error
    it("should throw error when insufficient questions are returned from database", async () =>
    {
        // Mock Template and Question data
        Template.aggregate.mockResolvedValue([{ category: "Geografía" }]);
        Question.aggregate.mockResolvedValue(Array(2).fill({... exampleQuestion})); // only 2 found

        await expect(generateQuestions()).rejects.toThrow("No se han encontrado preguntas suficientes");
    });
});

describe( "GET /generateQuestions", () =>
{
    /**
     * TEST:
     *  Call the endpoint /generateQuestions and get the list of questions.
     * 
     * ✅ POSITIVE CASES:
     * - Get a list of 10 questions with sufficient data in the database
     * 
     * ❌ NEGATIVE CASES:
     * - No questions in the database
     * - Insufficient number of questions in the database
     */
    
    const exampleQuestion =
    {
        title: "¿De dónde es esta bandera?",
        allAnswers: "España,Francia,Alemania,Italia",
        correctAnswer: "España",
        category: "Geografía",
    };

    // ✅ Get a list of 10 questions with sufficient data in the database
    it("should return a list of questions when the database has sufficient data", async () =>
    {
        // Mock Template and Question data
        Template.aggregate.mockResolvedValue([{ category: "Geografía" }]);
        Question.aggregate.mockResolvedValue(Array(10).fill({... exampleQuestion}));

        const response = await request(app).get("/generateQuestions");

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(10);
        response.body.forEach( question =>
        {
            expect(question).toHaveProperty("title", exampleQuestion.title);
            expect(question).toHaveProperty("allAnswers", exampleQuestion.allAnswers);
            expect(question).toHaveProperty("correctAnswer", exampleQuestion.correctAnswer);
            expect(question).toHaveProperty("category", exampleQuestion.category);
        });
    });

    // ❌ No questions in the database -> Error
    it("should return 500 error when no questions are returned from database", async () =>
    {
        // Mock Template and Question data - no template/questions found
        Template.aggregate.mockResolvedValue([]);
        Question.aggregate.mockResolvedValue([]);

        const response = await request(app).get("/generateQuestions");

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty("error", "Error interno en el servicio de preguntas.");
    });

    // ❌ Insufficient number of questions in the database -> Error
    it("should return 500 error when insufficient questions are returned from database", async () =>
    {
        // Mock Template and Question data
        Template.aggregate.mockResolvedValue([{ category: "Geografía" }]);
        Question.aggregate.mockResolvedValue(Array(2).fill({... exampleQuestion})); // only 2 found

        const response = await request(app).get("/generateQuestions");

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty("error", "Error interno en el servicio de preguntas.");
    });
});