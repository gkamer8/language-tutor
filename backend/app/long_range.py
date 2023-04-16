
# Given a passage, break it up into smaller chunks
def break_up_passage(passage, max_char_size=5*250):
    
    lines = passage.split("\n")
    results = []
    for line in lines:
        if len(results) > 0 and len(results[-1]) + len(line) < max_char_size:
            results[-1] += "\n" + line
        else:
            results.append(line)
    return results
    
