# Syntax Analyzer
Below are the API specifications for the [Syntax Analyzer](https://github.com/romantech/syntax-analyzer) project, offering features such as syntax analysis and random sentence generation.

### Analyze Sentence Syntax

This endpoint uses specified AI models to analyze the syntax of tokenized sentences, breaking them down into grammatical elements for detailed structural insights.

#### Endpoint

```
POST /analyzer
```

#### Request Body

| Field | Type | Options | Required | Description | Constraints |
| --- | --- | --- | --- | --- | --- |
| `model` | `string` | `gpt-3.5`, `gpt-4` | Yes | AI model for analysis | One of: `gpt-3.5`, `gpt-4` |
| `sentence` | `Array<string>` | N/A | Yes | Tokens for analysis | Range: 2~20 tokens |

> Example Request
```json
{
  "model": "gpt-4",
  "sentence": ["My", "name", "is", "John", "."]
}
```

#### Response

> Analysis Data Model
```tsx
type AnalysisSource = 'user' | 'sample';
type ISODateString = string;
type ConstituentType = 'clause' | 'phrase' | 'token'

type TConstituent = {
  id: number;                   // Random 9-digit number
  elementId: number;            // Constituent ID
  label: string;                // Grammatical label, e.g., "subject"
  abbreviation: string;         // Abbreviation, e.g., "s"
  type: ConstituentType;        // Type of constituent
  comment?: string;             // Optional commentary
};

type TSegment = {
  id: number;                   // Random 9-digit number
  begin: number;                // Start index
  end: number;                  // End index
  constituents: TConstituent[]; // Segment constituents
  children: TSegment[];         // Sub-segments
};

type TAnalysis = {
  id: string;                   // Random 21-byte string
  source: AnalysisSource;       // Data source
  createdAt: ISODateString;     // ISO 8601 timestamp
  sentence: string[];           // Tokenized sentence
  rootSegment: TSegment;        // Root segment
  isAnalyzedByGPT: boolean;     // AI-analyzed status
};
```

<details><summary>200 OK</summary>
<br />
	
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
    "constituents": [],
    "children": [
      {
        "id": 987654321,
        "begin": 0,
        "end": 2,
        "constituents": [
          {
            "id": 456789123,
            "elementId": 1,
            "label": "subject",
            "abbreviation": "s",
            "type": "token"
          }
        ],
        "children": []
      },
      {
        "id": 789123456,
        "begin": 2,
        "end": 3,
        "constituents": [
          {
            "id": 321654987,
            "elementId": 2,
            "label": "verb",
            "abbreviation": "v",
            "type": "token"
          }
        ],
        "children": []
      },
      {
        "id": 654321789,
        "begin": 3,
        "end": 4,
        "constituents": [
          {
            "id": 654987321,
            "elementId": 5,
            "label": "object",
            "abbreviation": "o",
            "type": "token"
          }
        ],
        "children": []
      },
      {
        "id": 321789654,
        "begin": 4,
        "end": 5,
        "constituents": [],
        "children": []
      }
    ]
  },
  "isAnalyzedByGPT": true
}
```
</details>

<details><summary>400 Bad Request</summary>
<br />
	
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
</details>

### Generate random sentences

This endpoint generates random sentences, optionally constrained by sentence count, character limit, and topics.

#### Endpoint

```
GET /analyzer/random-sentences
```

#### Request Parameters

| Field | Type | Required | Default | Description | Constraints |
| --- | --- | --- | --- | --- | --- |
| `sent_count` | `number` | No | `5` | Quantity of sentences | Range: 1~5 |
| `max_chars` | `number` | No | `80` | Character limit per sentence | Range: 10~80 |
| `topics` | `Array<string>` | No | `[]` | Topics to include in sentences | Max 3 topics |

#### Response

<details><summary>200 OK</summary>
<br />
	
```json
[
  "Apples are a popular fruit that come in many different varieties.",
  "Apple trees are typically grown in orchards for commercial production.",
  "Apple cider is a refreshing beverage made from pressed apples.",
]
```
</details>

<details><summary>400 Bad Request</summary>
<br />
	
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
</details>

### Check remaining counts

This endpoint provides remaining user quotas for syntax analysis and random sentences, resetting daily to 10 and 20, respectively.

#### Endpoint

```
GET /analyzer/remaining-counts
```

#### Response

<details><summary>200 OK</summary>
<br />
	
```json
{
  "analysis": 10,
  "random_sentence": 20
}
```
- `analysis` : Remaining count for syntax analysis
- `random_sentence` : Remaining count for random sentence generation
</details>

<details><summary>400 Bad Request</summary>
<br />
	
```json
{
  "status": "error",
  "message": "Error description"
}
```
</details>
