---
subject: "Applied Maths"
subject_id: "applied_maths"
level: "Ordinary"
year: 2025
paper: "Paper 1"
question_number: 4
section: "Main Paper"
topic: "Mixed"
secondary_topics:
  - "Networks and Graphs"
  - "Algorithms and Optimisation"
classification_type: "mixed_topic"
source_type: "past_paper_with_marking_scheme"
has_visual: true
visual_assets:
  - "../../../image_assets/exam_papers/ordinary/applied_maths_ordinary_2025_paper_1_exam_page_015.png"
  - "../../../image_assets/exam_papers/ordinary/applied_maths_ordinary_2025_paper_1_exam_page_016.png"
  - "../../../image_assets/exam_papers/ordinary/applied_maths_ordinary_2025_paper_1_exam_page_017.png"
  - "../../../image_assets/exam_papers/ordinary/applied_maths_ordinary_2025_paper_1_exam_page_018.png"
  - "../../../image_assets/exam_papers/ordinary/applied_maths_ordinary_2025_paper_1_exam_page_014.png"
source_exam_pages:
  - 14
  - 15
  - 16
  - 17
  - 18
source_marking_scheme_pages:
  - 8
  - 9
  - 10
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

Question 4

The diagram below shows a network of hiking trails. The weight of each edge represents the
length in km of that part of the trail.

               𝐵          34            𝐺

                       26         13

            17              𝐸                       5

                                     12                      19
               𝐷             26                                               𝐼      12      𝐴                       10
                                                                                              𝐽
                         16          14

                                               17
         13                 𝐹                5
                     15                 19              9


             𝐶              35            𝐻

(i)    Explain what is meant by a path in the context of networks.





(ii)   Explain what is meant by a cycle in the context of networks.





Leaving Certificate, 2025                    14
Applied Mathematics – Ordinary Level

<!-- PAGE 15 -->
# Page 15

![Page 15](../../../image_assets/exam_papers/ordinary/applied_maths_ordinary_2025_paper_1_exam_page_015.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; page image extracted because text may not fully capture visual content -->

Pádraig wishes to travel from 𝐴 to 𝐽 using the shortest path.

(iii)  Describe Dijkstra’s algorithm for finding the shortest path between two nodes in a network.





(iv)  Use Dijkstra’s algorithm to find the shortest path from 𝐴 to 𝐽. Write down the shortest path.
      Calculate the length of the shortest path.





Leaving Certificate, 2025                    15
Applied Mathematics – Ordinary Level

<!-- PAGE 16 -->
# Page 16

![Page 16](../../../image_assets/exam_papers/ordinary/applied_maths_ordinary_2025_paper_1_exam_page_016.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; page image extracted because text may not fully capture visual content -->

(v)   Explain what is meant by the minimum spanning tree for a network.





(vi)  Using Prim’s algorithm, find the minimum spanning tree for this network.
     Relevant supporting work must be shown.

               𝐵          34            𝐺

                       26         13

            17              𝐸                       5

                                     12                      19
               𝐷             26                                               𝐼      12      𝐴                       10
                                                                                              𝐽
                         16          14

                                               17
         13                 𝐹                5
                     15                 19              9


             𝐶              35            𝐻





Leaving Certificate, 2025                    16
Applied Mathematics – Ordinary Level

<!-- PAGE 17 -->
# Page 17

![Page 17](../../../image_assets/exam_papers/ordinary/applied_maths_ordinary_2025_paper_1_exam_page_017.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; text extraction is sparse relative to visible page content; page image extracted because text may not fully capture visual content -->

Leaving Certificate, 2025                    17
Applied Mathematics – Ordinary Level

<!-- PAGE 18 -->
# Page 18

![Page 18](../../../image_assets/exam_papers/ordinary/applied_maths_ordinary_2025_paper_1_exam_page_018.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; text contains visual keywords: table; page image extracted because text may not fully capture visual content -->

# Marking Scheme

4i

A path is a sequence of edges which joins a sequence of nodes.                            5


4ii

A cycle is a path in which only the first and last nodes are equal.                           5


4iii

1.   Write down the weight (length) from the first node to each neighbouring node.

2.    For the node with the smallest value, write down the total weight for each node connected
     to it that has not already been visited.

3.   Repeat step 2 until every node has been visited.                                   5


4iv
𝐴: 𝐵ሺ17ሻ, 𝐶ሺ13ሻ, 𝐷ሺ26ሻ
𝐶: 𝐷ሺ18ሻ, 𝐹ሺ28ሻ, 𝐻ሺ48ሻ
𝐵: 𝐸ሺ43ሻ, 𝐺ሺ51ሻ
𝐷: 𝐸ሺ37ሻ, 𝐹ሺ34ሻ
𝐹: 𝐸ሺ38ሻ, 𝐻ሺ47ሻ, 𝐼ሺ42ሻ
𝐸: 𝐺ሺ50ሻ, 𝐼ሺ49ሻ
𝐼: 𝐻ሺ59ሻ, 𝐽ሺ54ሻ
𝐻: 𝐽ሺ56ሻ
𝐺: 𝐽ሺ55ሻ
Path ൌ𝐴→𝐶→𝐹→𝐼→𝐽      Length ൌ54 km                             15 [0/6/12]


4v

The minimum spanning tree for a network is the subset of edges of least total weight that
connects each node to every other node on the network.                                 5





Leaving Certificate, 2025                       6                                   Marking Scheme
Applied Mathematics – M31 2025

<!-- PAGE 9 -->
# Page 9

![Page 9](../../../image_assets/marking_schemes/ordinary/applied_maths_ordinary_2025_paper_1_marking_scheme_page_009.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; page image extracted because text may not fully capture visual content -->

4vi
Choose node 𝐴, say.
                         𝐵                   𝐺|𝐴𝐶| ൌ13
|𝐶𝐷| ൌ5
                         17           𝐸                    5|𝐶𝐹| ൌ15
|𝐹𝐸| ൌ10                                       12
                         𝐷                                 𝐼|𝐸𝐼| ൌ12                 𝐴                    10                  12                                                                                                      𝐽
|𝐼𝐽| ൌ12
|𝐽𝐺| ൌ5
|𝐽𝐻| ൌ9               13    5          𝐹
                                 15                                                             9|𝐴𝐵| ൌ17


                        𝐶                    𝐻

                                                                      15 [0/6/12]





Leaving Certificate, 2025                       7                                   Marking Scheme
Applied Mathematics – M31 2025

<!-- PAGE 10 -->
# Page 10

![Page 10](../../../image_assets/marking_schemes/ordinary/applied_maths_ordinary_2025_paper_1_marking_scheme_page_010.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; page image extracted because text may not fully capture visual content -->

# Source References

Exam paper:
- file: intermediate_markdown/exam_papers/ordinary/applied_maths_ordinary_2025_paper_1_exam.md
- pages: [14, 15, 16, 17, 18]

Marking scheme:
- file: intermediate_markdown/marking_schemes/ordinary/applied_maths_ordinary_2025_paper_1_marking_scheme.md
- pages: [8, 9, 10]

# Notes

