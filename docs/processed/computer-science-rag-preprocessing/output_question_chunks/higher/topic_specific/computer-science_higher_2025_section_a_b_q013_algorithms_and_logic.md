---
subject: "Computer Science"
subject_id: "computer-science"
level: "Higher"
year: 2025
paper: "Section A B"
question_number: 13
section: "Question 9"
topic: "Algorithms and Logic"
secondary_topics: []
classification_type: "topic_specific"
source_type: "past_paper_with_marking_scheme"
has_visual: true
visual_assets:
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2025_section_a_b_exam_page_007.png"
source_exam_pages:
  - "7"
source_marking_scheme_pages:
  - "8"
pairing_confidence: "high"
topic_confidence: "medium"
classification_source: "fallback_rules"
candidate_topics:
  - "Algorithms and Logic"
  - "Computer Systems"
needs_review: false
review_reason: ""
---


# Question

Question 9

The intention of the Python code below is to scan through all integers from 1 to 20 inclusive and:

        if the integer is evenly divisible by both 3 and 5, display the word FizzBuzz.
        if the integer is evenly divisible by 3 and not divisible by 5 display the word Fizz.
        if the integer is evenly divisible by 5 and not divisible by 3 display the word Buzz.
 1  For i in range(1, 21):
 2      if i % 3 == 0:
 3          print("Fizz"
 4      elif i % 5 == 0:
 5          print(Buzz")
 6      elif i % 3 == 0 and i % 5 == 0:
 7          print("FizzBuzz")
 8      else
 9          print(number)

(a)   There are a number of syntax errors in the code. Identify any two of these errors.

  Syntax error 1:

  Syntax error 2:


(b)   Identify the logic error in the code and suggest a solution.

  Logic error:



  Suggested solution:

# Marking Scheme

Question 9                                                                            6(2,4) marks

(a)
    Any two syntax errors from the following:
              Line 1. Incorrect case - For instead of for
              Line 3. Missing closing bracket
              Line 5. Missing opening quote
              Line 8. Missing colon after else
              Line 9. Variable number is undefined

        Each syntax error      1 mark

(b)
     Logic error: The program never displays FizzBuzz as intended. This should happen when
      the loop counter variable, i is 15.
     Suggested solution: Move the test for divisibility by both 3 and 5 (i.e. line 6) to the start
       of the if-statement (i.e. before the individual tests).


         Logic error correctly identified     2 marks
        Suggested solution              2 mark

# Source References

Exam paper:
- file: intermediate_markdown/exam_papers/higher/computer_science_higher_2025_section_a_b_exam.md
- pages: [7]

Marking scheme:
- file: intermediate_markdown/marking_schemes/higher/computer_science_higher_2025_paper_1_marking_scheme.md
- pages: [8]

# Notes

