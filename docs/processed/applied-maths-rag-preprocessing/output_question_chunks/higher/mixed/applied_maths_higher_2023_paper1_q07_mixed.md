---
subject: "Applied Maths"
subject_id: "applied_maths"
level: "Higher"
year: 2023
paper: "Paper 1"
question_number: 7
section: "Main Paper"
topic: "Mixed"
secondary_topics:
  - "Networks and Graphs"
  - "Algorithms and Optimisation"
  - "Differential Equations and Rates of Change"
classification_type: "mixed_topic"
source_type: "past_paper_with_marking_scheme"
has_visual: true
visual_assets:
  - "../../../image_assets/exam_papers/higher/applied_maths_higher_2023_paper_1_exam_page_027.png"
  - "../../../image_assets/exam_papers/higher/applied_maths_higher_2023_paper_1_exam_page_028.png"
  - "../../../image_assets/exam_papers/higher/applied_maths_higher_2023_paper_1_exam_page_029.png"
  - "../../../image_assets/exam_papers/higher/applied_maths_higher_2023_paper_1_exam_page_030.png"
  - "../../../image_assets/exam_papers/higher/applied_maths_higher_2023_paper_1_exam_page_026.png"
source_exam_pages:
  - 26
  - 27
  - 28
  - 29
  - 30
source_marking_scheme_pages:
  - 12
  - 13
  - 14
pairing_confidence: "high"
topic_confidence: "medium"
classification_source: "fallback_rules"
manual_override_key: ""
candidate_topics:
  - "Networks and Graphs"
  - "Algorithms and Optimisation"
  - "Differential Equations and Rates of Change"
needs_review: false
review_reason: ""
---


# Question

Question 7
(a)   There are 12 waterfalls in a certain national park. Paths allow visitors to walk from one
      waterfall to another. In the network shown below, the edges represent the paths and the
     nodes represent the waterfalls, labelled with the letters 𝐴 to 𝐿. The weight of each edge
     represents the time (in minutes) taken to walk between a pair of waterfalls.

               𝐵                          16       𝐸                                          11
                                             𝐺     15      𝐿

          17
                       19                                         9                               9    11    14                                                   12
  𝐴                                                      21       𝐾              22
                                           6
                                                                         𝐽                          𝐻
                         𝐶                                      10
         11                             4               8                     7                                10
                                                                                              𝐼
                                                    13
             𝐷           18           𝐹

     The park authorities wish to plan a route along the paths which allows visitors to see every
      waterfall while moving through the park without wasting time. The paths that are not on
      this route will be closed.

(i)   Using an appropriate algorithm, find the minimum spanning tree for the network.
    Name the algorithm you used. Relevant supporting work must be shown.





Leaving Certificate, 2023                      26
Applied Mathematics – Higher Level

<!-- PAGE 27 -->
# Page 27

