export const analysisPrompt = `
Your task is to break down an English sentence into its grammatical constituents, such as the subject, verb, object, and complement. These constituents will be identified, and the results must be returned in JSON format. The output must strictly be in JSON format and SHOULD NOT CONTAIN ANY ADDITIONAL EXPLANATORY TEXT OR COMMENTS.

To ensure consistency, you will create data in accordance with the following TypeScript sentence analysis data structure:

type ConstituentType = 'clause' | 'phrase' | 'token';

type Constituent = {
  id: number; // A random 9-digit number
  elementId: number; // Constituent ID with a fixed value
  label: string; // Grammatical constituent name in lowercase
  abbreviation: string; // Abbreviated constituent name in lowercase
  type: ConstituentType; // Constituent type
  comment?: string; // Optional comment
}

type Segment = {
  id: number; // A random 9-digit number
  begin: number; // Start token index
  end: number; // End token index
  constituents: Constituent[]; // Can be empty
  children: Segment[]; // Can be empty
};

type Analysis = {
  id: string; // A random string of 21 bytes
  source: 'user' // Always 'user'
  createdAt: string; // ISO 8601 format
  sentence: string[]; // Tokenized sentence
  rootSegment: Segment; // The array contains only a single root segment
};

The 'begin' and 'end' of a segment refer to its position in a tokenized version of the sentence. For this task, tokenization should be performed based on words, commas, and periods.

For instance, the sentence 'Customer reviews indicate that many modern mobile devices are often unnecessarily complicated.' could be divided into the following segments:

- root - root segment encompassing the entire sentence: [begin 0, end 13]
    - child - [subject] 'Customer reviews': [0, 2]
    - child - [verb] 'indicate': [2, 3]
    - child - [relative clause, object] 'that many modern mobile devices are often unnecessarily complicated': [3, 12]
        - child - [empty segment] 'that': [3, 4]
        - child - [subject] 'many modern mobile devices': [4, 8]
        - child - [verb] 'are': [8, 9]
        - child - [empty segment] 'often': [9, 10]
        - child - [complement] 'unnecessarily complicated': [10, 12]
    - child - [empty segment] '.': [12, 13]

In the given example, elements such as 'that,' 'often,' and '.' are not considered grammatical constituents, but they are included to ensure the entire sentence is covered. This is to make sure every token in the sentence belongs to a segment, even if the segment doesn't represent a specific grammatical constituent.

Let's take another example, 'I am a boy who likes to play tennis.' and break it down into its grammatical constituents:

- root - root segment encompassing the entire sentence: [begin 0, end 10]
    - child - [subject] 'I': [0, 1]
    - child - [verb] 'am': [1, 2]
    - child - [object] 'a boy': [2, 4]
    - child - [relative clause] 'who likes to play tennis': [4, 9]
        - child - [subject] 'who': [4, 5]
        - child - [verb] 'likes': [5, 6]
        - child - [object, to-infinitive] 'to play tennis': [6, 9]
    - child - [empty segment] '.': [9, 10]

It's crucial to understand that the first root segment always encompasses the entire sentence, where 'rootSegment.begin' is always 0, and 'rootSegment.end' is always equal to the length of the sentence array. 

To ensure proper segmentation, each child segment must remain within its parent segment's range. For instance, if the parent segment's end is 13, no child segment can exceed this value. There should be no overlap between different child segments, and multiple grammatical constituents within the same begin-end range can be added to the segment.constituents array.

To illustrate, if a parent segment's begin-end range is 10-13, any child segment's begin-end range must always fall within this range of 10-13. Moreover, all child segments must completely fill the parent's begin-end range. In other words, even in cases where there are no grammatical constituents, we need to create empty segments to fill the range of the parent segment. See the examples provided for further clarification:

- parent segment range: [begin 10, end 13]
    - child segments case 1: [[10, 11], [11, 12], [12, 13]]
    - child segments case 2: [[10, 12], [12, 13]]
    - child segments case 3: [[10, 11], [11, 13]]

'id' field should consist of a randomly generated 9-digit number and must not be a specific sequence, especially not sequential digits like 123456789. Additionally, it cannot begin with 0.

There's no need to add a constituent for the root segment; thus, 'rootSegment.constituents' will always be an empty array. Likewise, the 'segment.constituents' property for the empty segment is also an empty array. Furthermore, independent punctuation is not treated as grammatical constituents.

In analysis data, you can use the following grammatical constituents:"

[
  { elementId: 1, label: 'subject', abbreviation: 's', type: 'token' },
  { elementId: 2, label: 'verb', abbreviation: 'v', type: 'token' },
  { elementId: 3, label: 'auxiliary verb', abbreviation: 'aux.v', type: 'token' },
  { elementId: 4, label: 'modal verb', abbreviation: 'mod.v', type: 'token' },
  { elementId: 5, label: 'object', abbreviation: 'o', type: 'token' },
  { elementId: 6, label: 'indirect object', abbreviation: 'i.o.', type: 'token' },
  { elementId: 7, label: 'direct object', abbreviation: 'd.o.', type: 'token' },
  { elementId: 8, label: 'prepositional object', abbreviation: 'prp.o.', type: 'token' },
  { elementId: 9, label: 'complement', abbreviation: 'c', type: 'token' },
  { elementId: 10, label: 'object complement', abbreviation: 'o.c.', type: 'token' },
  { elementId: 11, label: 'to-infinitive', abbreviation: 't-inf', type: 'token' },
  { elementId: 12, label: 'infinitive object', abbreviation: 'inf.o.', type: 'token' },
  { elementId: 13, label: 'gerund', abbreviation: 'g', type: 'token' },
  { elementId: 14, label: 'gerund object', abbreviation: 'g.o.', type: 'phrase' },
  { elementId: 15, label: 'participle', abbreviation: 'pt', type: 'token' },
  { elementId: 16, label: 'participle object', abbreviation: 'pt.o.', type: 'phrase' },
  { elementId: 17, label: 'participle phrase', abbreviation: 'pt.phr', type: 'phrase' },
  { elementId: 18, label: 'prepositional phrase', abbreviation: 'prp.phr', type: 'phrase' },
  { elementId: 19, label: 'adverbial phrase', abbreviation: 'adv.phr', type: 'phrase' },
  { elementId: 20, label: 'adjectival phrase', abbreviation: 'adj.phr', type: 'phrase' },
  { elementId: 21, label: 'coordinating conjunction', abbreviation: 'co.t', type: 'phrase' },
  { elementId: 22, label: 'coordinating clause', abbreviation: 'co.cl', type: 'clause' },
  { elementId: 23, label: 'parallel clause', abbreviation: 'p.cl', type: 'clause' },
  { elementId: 24, label: 'noun clause', abbreviation: 'n.cl', type: 'clause' },
  { elementId: 25, label: 'adjectival clause', abbreviation: 'adj.cl', type: 'clause' },
  { elementId: 26, label: 'adverbial clause', abbreviation: 'adv.cl', type: 'clause' },
  { elementId: 27, label: 'inserted clause', abbreviation: 'i.cl', type: 'clause' },
  { elementId: 28, label: 'relative clause', abbreviation: 'rel.cl', type: 'clause' },
  { elementId: 29, label: 'dependent clause', abbreviation: 'dep.cl', type: 'clause' },
  { elementId: 30, label: 'independent clause', abbreviation: 'ind.cl', type: 'clause' },
]

Remember, your response should be STRICTLY in the form of a JSON output. DO NOT include any explanatory text, comments, or any non-JSON content in your response. Any non-JSON content in your response will be considered as an error.

Please wait for the English sentence that will be provided for analysis. Kindly note if I provide a tokenized array, you can use it directly.
`;
