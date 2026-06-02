---
subject: "Computer Science"
subject_id: "computer-science"
level: "Higher"
year: 2023
paper: "Section A B"
question_number: 13
section: "Question 9"
topic: "Computer Systems"
secondary_topics: []
classification_type: "topic_specific"
source_type: "past_paper_with_marking_scheme"
has_visual: true
visual_assets:
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2023_section_a_b_exam_page_009.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2023_section_a_b_exam_page_008.png"
source_exam_pages:
  - "8"
  - "9"
source_marking_scheme_pages:
  - "9"
pairing_confidence: "high"
topic_confidence: "medium"
classification_source: "fallback_rules"
candidate_topics:
  - "Computer Systems"
needs_review: false
review_reason: ""
---


# Question

Question 9

Chop Cup is a magic routine which involves three cups face down and one ball underneath one of
the cups. In any single move the position of two cups can be swapped using one of three possible
moves, A, B or C as shown in Figure 4 below.





                                            Figure 4

Each cup is identified by its position. Initially the leftmost cup is at position 1, the middle cup is at
position 2 and the right cup is at position 3.


(a)   Given that the ball starts under the leftmost cup (position 1) and always remains under the
    same cup, state the ball position after the sequence of moves, ABCBCA.





(b)   Without knowing which cup the ball is under, construct a sequence involving at least three
    moves which results in the ball ending in the same position as it started from.





Leaving Certificate 2023                       8
Computer Science, Sections A & B – Higher level

<!-- PAGE 9 -->
# Page 9

![Page 9](../../../image_assets/exam_papers/higher/computer_science_higher_2023_section_a_b_exam_page_009.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; text contains visual keywords -->

# Marking Scheme

Question 9                                                          4+2 marks
(a)

                      Cups                              Ball Position
                              Move
                    (before move)                         (after move)
                               ['Ball', 0, 0]       A               2
                           [0, 'Ball', 0]        B               2
                           [0, 'Ball', 0]         C               3
                           [0, 0, 'Ball']        B               1
                               ['Ball', 0, 0]         C               1
                               ['Ball', 0, 0]       A               2

       Answer: The ball position after ABCBCA is 2 (i.e. under the middle cup).

                  Correct                    4 marks
                   Half correct                 2 marks
                Response with some merit     1 mark

(b)

     The complete list of 4 move sequences that work is: ['AAAA', 'AABB', 'AACC', 'ABAC',
       'ABBA', 'ABCB', 'ACAB', 'ACBC', 'ACCA', 'BAAB', 'BABC', 'BACA', 'BBAA', 'BBBB', 'BBCC',
       'BCAC', 'BCBA', 'BCCB', 'CAAC', 'CABA', 'CACB', 'CBAB', 'CBBC', 'CBCA', 'CCAA', 'CCBB',
       'CCCC']
      Any ‘same move’ completed an even number of times (>= 4) e.g. AAAA, BBBBBB
      Any palindromic sequence of moves e.g. ABBA, ABCCBA
     Any other correct response
   Note: Odd length sequences will not work

     Correct response                 2 marks

# Source References

Exam paper:
- file: intermediate_markdown/exam_papers/higher/computer_science_higher_2023_section_a_b_exam.md
- pages: [8, 9]

Marking scheme:
- file: intermediate_markdown/marking_schemes/higher/computer_science_higher_2023_paper_1_marking_scheme.md
- pages: [9]

# Notes

