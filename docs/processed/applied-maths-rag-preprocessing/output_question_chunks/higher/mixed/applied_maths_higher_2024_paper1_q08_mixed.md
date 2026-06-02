---
subject: "Applied Maths"
subject_id: "applied_maths"
level: "Higher"
year: 2024
paper: "Paper 1"
question_number: 8
section: "Main Paper"
topic: "Mixed"
secondary_topics:
  - "Networks and Graphs"
  - "Algorithms and Optimisation"
classification_type: "mixed_topic"
source_type: "past_paper_with_marking_scheme"
has_visual: true
visual_assets:
  - "../../../image_assets/exam_papers/higher/applied_maths_higher_2024_paper_1_exam_page_031.png"
  - "../../../image_assets/exam_papers/higher/applied_maths_higher_2024_paper_1_exam_page_032.png"
  - "../../../image_assets/exam_papers/higher/applied_maths_higher_2024_paper_1_exam_page_033.png"
  - "../../../image_assets/exam_papers/higher/applied_maths_higher_2024_paper_1_exam_page_034.png"
  - "../../../image_assets/exam_papers/higher/applied_maths_higher_2024_paper_1_exam_page_030.png"
source_exam_pages:
  - 30
  - 31
  - 32
  - 33
  - 34
source_marking_scheme_pages:
  - 13
  - 14
pairing_confidence: "high"
topic_confidence: "medium"
classification_source: "fallback_rules"
manual_override_key: ""
candidate_topics:
  - "Networks and Graphs"
  - "Algorithms and Optimisation"
needs_review: false
review_reason: ""
---


# Question

QuesƟon 8

(a)  A company director wishes to design a business plan to promote her brand over four years.
     Each year she chooses from a number of diﬀerent promoƟon strategies. She esƟmates the
     proﬁt (posiƟve value) or loss (negaƟve value) of each strategy (in €1000’s).

     She draws the network shown below to help design the most proﬁtable plan, where the
     edges represent the diﬀerent strategies and the nodes represent the possible states
      associated with the plan at a given point in Ɵme. 𝑋 and 𝑌 represent the start point and
     the end point of the plan respecƟvely.

                𝐴            𝐷             𝐺





  𝑋                                                                𝑌
               𝐵              𝐸            𝐻





                 𝐶              𝐹                       𝐼

            Year 1               Year 2               Year 3               Year 4

     The table below shows the esƟmated proﬁt (posiƟve value) and the esƟmated loss
     (negaƟve value) of each strategy.

        Strategy       Estimated profit/loss        Strategy       Estimated profit/loss
      𝑋 to 𝐴            െ11          𝐷 to 𝐺           െ5
      𝑋 to 𝐵            െ13          𝐷 to 𝐻           െ3
      𝑋 to 𝐶            െ9           𝐷 to 𝐼              3
      𝐴 to 𝐷              5             𝐸 to 𝐺            െ2
      𝐴 to 𝐸            െ2            𝐸 to 𝐻              5
      𝐴 to 𝐹            െ5            𝐸 to 𝐼              6
      𝐵 to 𝐷              7             𝐹 to 𝐺              4
      𝐵 to 𝐸            െ3            𝐹 to 𝐻              3
      𝐵 to 𝐹              4             𝐹 to 𝐼              2
       𝐶 to 𝐷              5            𝐺 to 𝑌              6
       𝐶 to 𝐸            െ4          𝐻 to 𝑌              5
       𝐶 to 𝐹            െ1                    𝐼 to 𝑌              7




Leaving Certificate, 2024                      30
Applied Mathematics – Higher Level

<!-- PAGE 31 -->
# Page 31

