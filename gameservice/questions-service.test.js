const fs = require("fs");
const path = require("path");

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
     */

    // ✅ Undefined param -> Random template
    it("should return a random template when param is undefined", () =>
    {
        const template = getTemplate(); // should return a random template

        // Check if the returned template is one of the templates in the JSON file
        const isTemplateValid = templates.some(
            (t) =>
                t.question === template.question &&
                t.query === template.query &&
                t.type === template.type &&
                t.category === template.category
        );

        expect(isTemplateValid).toBe(true);
    });

    // ✅ Param = 0 -> First template
    it("should return first template when param is 0", () =>
    {
        const template = getTemplate(0); // should return first template 
        
        const expectedTemplate = templates[0];

        expect(template.question).toBe(expectedTemplate.question);
        expect(template.query).toBe(expectedTemplate.query);
        expect(template.type).toBe(expectedTemplate.type);
        expect(template.category).toBe(expectedTemplate.category);
    });

    // ✅ Param = 1 -> Second template
    it("should return first template when param is 0", () =>
    {
        const template = getTemplate(0); // should return second template 
        
        const expectedTemplate = templates[1];

        expect(template.question).toBe(expectedTemplate.question);
        expect(template.query).toBe(expectedTemplate.query);
        expect(template.type).toBe(expectedTemplate.type);
        expect(template.category).toBe(expectedTemplate.category);
    });

    // ✅ Param = 1 -> Second template
    it("should return first template when param is 0", () =>
    {
        const template = getTemplate("Geografía"); // should return template about flags 
        
        const expectedTemplate = templates[0];

        expect(template.question).toBe(expectedTemplate.question);
        expect(template.query).toBe(expectedTemplate.query);
        expect(template.type).toBe(expectedTemplate.type);
        expect(template.category).toBe(expectedTemplate.category);
    });

    // ✅ Param = 1 -> Second template
    it("should return first template when param is 0", () =>
    {
        const template = getTemplate("Ciencia"); // should return template chem elements 
        
        const expectedTemplate = templates[3];

        expect(template.question).toBe(expectedTemplate.question);
        expect(template.query).toBe(expectedTemplate.query);
        expect(template.type).toBe(expectedTemplate.type);
        expect(template.category).toBe(expectedTemplate.category);
    });

    // ❌ Param of different type than string or number
    it("should throw error when parameter type is invalid", () =>
    {
        // Null
        expect(() => getTemplate(null))
            .toThrow("Invalid parameter type (expected int or string)");

        // Float
        expect(() => getTemplate(1.4))
        .toThrow("Invalid parameter type (expected int or string)");

        // Array
        expect(() => getTemplate( [] ))
            .toThrow("Invalid parameter type (expected int or string)");

        // Object
        expect(() => getTemplate( {} ))
        .toThrow("Invalid parameter type (expected int or string)");
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
    it("should throw error when no questions are found", async () =>
    {
        // Mock Template and Question data
        Template.aggregate.mockResolvedValue([{ category: "Geografía" }]);
        Question.aggregate.mockResolvedValue([]); // No questions found

        await expect(generateQuestions()).rejects.toThrow("No se han encontrado preguntas");
    });

    // ❌ Insufficient number of questions in the database -> Error
    it("should throw error when insufficient questions are found", async () =>
    {
        // Mock Template and Question data
        Template.aggregate.mockResolvedValue([{ category: "Geografía" }]);
        Question.aggregate.mockResolvedValue([exampleQuestion, exampleQuestion]); // only 2 found

        await expect(generateQuestions()).rejects.toThrow("No se han encontrado preguntas suficientes");
    });
});