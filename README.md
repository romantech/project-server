# Syntax Analyzer
Below are the API specifications for the [Syntax Analyzer project](https://github.com/romantech/syntax-analyzer). These APIs provide functionalities like syntax analysis and random sentence generation.

### Create syntax analysis data

This endpoint allows users to perform syntax analysis on a tokenized sentence using specified AI models. The analysis breaks down the sentence into its grammatical constituents and segments, providing detailed insights into its structure.

#### Endpoint

```
POST /analyzer
```

#### Request Body

| Field | Type | Options | Required | Description | Constraints |
| --- | --- | --- | --- | --- | --- |
| model | string | gpt-3.5, gpt-4 | Yes | Specifies which AI model to use for analysis | Must be one of the provided options |
| sentence | Array<string> | N/A | Yes | An array of tokens to be analyzed | Length: 2-20 tokens |

> Example Request
```json
{
  "model": "gpt-4",
  "sentence": ["My", "name", "is", "John", "."]
}
```

#### Response

> Response Schema
```tsx
type AnalysisSource = 'user' | 'sample';
type ISODateString = string;
type ConstituentType = 'clause' | 'phrase' | 'token'

type TConstituent = {
  id: number;                   // A random 9-digit number
  elementId: number;            // Constituent ID with a fixed value
  label: string;                // Grammatical constituent name in lowercase
  abbreviation: string;         // Abbreviated constituent name in lowercase
  type: ConstituentType;        // Constituent type
  comment?: string;             // Optional comment
};

type TSegment = {
  id: number;                   // A random 9-digit number
  begin: number;                // Start token index of the current segment
  end: number;                  // End token index of the current segment
  constituents: TConstituent[]; // Constituents of the current segment
  children: TSegment[];         // Child segments
};

type TAnalysis = {
  id: string;                   // A random string of 21 bytes
  source: AnalysisSource;       // Origin of the sentence
  createdAt: ISODateString;     // Timestamp in ISO 8601 format
  sentence: string[];           // The tokenized sentence
  rootSegment: TSegment;        // Contains only a single root segment
  isAnalyzedByGPT: boolean;     // Whether the sentence has been analyzed by AI or not
};
```

> 200 OK
```json
{
  "id": "YW6AX-AOZb2-xYXt05xkn",
  "source": "user",
  "createdAt": "2023-05-10T23:08:08.000Z",
  "sentence": ["My", "name", "is", "John", "."],
  "rootSegment": {
    "id": 840296172,
    "begin": 0,
    "end": 5,
    "constituents": [/* ... */],
    "children": [/* ... */]
  },
  "isAnalyzedByGPT": true
}
```

> 400 Bad Request
```json
{
  "errors": [
    {
      "type": "field",
      "value": "value that caused the error",
      "msg": "Error description",
      "path": "field_name",
      "location": "body"
    }
  ]
}
```

### Generate random sentences

This endpoint allows users to generate a set of random sentences based on optional constraints such as the number of sentences, maximum characters per sentence, and topics. 

#### Endpoint

```
GET /analyzer/random-sentences
```

#### Request Parameters

| Field | Type | Required | Default | Description | Constraints |
| --- | --- | --- | --- | --- | --- |
| sent_count | number | No | 5 | Number of random sentences to generate | Range: 1~5 |
| max_chars | number | No | 80 | Maximum number of characters per random sentence | Range: 10~80 |
| topics | string[] | No | [] | Topics for the random sentences | Max items: 3 |

#### Response

> 200 OK
```json
[
  "Apples are a popular fruit that come in many different varieties.",
  "Apple trees are typically grown in orchards for commercial production.",
  "Apple cider is a refreshing beverage made from pressed apples.",
]
```

> 400 Bad Request
```json
{
  "errors": [
    {
      "type": "field",
      "value": "value that caused the error",
      "msg": "Error description",
      "path": "field_name",
      "location": "query"
    }
  ]
}
```

### Check remaining counts

This endpoint provides the remaining available counts for both syntax analysis and random sentence generation per user. Counts reset daily with a maximum limit of 10 analyses and 20 random sentences per user.

#### Endpoint


```
GET /analyzer/remaining-counts
```

#### Response

> 200 OK
```json
{
  "analysis": 10, // Remaining count for syntax analysis
  "random_sentence": 20 // Remaining count for random sentence generation
}
```

> 400 Bad Request
```json
{
	"status": "error",
	"message": "Error description"
}
```
