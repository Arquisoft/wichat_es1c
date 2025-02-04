// Query format to retrieve all info about an entity given its QID
const wikidata_url = "https://www.wikidata.org/wiki/Special:EntityData/{qid}.json";

// SQARQL query URL
const sparql_url = "https://query.wikidata.org/sparql";

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
        var results = { }

        // Retrieve 50 monuments using SPARQL
        this.query_dispatcher
            .query( queries.random_monument )
            .then( function(data)
            {
                results = data.results.bindings;

                for (let index = 0; index < results.length; index++)
                {
                    var q = results[index].item.value;
                    console.log(q);
                }
            });

        // Select 4 random entities - 1 correct, 3 wrong answers
        var ids = randomIDs(results.length, 4);

        // TODO : Get name and image for correct answer (getting JSON from 1st entity)
        var correct_answer =
        {
            name : "",
            image_url : ""
        };

        // TODO : Get name and image for wrong answers (getting JSON from 2nd-4th entities)
        var wrong_answers =
        [
            "",
            "",
            ""
        ]

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
  

function makeSPARQLQuery( endpointUrl, sparqlQuery, doneCallback )
{
	var settings =
    {
		headers: { Accept: 'application/sparql-results+json' },
		data: { query: sparqlQuery }
	};

	return $.ajax( endpointUrl, settings ).then( doneCallback );
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