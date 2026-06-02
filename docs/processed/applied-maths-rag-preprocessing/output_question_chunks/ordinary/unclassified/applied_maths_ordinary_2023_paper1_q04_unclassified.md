---
subject: "Applied Maths"
subject_id: "applied_maths"
level: "Ordinary"
year: 2023
paper: "Paper 1"
question_number: 4
section: "Main Paper"
topic: "Unclassified"
secondary_topics: []
classification_type: "unclassified"
source_type: "past_paper_with_marking_scheme"
has_visual: true
visual_assets:
  - "../../../image_assets/exam_papers/ordinary/applied_maths_ordinary_2023_paper_1_exam_page_015.png"
  - "../../../image_assets/exam_papers/ordinary/applied_maths_ordinary_2023_paper_1_exam_page_016.png"
  - "../../../image_assets/exam_papers/ordinary/applied_maths_ordinary_2023_paper_1_exam_page_017.png"
  - "../../../image_assets/exam_papers/ordinary/applied_maths_ordinary_2023_paper_1_exam_page_018.png"
  - "../../../image_assets/exam_papers/ordinary/applied_maths_ordinary_2023_paper_1_exam_page_014.png"
source_exam_pages:
  - 14
  - 15
  - 16
  - 17
  - 18
source_marking_scheme_pages:
  - 10
  - 11
pairing_confidence: "high"
needs_review: false
review_reason: ""
---

# Question

Question 4

(a)   In an effort to become more energy efficient, a university
     campus invests in upgrading its current heating system.
     Each of the five buildings (Arts, Business, Cafeteria,
      Design, Engineering) that are on the campus will require
     connection to this new heating system.

    An engineer measures the underground distance, in m,
     between each of the buildings on the campus grounds.
     She presents her results in the table below.

       Distance (m)       Arts         Business       Cafeteria       Design      Engineering

           Arts          –         300        650        525        190

         Business       300          –         475        790        210

         Cafeteria       650        475          –         425        145

         Design       525        790        425          –         505

       Engineering      190        210        145        505          –

(i)   Draw a network to represent this information. On your network the weights of the edges
     should represent the distances between each of the buildings, which should be represented
     by labelled nodes.





Leaving Certificate, 2023                      14
Applied Mathematics – Ordinary Level

<!-- PAGE 15 -->
# Page 15

