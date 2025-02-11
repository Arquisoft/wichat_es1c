// Query format to retrieve all info about an entity given its QID
const wikidata_url = "https://www.wikidata.org/wiki/Special:EntityData/{qid}.json";

// SQARQL query URL
const sparql_url = "https://query.wikidata.org/sparql";

// URL format for retrieving images from Wikidata
const image_format = "https://commons.wikimedia.org/wiki/File:{file_name}";

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
        `SELECT DISTINCT ?item WHERE {
            SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE]". }
            {
            SELECT DISTINCT ?item WHERE {
                ?item p:P31 ?statement0.
                ?statement0 (ps:P31/(wdt:P279*)) wd:Q4989906.
            }
            LIMIT 50
            }
        }`
}

class Wikidata
{
    constructor()
    {
        this.query_dispatcher = new SPARQLQueryDispatcher( sparql_url );
    }

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
        var results = [];

        // Retrieve 50 monuments using SPARQL
        this.query_dispatcher
            .query( queries.random_monument )
            .then( function(data)
            {
                var response = data.results.bindings;

                for (let index = 0; index < response.length; index++)
                {
                    var q = response[index].item.value + ".json";
                    results.push(q);
                }
            });

        // Select 4 random entities - 1 correct, 3 wrong answers
        var ids = randomIDs(results.length, 4);
        console.log(results.length);
        console.log(ids);

        // Get name and image for correct answer (getting JSON from 1st entity)
        var correct_entity_url = results[ids[0]];
        var correct_entity = getEntity(correct_entity_url);
        var correct_answer =
        {
            name : getEntityName(correct_entity),
            image_url : getImageFile(correct_entity)
        };

        // Get name and image for wrong answers (getting JSON from 2nd-4th entities)
        var wrong_answers_urls = [results[ids[1]], results[ids[2]], results[ids[3]]];
        var wrong_answers =
        [
            getEntityName( getEntity(wrong_answers_urls[0]) ),
            getEntityName( getEntity(wrong_answers_urls[1]) ),
            getEntityName( getEntity(wrong_answers_urls[2]) )
        ];

        // Build result JSON
        var result =
        {
            question : "What is the name of this monument?",
            correct_answer : correct_answer.name,
            wrong_answers : shuffle(wrong_answers),
            image_url : correct_answer.image_url
        };

        return result;
    }
}

// Aux. functions and classes ---------------------------------------

/**
 * Aux. function to get a Wikidata entity from URL.
 * @param {string} url URL
 * @returns {JSON} JSON containing the entity
 */
async function getEntity(url) // <- TODO: this isn't working
{
    try
    {
        const response = await fetch(url);
        
        if (!response.ok)
            throw new Error(`Request error: ${response.status}`);

        const data = await response.json();
        console.log(data);
        return data.entities[0];
    }
    catch (error)
    {
        console.error(`Error while getting entity JSON: ${error}`);
        return null;
    }
}

/**
 * Aux. function to extract name from Wikidata entity.
 * @param {JSON} entity Entity in JSON format
 * @returns {string} name of the entity
 */
function getEntityName(entity)
{
    return entity.labels.en.value;
}

/**
 * Aux. function to extract image URL from Wikidata entity.
 * @param {JSON} entity Entity in JSON format
 * @returns {string} image file name
 */
function getImageFile(entity)
{
    var fileName = entity.claims["P18"][0].mainsnak.datavalue.value;
    fileName = fileName.replace(" ", "_");
    return image_format.replace("{file_name}", fileName);
}

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

function shuffle(array)
{
    let currentIndex = array.length;
  
    // While there remain elements to shuffle
    while (currentIndex != 0) {
  
      // Pick a remaining element
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
}

// Aux. class - SPARQL Query Dispatcher
class SPARQLQueryDispatcher
{
	constructor( endpoint )
    {
		this.endpoint = endpoint;
	}

	async query( sparqlQuery )
    {
		const fullUrl = this.endpoint + '?query=' + encodeURIComponent( sparqlQuery );
		const headers = { 'Accept': 'application/sparql-results+json' };

		return fetch( fullUrl, { headers } ).then( body => body.json() );
	}
}