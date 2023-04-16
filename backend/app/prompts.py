
EXPLAIN = """
The following is a selection from a an article written in {language}.
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

Your response should only include the question text and no other information.

{text}
"""

VOCAB = """
The following is a piece of an article written in {language} as part of a language class for non-native spakers. Please highlight {nwords} that could be used as vocabulary words for students.

Your response should only include the vocab words separated by commas, as in: "cascade,bicycle,computer".

{text}
"""