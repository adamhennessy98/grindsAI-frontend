---
subject: "Computer Science"
subject_id: "computer-science"
level: "Higher"
year: 2021
paper: "Section A B"
question_number: 10
section: "Question 6"
topic: "Computer Systems"
secondary_topics: []
classification_type: "topic_specific"
source_type: "past_paper_with_marking_scheme"
has_visual: true
visual_assets:
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2021_section_a_b_exam_page_008.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2021_section_a_b_exam_page_007.png"
source_exam_pages:
  - "7"
  - "8"
source_marking_scheme_pages:
  - "7"
pairing_confidence: "high"
topic_confidence: "medium"
classification_source: "fallback_rules"
candidate_topics:
  - "Computer Systems"
needs_review: false
review_reason: ""
---


# Question

Question 6

You have been asked to assess an algorithm for a travel agent. The company gives discounts based
on the number of people in a group.

The Python code below determines the type of discount to give based on the number of adults
(num_adults) and the number of children (num_children) in a travelling group.
 1  num_adults = int(input("Enter the number of adults: "))
 2  num_children = int(input("Enter the number of children: "))
 3
 4  if num_adults > 1 and num_children > 0:
 5      print("Family discount")
 6  elif num_adults >= 10:
 7      print("Large group discount")
 8  elif num_adults >= 5:
 9      print("Small group discount")
 10 else:
 11     print("No discount")


Describe two scenarios where the algorithm could be perceived to be unfair.


  Scenario 1:





 Scenario 2:





Leaving Certificate 2021                       7
Computer Science, Sections A & B – Higher level

<!-- PAGE 8 -->
# Page 8

![Page 8](../../../image_assets/exam_papers/higher/computer_science_higher_2021_section_a_b_exam_page_008.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; page contains vector drawings; text contains visual keywords -->

# Marking Scheme

Question 6                                                             5 marks

   •  Family discount should be allowed for situations where only 1 parent (adult) is travelling
      with a child. Could be perceived to discriminate against single-parent families.
   •  You could have any number of children travelling and only a single adult and get no
       discount.
   •    If num_adults >= 10 and num_children > 0 (could be 99 children) the discount is family -
      should be large group discount (as opposed to family discount).
   •  Children don't contribute to large or small group discounts.
   •  Any valid scenario.

     Scenario 1 (best scenario). Good description – clear understanding       3 mark
     Scenario 2 (2nd best scenario). Good description – clear understanding     2 marks

# Source References

Exam paper:
- file: intermediate_markdown/exam_papers/higher/computer_science_higher_2021_section_a_b_exam.md
- pages: [7, 8]

Marking scheme:
- file: intermediate_markdown/marking_schemes/higher/computer_science_higher_2021_paper_1_marking_scheme.md
- pages: [7]

# Notes

