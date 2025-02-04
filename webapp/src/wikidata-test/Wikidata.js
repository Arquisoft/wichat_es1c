// Query format to retrieve all info about an entity given its QID
const wikidata_url = "https://www.wikidata.org/wiki/Special:EntityData/{qid}.json";

// Question JSON format
const response_format =
{
    question : "",
    correct_answer : "",
    wrong_answers : ["", "", ""],
    image_url : ""
}

// Wikidata queries
// To be moved to a separate file (maybe a .properties file)
const queries =
{
    random_monument :
    `
    SELECT ?item ?itemLabel WHERE {
    VALUES ?type { 
        wd:Q4989906   # Monument
    }
    ?item wdt:P31 ?type.
    FILTER(STRSTARTS(STR(?item), "http://www.wikidata.org/entity/Q"))
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
    }
    LIMIT 50
    `
}

class Wikidata
{
    /**
     * Generates a random question, returning a JSON containing info about the
     * question, with this format:
     * ```
     * {
     *  question : "<question>",
     *  correct_answer : "<correct answer>",
     *  wrong_answers : ["<wrong 1>", "<wrong 2>", "<wrong 3>"],
     *  image_url : "<image URL>"
     * }
     * ```
     * 
     * The generated question will come from one of these topics:
     *  * Countries
     *  * Cities
     *  * Monuments and landmarks
     *  * Landscapes
     */
    async generateRandomQuestion()
    {
        /* TODO:
         *  Function to be used along with the mixed mode, allowing 
         *  from each topic.
         *  
         *  To be implemented.
         */
    }

    
    /**
     * Generates a random question related to monuments, where the user will
     * have to guess the name of the monument among 4 ellegible answers, given
     * an image of said monument.
     * A JSON will be returned, containing info about the question, with this
     * format:
     * 
     * ```
     * {
     *  question : "<question>",
     *  correct_answer : "<correct answer>",
     *  wrong_answers : ["<wrong 1>", "<wrong 2>", "<wrong 3>"],
     *  image_url : "<image URL>"
     * }
     * ```
     */
    async generateMonumentQuestion()
    {
        var result = { ... response_format }

        try
        {
            // Use query to retrieve 4 random monuments
            var response = await fetch(
                'https://query.wikidata.org/sparql',
                {
                    method : 'POST',
                    headers :
                    {
                        'Content-Type' : 'application/x-www-form-urlencoded',
                        'Accept' : 'application/sparql-results+json'
                    },
                    body : new URLSearchParams({ query : queries.random_monument })
                }
            );

            if (!response.ok)
                throw new Error("Failed to execute SPARQL query");

            const data = await response.json();

            // Get 4 random entities from response
            // TODO

            // Build result JSON objet
            // TODO

            console.log(response);
        }
        catch (error)
        {
            console.error(error);
            return null;
        }

        return result;
    }
}

// Aux. methods -------------------------------------------

function randomIDs(len, count)
{
    let arr = Array.from({ length: len  }, (_, i) => i);

    for (let i = arr.length - 1; i > 0; i--)
    {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr.slice(0, count);
}