![Page 15](../../../image_assets/exam_papers/ordinary/applied_maths_ordinary_2023_paper_1_exam_page_015.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; page image extracted because text may not fully capture visual content -->

To help reduce costs, the engineer must minimise the length of pipework needed for this
     heating system.

(ii)   Using an appropriate algorithm, find the minimum spanning tree for this network. Name the
     algorithm you used. Relevant supporting work must be shown.





     The pipes used are priced at €525 per metre. In addition, there is an installation cost of
    €6500 when any two buildings are connected by pipework.

(iii)  Use your minimum spanning tree to calculate the total cost of this project.





Leaving Certificate, 2023                      15
Applied Mathematics – Ordinary Level

<!-- PAGE 16 -->
# Page 16

![Page 16](../../../image_assets/exam_papers/ordinary/applied_maths_ordinary_2023_paper_1_exam_page_016.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; page contains vector drawings; page image extracted because text may not fully capture visual content -->

(b)  Mark is planning to visit South America. He plans to begin
      his visit in city 𝐴, and then travel across South America to
    meet some friends in city 𝐼.

    Mark wishes to keep his travel costs to a minimum.
    He wishes to calculate the cost of travelling to city 𝐼 by bus,
      travelling via some of the other cities, 𝐵 to 𝐻.
     The cost, in €, of travelling by bus between various cities is
    shown in the network below. Mark does not intend on
       visiting all of the cities in his network.


                            87       𝐺                 𝐶

             105        49
                                                 188
                 84      𝐷       𝐴
                               135
                  60                           111                      𝐼         75                        𝐹

                              50          𝐵                                                   48
                 99
                      𝐸      122     𝐻

     Use Dijkstra’s algorithm to find the cheapest bus route from city 𝐴 to city 𝐼.
      Calculate the cost of the cheapest route. Relevant supporting work must be shown.





Leaving Certificate, 2023                      16
Applied Mathematics – Ordinary Level

<!-- PAGE 17 -->
# Page 17

![Page 17](../../../image_assets/exam_papers/ordinary/applied_maths_ordinary_2023_paper_1_exam_page_017.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; text extraction is sparse relative to visible page content; page image extracted because text may not fully capture visual content -->

Leaving Certificate, 2023                      17
Applied Mathematics – Ordinary Level

<!-- PAGE 18 -->
# Page 18

![Page 18](../../../image_assets/exam_papers/ordinary/applied_maths_ordinary_2023_paper_1_exam_page_018.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; page image extracted because text may not fully capture visual content -->

# Marking Scheme

4(a)   (i)

     𝐴𝐴       300             𝐵𝐵

            650
                          475
          210
 190
                  790            525                                𝐶𝐶
                   145
     𝐸𝐸                   425
        505
                          𝐷𝐷
                                                                             10
                                 –1 for each incorrect/missing/mislabelled/additional edge

4(a)   (ii)
Kruskal’s algorithm    Prim’s algorithm                   𝐴𝐴                              𝐵𝐵
|𝐶𝐶𝐶𝐶| = 145         Choose node 𝐴𝐴, say.

|𝐴𝐴𝐴𝐴| = 190              |𝐴𝐴𝐴𝐴| = 190                      210
                                       190
|𝐵𝐵𝐵𝐵| = 210              |𝐶𝐶𝐶𝐶| = 145
                                                                                                                                 𝐶𝐶
|𝐴𝐴𝐴𝐴| = 300              |𝐵𝐵𝐵𝐵| = 210
                                                         145
|𝐶𝐶𝐶𝐶| = 425              |𝐶𝐶𝐶𝐶| = 425                         𝐸𝐸                   425
                                                                                     𝐷𝐷
                                                                    15 [0/6/9/12]
                                Deduct 3 marks if the algorithm used is not correctly named.
                 Allow 3 marks for the name of a correct algorithm if no other work is presented.

4(a)   (iii)
4(6500) + (145 + 190 + 210 + 425)(525) = €535 250                               5

4(b)

𝐴𝐴: 𝐵𝐵(75), 𝐶𝐶(105), 𝐷𝐷(84)

𝐵𝐵: 𝐷𝐷(135), 𝐸𝐸(174)

𝐷𝐷: 𝐶𝐶(133), 𝐹𝐹(219)

𝐶𝐶: 𝐺𝐺(192)

𝐸𝐸: 𝐹𝐹(224), 𝐻𝐻(296)

𝐺𝐺: 𝐼𝐼(380)

𝐹𝐹: 𝐼𝐼(330)

𝐻𝐻: 𝐼𝐼(344)

Path = 𝐴𝐴→𝐷𝐷→𝐹𝐹→𝐼𝐼                          Cost = €330
                                                                   20 [0/8/14/17]

Leaving Certificate, 2023                      10                                  Marking Scheme
Applied Mathematics – Ordinary Level

<!-- PAGE 11 -->
# Page 11

![Page 11](../../../image_assets/marking_schemes/ordinary/applied_maths_ordinary_2023_paper_1_marking_scheme_page_011.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; page contains vector drawings; page image extracted because text may not fully capture visual content -->

# Source References

Exam paper:
- file: intermediate_markdown/exam_papers/ordinary/applied_maths_ordinary_2023_paper_1_exam.md
- pages: [14, 15, 16, 17, 18]

Marking scheme:
- file: intermediate_markdown/marking_schemes/ordinary/applied_maths_ordinary_2023_paper_1_marking_scheme.md
- pages: [10, 11]

# Notes

