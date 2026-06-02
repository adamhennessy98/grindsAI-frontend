---
subject: "Computer Science"
subject_id: "computer-science"
level: "Higher"
year: 2020
paper: "Section A B"
question_number: 15
section: "Question 11"
topic: "Computer Systems"
secondary_topics: []
classification_type: "topic_specific"
source_type: "past_paper_with_marking_scheme"
has_visual: true
visual_assets:
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2020_section_a_b_exam_page_010.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2020_section_a_b_exam_page_009.png"
source_exam_pages:
  - "9"
  - "10"
source_marking_scheme_pages:
  - "8"
pairing_confidence: "high"
topic_confidence: "medium"
classification_source: "fallback_rules"
candidate_topics:
  - "Computer Systems"
needs_review: false
review_reason: ""
---


# Question

Question 11

The intention of the JavaScript function below is to      Percentage Grade     Descriptor
return a student grade descriptor based on a                                              80 or over              Distinction
percentage grade as shown in the table to the right.
                                            From 40 to 79         Pass

                                                       Less than 40          Unsuccessful


 1  function getGradeDescription(percentageGrade) {
 2      let gradeDescription = "Unsuccessful";
 3
 4      if (percentageGrade >= 80)
 5          gradeDescription = "Distinction";
 6
 7      if (percentageGrade >= 40)
 8          gradeDescription = "Pass";
 9
 10     return gradeDescription;
 11
 12  }



The code runs without any syntax errors but it does not always return the correct grade
descriptor. Outline one way in which the function could be modified so that it works as intended.





Leaving Certificate 2020                       9
Computer Science, Sections A & B – Higher level

<!-- PAGE 10 -->
# Page 10

![Page 10](../../../image_assets/exam_papers/higher/computer_science_higher_2020_section_a_b_exam_page_010.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

# Marking Scheme

Question 11                                                        5 marks
   Change 2nd if to else
   Rearrange code with correct example.
    Similar suitable answer.

         Very good description - clear understanding demonstrated          5 marks
       Good description - clear information, lacking full understanding      3 marks
           Fair description - limited understanding                         1 mark

# Source References

Exam paper:
- file: intermediate_markdown/exam_papers/higher/computer_science_higher_2020_section_a_b_exam.md
- pages: [9, 10]

Marking scheme:
- file: intermediate_markdown/marking_schemes/higher/computer_science_higher_2020_paper_1_marking_scheme.md
- pages: [8]

# Notes

