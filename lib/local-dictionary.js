// QuickWord – Local Fallback Dictionary
// Used when the Free Dictionary API is unreachable.

const LOCAL_DICTIONARY = {
  "training": {
    phonetic: "/ˈtreɪnɪŋ/",
    audioUrl: null,
    definitions: ["The action of teaching a person or animal a particular skill or type of behaviour."],
    examples: [
      "She's in training for the Olympic Games.",
      "The staff received training on the new software.",
      "His training as a doctor helped him stay calm."
    ],
    synonyms: ["coaching", "instruction", "drilling", "preparation", "education"]
  },
  "ephemeral": {
    phonetic: "/ɪˈfem(ə)r(ə)l/",
    audioUrl: null,
    definitions: ["Lasting for a very short time."],
    examples: [
      "Fame in the social media world is ephemeral.",
      "The ephemeral beauty of cherry blossoms draws millions of visitors.",
      "His happiness was ephemeral, fading by nightfall."
    ],
    synonyms: ["transient", "fleeting", "momentary", "brief", "short-lived"]
  },
  "resilient": {
    phonetic: "/rɪˈzɪlɪənt/",
    audioUrl: null,
    definitions: ["Able to withstand or recover quickly from difficult conditions."],
    examples: [
      "She proved resilient in the face of adversity.",
      "The resilient economy bounced back after the recession.",
      "Children are often more resilient than adults give them credit for."
    ],
    synonyms: ["tough", "hardy", "adaptable", "flexible", "buoyant"]
  },
  "ambiguous": {
    phonetic: "/amˈbɪɡjuəs/",
    audioUrl: null,
    definitions: ["Open to more than one interpretation; not having one obvious meaning."],
    examples: [
      "The contract contained several ambiguous clauses.",
      "His ambiguous answer left everyone confused.",
      "The law is ambiguous on this particular point."
    ],
    synonyms: ["unclear", "equivocal", "vague", "dubious", "cryptic"]
  },
  "eloquent": {
    phonetic: "/ˈɛləkwənt/",
    audioUrl: null,
    definitions: ["Fluent or persuasive in speaking or writing."],
    examples: [
      "She gave an eloquent speech at the ceremony.",
      "He was eloquent in his defence of human rights.",
      "The essay was an eloquent plea for reform."
    ],
    synonyms: ["articulate", "fluent", "expressive", "persuasive", "silver-tongued"]
  },
  "diligent": {
    phonetic: "/ˈdɪlɪdʒ(ə)nt/",
    audioUrl: null,
    definitions: ["Having or showing care and conscientiousness in one's work or duties."],
    examples: [
      "A diligent student always completes assignments on time.",
      "Her diligent research uncovered startling new evidence.",
      "He was diligent in keeping records."
    ],
    synonyms: ["industrious", "hardworking", "assiduous", "conscientious", "tireless"]
  },
  "pragmatic": {
    phonetic: "/praɡˈmatɪk/",
    audioUrl: null,
    definitions: ["Dealing with things sensibly and realistically in a way that is based on practical considerations."],
    examples: [
      "A pragmatic approach to management gets results.",
      "She was pragmatic about the limitations of the project.",
      "We need to be pragmatic rather than idealistic."
    ],
    synonyms: ["practical", "realistic", "sensible", "down-to-earth", "rational"]
  },
  "meticulous": {
    phonetic: "/mɪˈtɪkjʊləs/",
    audioUrl: null,
    definitions: ["Showing great attention to detail or being very careful and precise."],
    examples: [
      "He was meticulous about his appearance.",
      "The meticulous restoration took two years.",
      "She kept meticulous records of every transaction."
    ],
    synonyms: ["careful", "punctilious", "precise", "thorough", "scrupulous"]
  },
  "serendipity": {
    phonetic: "/ˌsɛr(ə)nˈdɪpɪti/",
    audioUrl: null,
    definitions: ["The occurrence and development of events by chance in a happy or beneficial way."],
    examples: [
      "Finding that job was pure serendipity.",
      "Serendipity led him to the discovery.",
      "Their meeting was an act of serendipity."
    ],
    synonyms: ["luck", "chance", "fortune", "happy accident", "fluke"]
  },
  "tenacious": {
    phonetic: "/tɪˈneɪʃəs/",
    audioUrl: null,
    definitions: ["Tending to keep a firm hold of something; persistent."],
    examples: [
      "She was tenacious in pursuing her goals.",
      "His tenacious grip on the rope saved his life.",
      "A tenacious journalist will not let a story go."
    ],
    synonyms: ["persistent", "determined", "dogged", "resolute", "stubborn"]
  },
  "apple": {
    phonetic: "/ˈap(ə)l/",
    definitions: ["The round fruit of a tree of the rose family, which typically has thin red or green skin and crisp flesh."],
    examples: ["He took a big bite out of the apple.", "Apple crumble is my favorite dessert."],
    synonyms: ["fruit", "pome"]
  },
  "book": {
    phonetic: "/bʊk/",
    definitions: ["A written or printed work consisting of pages glued or sewn together along one side and bound in covers."],
    examples: ["I'm reading a fascinating book about space.", "She spent the afternoon looking for books in the library."],
    synonyms: ["volume", "tome", "publication", "novel"]
  },
  "dictionary": {
    phonetic: "/ˈdɪkʃ(ə)n(ə)ri/",
    definitions: ["A book or electronic resource that lists the words of a language and gives their meaning, or equivalent words in a different language."],
    examples: ["I looked up the word in the dictionary.", "A good dictionary is essential for language learners."],
    synonyms: ["lexicon", "wordbook", "glossary"]
  },
  "word": {
    phonetic: "/wəːd/",
    definitions: ["A single distinct meaningful element of speech or writing, used with others to form a sentence."],
    examples: ["What is the meaning of this word?", "He choice his words carefully."],
    synonyms: ["term", "expression", "unit"]
  },
  "test": {
    phonetic: "/tɛst/",
    definitions: ["A procedure intended to establish the quality, performance, or reliability of something, especially before it is taken into widespread use."],
    examples: ["The pilot performed a test flight.", "This is a test of the emergency broadcast system."],
    synonyms: ["trial", "examination", "check", "check-up"]
  }
};

// Expose as global for use by dictionary.js
window.__QW_LOCAL_DICT__ = LOCAL_DICTIONARY;
