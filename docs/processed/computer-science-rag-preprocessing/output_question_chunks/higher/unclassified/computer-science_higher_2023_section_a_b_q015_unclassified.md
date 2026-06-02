---
subject: "Computer Science"
subject_id: "computer-science"
level: "Higher"
year: 2023
paper: "Section A B"
question_number: 15
section: "Question 11"
topic: "Unclassified"
secondary_topics: []
classification_type: "unclassified"
source_type: "past_paper_with_marking_scheme"
has_visual: true
visual_assets:
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2023_section_a_b_exam_page_011.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2023_section_a_b_exam_page_010.png"
source_exam_pages:
  - 10
  - 11
source_marking_scheme_pages:
  - 10
pairing_confidence: "high"
needs_review: false
review_reason: ""
---

# Question

Question 11

Figure 6 depicts a flowchart of a Python algorithm which can be used to generate new usernames
for students. You can assume that the date is in the format: ddmmyyyy.





                                              Figure 6

(a)  Name one input and one output of the algorithm.

  Input:

  Output:


(b)   Referring to the relevant step(s) in the flowchart explain how the algorithm uses string
       slicing and string concatenation.


  String slicing:





  String concatenation:





Leaving Certificate 2023                       10
Computer Science, Sections A & B – Higher level

<!-- PAGE 11 -->
# Page 11

![Page 11](../../../image_assets/exam_papers/higher/computer_science_higher_2023_section_a_b_exam_page_011.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; page contains vector drawings; text contains visual keywords -->

# Marking Scheme

Question 11                                                              2(1,1) + 4(2,2) marks

(a)
     Valid inputs: first_name, surname, date_of_birth.
     Valid output: username.
   Note: No marks awarded for actual names, dates or usernames (even if in correct format e.g.
   Joe Soap 26112003 and JoSoap2003)

         Each correct response (1 input and 1 output)               1 mark

(b)
      String slicing:
        o  Step 5 of the algorithm slices the first two characters of the first_name.
        o  Step 6 of the algorithm slices characters from positon 4 to 7 inclusive. Assuming
          ddmmyyyy format, this extracts the 4-digit year of birth from the date of birth.
      String concatenation:
        o  Step 7 of the algorithm concatenates the 2 characters from the first name
             followed by the surname followed by the 4 digit year of birth to determine the
            username.

     For each explanation:
          Very good explanation - clear understanding demonstrated        2 marks
            Fair explanation - limited understanding                        1 mark

# Source References

Exam paper:
- file: intermediate_markdown/exam_papers/higher/computer_science_higher_2023_section_a_b_exam.md
- pages: [10, 11]

Marking scheme:
- file: intermediate_markdown/marking_schemes/higher/computer_science_higher_2023_paper_1_marking_scheme.md
- pages: [10]

# Notes

