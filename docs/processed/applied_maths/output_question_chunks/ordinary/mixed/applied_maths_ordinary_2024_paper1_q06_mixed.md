---
subject: "Applied Maths"
subject_id: "applied_maths"
level: "Ordinary"
year: 2024
paper: "Paper 1"
question_number: 6
section: "Main Paper"
topic: "Mixed"
secondary_topics:
  - "Networks and Graphs"
  - "Algorithms and Optimisation"
classification_type: "mixed_topic"
source_type: "past_paper_with_marking_scheme"
has_visual: true
visual_assets:
  - "../../../image_assets/exam_papers/ordinary/applied_maths_ordinary_2024_paper_1_exam_page_021.png"
  - "../../../image_assets/exam_papers/ordinary/applied_maths_ordinary_2024_paper_1_exam_page_022.png"
  - "../../../image_assets/exam_papers/ordinary/applied_maths_ordinary_2024_paper_1_exam_page_023.png"
  - "../../../image_assets/exam_papers/ordinary/applied_maths_ordinary_2024_paper_1_exam_page_024.png"
  - "../../../image_assets/exam_papers/ordinary/applied_maths_ordinary_2024_paper_1_exam_page_020.png"
source_exam_pages:
  - 20
  - 21
  - 22
  - 23
  - 24
source_marking_scheme_pages:
  - 11
  - 12
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

Question 6

(a)   Andrea wants to mathematically model the optimal route for
     a road trip, which involves visiting the five cities shown on the
     map.

     Andrea conducts research on Google Maps on a Sunday
     morning at 8 a.m.

     According to Google Maps, the estimated time, in minutes,
     needed to travel between any two of these cities is shown in
     the following table.


      Time (minutes)     𝐶𝑜𝑟𝑘        𝐷𝑢𝑏𝑙𝑖𝑛      𝐺𝑎𝑙𝑤𝑎𝑦      𝐿𝑖𝑚𝑒𝑟𝑖𝑐𝑘    𝑊𝑎𝑡𝑒𝑟𝑓𝑜𝑟𝑑

         𝐶𝑜𝑟𝑘           –          162         147          82          105

         𝐷𝑢𝑏𝑙𝑖𝑛        162           –          138         127          114

        𝐺𝑎𝑙𝑤𝑎𝑦        147         138           –           75          182

        𝐿𝑖𝑚𝑒𝑟𝑖𝑐𝑘        82          127          75            –           118

       𝑊𝑎𝑡𝑒𝑟𝑓𝑜𝑟𝑑      105         114         182         118            –


(i)   Draw a network to represent this information.
    On your network the weights of the edges should represent the times to travel between the
       cities, which should be represented by labelled nodes.





Leaving Certificate, 2024                      20
Applied Mathematics – Ordinary Level

<!-- PAGE 21 -->
# Page 21

![Page 21](../../../image_assets/exam_papers/ordinary/applied_maths_ordinary_2024_paper_1_exam_page_021.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; page image extracted because text may not fully capture visual content -->

Andrea wants to minimise the amount of time travelling between the cities.

(ii)   Using an appropriate algorithm, find the minimum spanning tree for this network.
    Name the algorithm you used. Relevant supporting work must be shown.





(iii)  Explain a limitation to Andrea’s model.





Leaving Certificate, 2024                      21
Applied Mathematics – Ordinary Level

<!-- PAGE 22 -->
# Page 22

![Page 22](../../../image_assets/exam_papers/ordinary/applied_maths_ordinary_2024_paper_1_exam_page_022.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; page contains vector drawings; text contains visual keywords: shown below; page image extracted because text may not fully capture visual content -->

(b)  On her road trip Andrea comes across an unexpected road
      closure.

      In the network shown below, the edges represent roads
     and the nodes represent junctions of two or more roads,
      labelled 𝐴 to 𝐻.
    Node 𝐴 represents the junction where the road closure begins.
     The remaining roads available to travel on are represented by
     edges and node 𝐻 represents the end of the road closure.
    Once Andrea reaches node 𝐻, she is back on her original route.

     The time, in minutes, to travel between each junction is shown in the network below.
     Andrea wants to take the shortest route, to minimise the disruption to her plan.


                     𝐵           11        𝐸


           7                                                         8
                                9  𝐴                                𝐷       12                                                        𝐺                    6

         5
                                                             7                                  10                                              20

                        4
               𝐶

                             𝐹           25        𝐻

     Use Dijkstra’s algorithm to find the shortest path from junction 𝐴 to junction 𝐻 and calculate
     the shortest time. Relevant supporting work must be shown.





Leaving Certificate, 2024                      22
Applied Mathematics – Ordinary Level

<!-- PAGE 23 -->
# Page 23

![Page 23](../../../image_assets/exam_papers/ordinary/applied_maths_ordinary_2024_paper_1_exam_page_023.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; text extraction is sparse relative to visible page content; page image extracted because text may not fully capture visual content -->

Leaving Certificate, 2024                      23
Applied Mathematics – Ordinary Level

<!-- PAGE 24 -->
# Page 24

![Page 24](../../../image_assets/exam_papers/ordinary/applied_maths_ordinary_2024_paper_1_exam_page_024.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; page contains vector drawings; page image extracted because text may not fully capture visual content -->

# Marking Scheme

6      (i)

     Cork              162       Dublin

                              138
               147

      82
                          114        Galway
                    105

          127
               75               182


                 118
 Limerick                      Waterford
                                                                             10
                                                                                  - 1 for each missing or incorrect edge

6       (ii)
Galway – Limerick – Cork – Waterford – Dublin
(Kruskal’s /Prim’s Algorithm)                                             15 [0/6/9/12]
                                Deduct 3 marks if the algorithm used is not correctly named.
                 Allow 3 marks for the name of a correct algorithm if no other work is presented.

6       (iii)
any relevant limitation e.g. travel times were looked up in advance – these can change         5

6(b)
𝐴𝐴 – 𝐵𝐵 – 𝐸𝐸 – 𝐺𝐺 – 𝐻𝐻
33 minutes                                                          20 [0/8/14/17]





Leaving Certificate, 2024                           9                                   Marking Scheme
Applied Mathematics – Ordinary Level

<!-- PAGE 12 -->
# Page 12

![Page 12](../../../image_assets/marking_schemes/ordinary/applied_maths_ordinary_2024_paper_1_marking_scheme_page_012.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; page image extracted because text may not fully capture visual content -->

# Source References

Exam paper:
- file: intermediate_markdown/exam_papers/ordinary/applied_maths_ordinary_2024_paper_1_exam.md
- pages: [20, 21, 22, 23, 24]

Marking scheme:
- file: intermediate_markdown/marking_schemes/ordinary/applied_maths_ordinary_2024_paper_1_marking_scheme.md
- pages: [11, 12]

# Notes

