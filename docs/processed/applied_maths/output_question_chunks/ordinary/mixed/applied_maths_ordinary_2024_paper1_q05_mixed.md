---
subject: "Applied Maths"
subject_id: "applied_maths"
level: "Ordinary"
year: 2024
paper: "Paper 1"
question_number: 5
section: "Main Paper"
topic: "Mixed"
secondary_topics:
  - "Networks and Graphs"
  - "Kinematics"
classification_type: "mixed_topic"
source_type: "past_paper_with_marking_scheme"
has_visual: true
visual_assets:
  - "../../../image_assets/exam_papers/ordinary/applied_maths_ordinary_2024_paper_1_exam_page_018.png"
  - "../../../image_assets/exam_papers/ordinary/applied_maths_ordinary_2024_paper_1_exam_page_019.png"
  - "../../../image_assets/exam_papers/ordinary/applied_maths_ordinary_2024_paper_1_exam_page_020.png"
  - "../../../image_assets/exam_papers/ordinary/applied_maths_ordinary_2024_paper_1_exam_page_017.png"
source_exam_pages:
  - 17
  - 18
  - 19
  - 20
source_marking_scheme_pages:
  - 10
  - 11
pairing_confidence: "high"
topic_confidence: "medium"
classification_source: "fallback_rules"
manual_override_key: ""
candidate_topics:
  - "Networks and Graphs"
  - "Kinematics"
needs_review: false
review_reason: ""
---


# Question

Question 5
(a)  The adjacency matrix 𝑀 is given as
                               𝐴 𝐵  𝐶 𝐷
                          𝐴  0  2  0  1
                         𝐵  2  0  2  1                𝑀=  ൮       ൲
                           𝐶  0  2  0  1
                       𝐷  1  1  1  1

(i)   Draw a suitable graph to represent the adjacency matrix 𝑀.




                     𝐴                         𝐵





                   𝐷                           𝐶





(ii)   Another adjacency matrix 𝑁 is given as

                                       2                        𝑁 = ቀ0                                    3  1ቁ
      Calculate 𝑁ଶ and explain what the entries in the matrix 𝑁ଶ represent.





Leaving Certificate, 2024                      17
Applied Mathematics – Ordinary Level

<!-- PAGE 18 -->
# Page 18

![Page 18](../../../image_assets/exam_papers/ordinary/applied_maths_ordinary_2024_paper_1_exam_page_018.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; page contains vector drawings; text contains visual keywords: shown below, table; page image extracted because text may not fully capture visual content -->

(b)  Andrew is planning a three-week campervan
       trip around Connemara. He is looking to visit
     popular areas that have appropriate parking
      for his campervan.
    He will collect the campervan at location 𝐴 at
     the start of week one and return it to location
   𝐻 at the end of week three.
    He has the option of basing himself in location 𝐵, 𝐶 or 𝐷 for week one. For week two his
     options are 𝐸, 𝐹 or 𝐺. He will then need to return the campervan at location 𝐻 at the end
      of week three.


    Andrew draws the network shown below to help him design the best route.

                         𝐵                                         𝐸





                                                𝐻               𝐴           𝐶             𝐹




                        𝐷                                        𝐺

                    Week 1        Week 2       Week 3



     The table below gives the distances in km between each of the locations.

                Journey     Distance in km    Journey     Distance in km

            𝐴 to 𝐵         13        𝐶 to 𝐹         16
            𝐴 to 𝐶         12        𝐶 to 𝐺         13
            𝐴 to 𝐷         14       𝐷 to 𝐹         14
            𝐵 to 𝐸         16       𝐷 to 𝐺         13
            𝐵 to 𝐹         14        𝐸 to 𝐻         13
            𝐵 to 𝐺         11        𝐹 to 𝐻         16
             𝐶 to 𝐸         18        𝐺 to 𝐻         15





Leaving Certificate, 2024                      18
Applied Mathematics – Ordinary Level

<!-- PAGE 19 -->
# Page 19

![Page 19](../../../image_assets/exam_papers/ordinary/applied_maths_ordinary_2024_paper_1_exam_page_019.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; page image extracted because text may not fully capture visual content -->

Use Bellman’s Principle of Optimality to calculate the path from location 𝐴 to 𝐻 which
     minimises the distance Andrew needs to drive in the campervan.
     Relevant supporting work must be shown.





Leaving Certificate, 2024                      19
Applied Mathematics – Ordinary Level

<!-- PAGE 20 -->
# Page 20

![Page 20](../../../image_assets/exam_papers/ordinary/applied_maths_ordinary_2024_paper_1_exam_page_020.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; page contains vector drawings; text contains visual keywords: table; page image extracted because text may not fully capture visual content -->

# Marking Scheme

5(a)   (i)

    𝐴𝐴                                              𝐵𝐵





                                                            𝐶𝐶  𝐷𝐷
                                                                    15 [0/6/9/12]

5(a)   (ii)
ቀ6  2                                                                         5 3  7ቁ
the number of walks of length 2, between any pair of nodes                              5

5(b)
 Week 3                                                𝐸𝐸 − 𝐻𝐻                    13 ∗
                                                             𝐹𝐹 – 𝐻𝐻                    16 ∗

                                                            𝐺𝐺 – 𝐻𝐻                    15 ∗
 Week 2                                              𝐵𝐵 − 𝐸𝐸               16 + 13 = 29
                                                         𝐵𝐵 – 𝐹𝐹                14 + 16 = 30

                                                         𝐵𝐵 – 𝐺𝐺                11 + 15 = 26 ∗

                                                               𝐶𝐶 – 𝐸𝐸                18 + 13 = 31

                                                               𝐶𝐶 – 𝐹𝐹                16 + 16 = 32

                                                               𝐶𝐶 – 𝐺𝐺                13 + 15 = 28 ∗

                                                      𝐷𝐷 – 𝐺𝐺               13 + 15 = 28 ∗
 Week 1                                                𝐴𝐴 – 𝐵𝐵                13 + 26 = 39 ∗
                                                           𝐴𝐴 – 𝐶𝐶                12 + 28 = 40

                                                           𝐴𝐴 – 𝐷𝐷                14 + 28 = 42
𝐴𝐴 – 𝐵𝐵 – 𝐺𝐺 – 𝐻𝐻 , 39 km                                                25 [0/10/18/21]





Leaving Certificate, 2024                           8                                   Marking Scheme
Applied Mathematics – Ordinary Level

<!-- PAGE 11 -->
# Page 11

![Page 11](../../../image_assets/marking_schemes/ordinary/applied_maths_ordinary_2024_paper_1_marking_scheme_page_011.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; page contains vector drawings; page image extracted because text may not fully capture visual content -->

# Source References

Exam paper:
- file: intermediate_markdown/exam_papers/ordinary/applied_maths_ordinary_2024_paper_1_exam.md
- pages: [17, 18, 19, 20]

Marking scheme:
- file: intermediate_markdown/marking_schemes/ordinary/applied_maths_ordinary_2024_paper_1_marking_scheme.md
- pages: [10, 11]

# Notes

