---
subject: "Computer Science"
subject_id: "computer-science"
level: "Higher"
year: 2021
paper: "Section A B"
question_number: 8
section: "Question 4"
topic: "Computer Systems"
secondary_topics: []
classification_type: "topic_specific"
source_type: "past_paper_with_marking_scheme"
has_visual: true
visual_assets:
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2021_section_a_b_exam_page_006.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2021_section_a_b_exam_page_005.png"
source_exam_pages:
  - "5"
  - "6"
source_marking_scheme_pages:
  - "5"
  - "6"
pairing_confidence: "high"
topic_confidence: "medium"
classification_source: "fallback_rules"
candidate_topics:
  - "Computer Systems"
needs_review: false
review_reason: ""
---


# Question

Question 4

You are asked to swap the values of two variables, x and y, which have already been initialised.

(a)  Why does the method shown not work?


                                 x = y

                                 y = x





(b)   Describe a method that does work.





Leaving Certificate 2021                       5
Computer Science, Sections A & B – Higher level

<!-- PAGE 6 -->
# Page 6

![Page 6](../../../image_assets/exam_papers/higher/computer_science_higher_2021_section_a_b_exam_page_006.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; page contains vector drawings; text contains visual keywords -->

# Marking Scheme

Question 4                                                             2+3 marks
(a)
        •  The method does not work because the contents of x are overwritten (lost) after
            the first assignment.
        •  A temporary variable is needed.

           Good description - clear information          2 marks





                                       5

<!-- PAGE 6 -->
# Page 6

![Page 6](../../../image_assets/marking_schemes/higher/computer_science_higher_2021_paper_1_marking_scheme_page_006.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(b)
        •  Use a temporary variable
           temp = x
              x = y
             y = temp
        •   or, use Python’s canonical swap
                 x, y = y, x
        •   or, use addition/subtraction operators
              x = x + y
             y = x - y
              x = x - y
        •   or, use multiplication/division operators
              x = x * y
             y = x / y
              x = x / y
        •  or any other valid solution

     Very good description - clear understanding demonstrated         3 marks
      Fair description - limited understanding                        1 mark

# Source References

Exam paper:
- file: intermediate_markdown/exam_papers/higher/computer_science_higher_2021_section_a_b_exam.md
- pages: [5, 6]

Marking scheme:
- file: intermediate_markdown/marking_schemes/higher/computer_science_higher_2021_paper_1_marking_scheme.md
- pages: [5, 6]

# Notes

