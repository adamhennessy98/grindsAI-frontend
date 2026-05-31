---
subject: "Computer Science"
subject_id: "computer-science"
level: "Higher"
year: 2025
paper: "Section A B"
question_number: 11
section: "Question 7"
topic: "Unclassified"
secondary_topics: []
classification_type: "unclassified"
source_type: "past_paper_with_marking_scheme"
has_visual: true
visual_assets:
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2025_section_a_b_exam_page_006.png"
source_exam_pages:
  - 6
source_marking_scheme_pages:
  - 7
pairing_confidence: "high"
needs_review: false
review_reason: ""
---

# Question

Question 7

A binary question is a question that has two possible answers – yes or no. The diagrams, in Figure
1 and Figure 2 below, describe how binary questions can be chained together to determine the
outcome of tossing a six-sided dice. Two different search algorithms are illustrated.





    Figure 1: Algorithm 1 (tree depth = 5)        Figure 2: Algorithm 2 (tree depth = 3)

(a)   State the name of each search algorithm.

  Algorithm 1:

  Algorithm 2:


(b)   Suggest which of the two algorithms is most efficient. Justify your answer.

 Most efficient:

  Justify:

# Marking Scheme

Question 7                                                                            6(2,4) marks

(a)
          Algorithm 1: Linear search
          Algorithm 2: Binary search

                           Each correct response:     1 mark

(b)
       Linear search may be more efficient as there is no sort overhead.
         Also, target item will sometimes be the first item (or one of the first items) in the list.
         For relatively small lists this can be more efficient than a binary search.
    OR
        In general, binary search is more efficient as at worst it just requires log(n) operations
         to complete its task. Linear search on the other hand requires O(n) operations.


     Very good justification - clear understanding demonstrated    4 marks
      Fair justification – limited understanding                   2 mark

# Source References

Exam paper:
- file: intermediate_markdown/exam_papers/higher/computer_science_higher_2025_section_a_b_exam.md
- pages: [6]

Marking scheme:
- file: intermediate_markdown/marking_schemes/higher/computer_science_higher_2025_paper_1_marking_scheme.md
- pages: [7]

# Notes