![Page 31](../../../image_assets/exam_papers/higher/applied_maths_higher_2024_paper_1_exam_page_031.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; page image extracted because text may not fully capture visual content -->

(i)   Use Bellman’s Principle of OpƟmality to calculate the business plan that maximises proﬁt.
     Relevant supporƟng work must be shown.





Leaving Certificate, 2024                      31
Applied Mathematics – Higher Level

<!-- PAGE 32 -->
# Page 32

![Page 32](../../../image_assets/exam_papers/higher/applied_maths_higher_2024_paper_1_exam_page_032.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; page image extracted because text may not fully capture visual content -->

(ii)   State one diﬀerence between Bellman’s Principle of OpƟmality and Dijkstra’s algorithm.





Leaving Certificate, 2024                      32
Applied Mathematics – Higher Level

<!-- PAGE 33 -->
# Page 33

![Page 33](../../../image_assets/exam_papers/higher/applied_maths_higher_2024_paper_1_exam_page_033.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; page image extracted because text may not fully capture visual content -->

(b)  The algebraic formula below is wriƩen in terms of force 𝐹, mass 𝑚, displacement 𝑠 and
     angular velocity 𝜔.

                              ඨ4𝐹𝑠
                              𝑚𝜔ଶ

     Use dimensional analysis to show that this formula has the same units as the units for
     displacement.





Leaving Certificate, 2024                      33
Applied Mathematics – Higher Level

<!-- PAGE 34 -->
# Page 34

![Page 34](../../../image_assets/exam_papers/higher/applied_maths_higher_2024_paper_1_exam_page_034.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; page contains vector drawings; page image extracted because text may not fully capture visual content -->

# Marking Scheme

8(a)   (i)
 Stage           State           Action          Destination     Value
 Year 4              𝐺𝐺                    𝐺𝐺𝐺𝐺                   𝑌𝑌           6 ∗
                    𝐻𝐻                   𝐻𝐻𝐻𝐻                   𝑌𝑌           5 ∗
                                       𝐼𝐼                           𝐼𝐼𝐼𝐼                    𝑌𝑌           7 ∗
 Year 3             𝐷𝐷                   𝐷𝐷𝐷𝐷                  𝐺𝐺          −5 + 6 = 1
                                        𝐷𝐷𝐷𝐷               𝐻𝐻          −3 + 5 = 2
                                                      𝐷𝐷𝐷𝐷                               𝐼𝐼            3 + 7 = 10 ∗
                        𝐸𝐸                    𝐸𝐸𝐸𝐸                  𝐺𝐺          −2 + 6 = 4
                                          𝐸𝐸𝐸𝐸               𝐻𝐻           5 + 5 = 10
                                                         𝐸𝐸𝐸𝐸                               𝐼𝐼            6 + 7 = 13 ∗
                        𝐹𝐹                    𝐹𝐹𝐹𝐹                  𝐺𝐺           4 + 6 = 10 ∗
                                           𝐹𝐹𝐹𝐹               𝐻𝐻           3 + 5 = 8
                                                          𝐹𝐹𝐹𝐹                               𝐼𝐼            2 + 7 = 9
 Year 2              𝐴𝐴                   𝐴𝐴𝐴𝐴                𝐷𝐷           5 + 10 = 15 ∗
                                              𝐴𝐴𝐴𝐴                  𝐸𝐸          −2 + 13 = 11
                                              𝐴𝐴𝐴𝐴                   𝐹𝐹          −5 + 10 = 5
                       𝐵𝐵                   𝐵𝐵𝐵𝐵                𝐷𝐷           7 + 10 = 17 ∗
                                             𝐵𝐵𝐵𝐵                  𝐸𝐸          −3 + 13 = 10
                                             𝐵𝐵𝐵𝐵                   𝐹𝐹           4 + 10 = 14
                         𝐶𝐶                    𝐶𝐶𝐶𝐶                𝐷𝐷           5 + 10 = 15 ∗
                                               𝐶𝐶𝐶𝐶                  𝐸𝐸          −4 + 13 = 9
                                                𝐶𝐶𝐶𝐶                   𝐹𝐹          −1 + 10 = 9
 Year 1              𝑋𝑋                    𝑋𝑋𝑋𝑋                  𝐴𝐴          −11 + 15 = 4
                                            𝑋𝑋𝑋𝑋                 𝐵𝐵          −13 + 17 = 4
                                              𝑋𝑋𝑋𝑋                   𝐶𝐶          −9 + 15 = 6 ∗
plan for maximum profit = 𝑋𝑋→𝐶𝐶→𝐷𝐷→𝐼𝐼→𝑌𝑌                         30 [0/8/16/24/27]

8(a)   (ii)
e.g. Bellman’s principle can be used to find the shortest or longest path, Dijkstra’s algorithm can
only be used to find the shortest path.                                                5

8(b)
replacement of physical quantities with correct units and simplification to m       15 [0/6/9/12]





Leaving Certificate, 2024                           11                                  Marking Scheme
Applied Mathematics – Higher Level

<!-- PAGE 14 -->
# Page 14

![Page 14](../../../image_assets/marking_schemes/higher/applied_maths_higher_2024_paper_1_marking_scheme_page_014.png)

# Source References

Exam paper:
- file: intermediate_markdown/exam_papers/higher/applied_maths_higher_2024_paper_1_exam.md
- pages: [30, 31, 32, 33, 34]

Marking scheme:
- file: intermediate_markdown/marking_schemes/higher/applied_maths_higher_2024_paper_1_marking_scheme.md
- pages: [13, 14]

# Notes