![Page 27](../../../image_assets/exam_papers/higher/applied_maths_higher_2023_paper_1_exam_page_027.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; page image extracted because text may not fully capture visual content -->

(ii)  The park entrance is at waterfall 𝐴 and the park exit is at waterfall 𝐿. Using your minimum
     spanning tree, calculate the time needed to enter the park at waterfall 𝐴, visit every
      waterfall, and leave the park at waterfall 𝐿.





Leaving Certificate, 2023                      27
Applied Mathematics – Higher Level

<!-- PAGE 28 -->
# Page 28

![Page 28](../../../image_assets/exam_papers/higher/applied_maths_higher_2023_paper_1_exam_page_028.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; text contains visual keywords: curve, graph; page image extracted because text may not fully capture visual content -->

(b)  A learning curve is a graphical representation of how a person’s ability to perform a certain
      task increases with the time the person spends learning or practicing that task.
    A student wishes to be able to spell 2000 difficult words. The rate of the student’s learning
    may be modelled by the differential equation:
                          𝑑𝑁
                           𝑑𝑡ൌ𝑘ሺ2000 െ𝑁ሻ
     where 𝑁ሺ𝑡ሻ is number of these words the student is able to spell after 𝑡 hours of learning,
     and where 𝑘 is a positive constant.
     At the start of their learning the student is already able to spell 250 of these words,
        i.e. 𝑁ሺ0ሻൌ250.
(i)   Solve the differential equation to find an expression for 𝑁 in terms of 𝑘 and 𝑡.





Leaving Certificate, 2023                      28
Applied Mathematics – Higher Level

<!-- PAGE 29 -->
# Page 29

![Page 29](../../../image_assets/exam_papers/higher/applied_maths_higher_2023_paper_1_exam_page_029.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; text contains visual keywords: curve, graph; page image extracted because text may not fully capture visual content -->

(ii)   After 6 hours of learning, the student is able to spell 1500 of these words. Calculate 𝑘.





(iii)  Sketch the shape of a graph of 𝑁 against 𝑡 to show the model’s prediction for the student’s
      learning curve.
      2400

      2000

      1600
    (words)      1200
𝑵

     800


     400



                5         10        15        20        25        30
                                             𝒕 (hours)





Leaving Certificate, 2023                      29
Applied Mathematics – Higher Level

<!-- PAGE 30 -->
# Page 30

![Page 30](../../../image_assets/exam_papers/higher/applied_maths_higher_2023_paper_1_exam_page_030.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; page image extracted because text may not fully capture visual content -->

# Marking Scheme

7(a)   (i)
Kruskal’s algorithm                             Prim’s algorithm
|𝐹𝐹𝐹𝐹| = 4                                Choose node 𝐴𝐴, say.
|𝐻𝐻𝐻𝐻| = 6                                                  |𝐴𝐴𝐴𝐴| = 11
|𝐶𝐶𝐶𝐶| = 7                                                  |𝐶𝐶𝐶𝐶| = 7
|𝐼𝐼𝐼𝐼| = 8                                                     |𝐶𝐶𝐶𝐶| = 9
|𝐶𝐶𝐶𝐶| = 9                                                    |𝐶𝐶𝐶𝐶| = 10
|𝐾𝐾𝐾𝐾| = 9                                                 |𝐹𝐹𝐹𝐹| = 4
|𝐶𝐶𝐶𝐶| = 10                                                      |𝐻𝐻𝐻𝐻| = 6
|𝐼𝐼𝐼𝐼| = 10                                                                    |𝐼𝐼𝐼𝐼| = 8
|𝐴𝐴𝐴𝐴| = 11                                                      |𝐼𝐼𝐼𝐼| = 10
|𝐸𝐸𝐸𝐸| = 11                                                  |𝐿𝐿𝐿𝐿| = 9
|𝐸𝐸𝐸𝐸| = 11                                                 |𝐸𝐸𝐸𝐸| = 11
|𝐺𝐺𝐺𝐺| = 12                                                 |𝐵𝐵𝐵𝐵| = 16
|𝐹𝐹𝐹𝐹| = 13
|𝐻𝐻𝐻𝐻| = 14
|𝐵𝐵𝐵𝐵| = 16                                                           15 [0/6/9/12]
                                Deduct 3 marks if the algorithm used is not correctly named.
                 Allow 3 marks for the name of a correct algorithm if no other work is presented.

                             𝐵𝐵                         16              𝐸𝐸                                         11
                                                                                        𝐺𝐺                          𝐿𝐿


                                                                  9                              9

  𝐴𝐴                                                                                                        𝐾𝐾
                                          6
                                                                                                                                              𝐽𝐽                                                   𝐻𝐻
                                                𝐶𝐶                                      10
                                                      8        11                             4
                    7          10
                                                                                                                                                                                          𝐼𝐼

                        𝐷𝐷                                             𝐹𝐹


7(a)   (ii)
11 + 7 + 2(9 + 11 + 16) + 10 + 4 + 6 + 8 + 10 + 9 = 137 minutes                      5





Leaving Certificate, 2023                      12                                  Marking Scheme
Applied Mathematics – Higher Level

<!-- PAGE 13 -->
# Page 13

![Page 13](../../../image_assets/marking_schemes/higher/applied_maths_higher_2023_paper_1_marking_scheme_page_013.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; page contains vector drawings; page image extracted because text may not fully capture visual content -->

7(b)  (i)

𝑑𝑑𝑑𝑑                                        𝑑𝑑𝑑𝑑
𝑑𝑑𝑑𝑑= 𝑘𝑘(2000 −𝑁𝑁) so                ∫ 2000−𝑁𝑁= ∫𝑘𝑘𝑘𝑘𝑘𝑘                                              5

     1
ln 2000−𝑁𝑁= 𝑘𝑘𝑘𝑘+ 𝑐𝑐                                                                                  5, 5

                                 1
𝑁𝑁= 250 when 𝑡𝑡= 0 so 𝑐𝑐= ln                               1750

 1750         𝑒𝑒𝑘𝑘𝑘𝑘 so 𝑁𝑁= 2000 −1750𝑒𝑒−𝑘𝑘𝑘𝑘                                              52000−𝑁𝑁=

7(b)  (ii)

                                                                         ln3.5
𝑁𝑁= 1500 when 𝑡𝑡= 6 so 1500 = 2000 −1750𝑒𝑒−6𝑘𝑘, i.e. 𝑘𝑘=    ≅0.209 hour–1           5                                                                6

7(b)   (iii)

        2400

        2000

        1600
 (words)        1200
 𝑵𝑵

      800


      400




                5         10        15        20        25        30
                                                                                          𝒕𝒕 (hours)
                                                                              5




Leaving Certificate, 2023                      13                                  Marking Scheme
Applied Mathematics – Higher Level

<!-- PAGE 14 -->
# Page 14

![Page 14](../../../image_assets/marking_schemes/higher/applied_maths_higher_2023_paper_1_marking_scheme_page_014.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; page image extracted because text may not fully capture visual content -->

# Source References

Exam paper:
- file: intermediate_markdown/exam_papers/higher/applied_maths_higher_2023_paper_1_exam.md
- pages: [26, 27, 28, 29, 30]

Marking scheme:
- file: intermediate_markdown/marking_schemes/higher/applied_maths_higher_2023_paper_1_marking_scheme.md
- pages: [12, 13, 14]

# Notes

