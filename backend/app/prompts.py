
EXPLAIN = """
The following is a selection from an article written in {language}.
Explain the text in {language}, using only very simple language, as you might to a 5 year old or a beginner to {language}.

{text}
"""

TRANSLATE = """
The following is a user highlighted selection from a an article written in {language}.
Faithfully translate the text into English.

{text}
"""

COMPREHENSION = """
The following is a piece of an article written in {language}. Based on the passage, create a reading comprehension question for a non-native speaker. The question must be written in {language}.

Your response should only include the question text and no other information. Do not include the answer.

{text}
"""

VOCAB = """
The following is a piece of an article written in {language} as part of a language class for non-native spakers. Please highlight {nwords} that could be used as vocabulary words for students.

Your response should only include the vocab words separated by commas, as in: "cascade,bicycle,computer".

{text}
"""

TOTENSE = """
The following is a piece of an article written in {language} as part of a language class for non-native spakers. The students are trying to learn the {to_tense} tense.

Please convert all the relevant verb tenses to the {to_tense} tense. Make all of the necessary grammatical and other linguistic changes so that the passage is correct in the {to_tense} tense.

{text}
"""