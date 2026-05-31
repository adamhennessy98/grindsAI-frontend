---
subject: "Applied Maths"
subject_id: "applied_maths"
level: "Higher"
year: 2025
paper: "Paper 1"
question_number: 6
section: "Main Paper"
topic: "Unclassified"
secondary_topics: []
classification_type: "unclassified"
source_type: "past_paper_with_marking_scheme"
has_visual: true
visual_assets:
  - "../../../image_assets/exam_papers/higher/applied_maths_higher_2025_paper_1_exam_page_023.png"
  - "../../../image_assets/exam_papers/higher/applied_maths_higher_2025_paper_1_exam_page_024.png"
  - "../../../image_assets/exam_papers/higher/applied_maths_higher_2025_paper_1_exam_page_025.png"
  - "../../../image_assets/exam_papers/higher/applied_maths_higher_2025_paper_1_exam_page_026.png"
  - "../../../image_assets/exam_papers/higher/applied_maths_higher_2025_paper_1_exam_page_022.png"
source_exam_pages:
  - 22
  - 23
  - 24
  - 25
  - 26
source_marking_scheme_pages:
  - 11
  - 12
pairing_confidence: "high"
needs_review: false
review_reason: ""
---

# Question

Question 6

(a)  Éanna wishes to purchase a new campervan. He wants to have the use of a campervan for
      five years and to minimise how much money this will cost him.

    He does not wish to own a campervan at the end of the five years.
     The cost of a new campervan is €80 000.

    A campervan must be serviced each year.
     The cost of servicing a campervan during its first year is €500.
     The cost of servicing a campervan during its second year is €800.
     The cost of servicing a campervan during its third year is €1400.
    A one year old campervan has a resale value of €74 000.
    A two year old campervan has a resale value of €70 000.
    A three year old campervan has a resale value of €61 500.

     Éanna wishes to own a campervan that is no more than three years old at all times during
     the five year period. Any time he purchases a campervan, it is a new one.

(i)   Use Dynamic Programming to find Éanna’s optimal strategy. Calculate how much it will cost
     Éanna if he uses this optimal strategy. Relevant supporting work must be shown.





Leaving Certificate, 2025                      22
Applied Mathematics – Higher Level

<!-- PAGE 23 -->
# Page 23

![Page 23](../../../image_assets/exam_papers/higher/applied_maths_higher_2025_paper_1_exam_page_023.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; page image extracted because text may not fully capture visual content -->

(ii)   In the context of this question, distinguish between the concepts of stage and state.





Leaving Certificate, 2025                      23
Applied Mathematics – Higher Level

<!-- PAGE 24 -->
# Page 24

![Page 24](../../../image_assets/exam_papers/higher/applied_maths_higher_2025_paper_1_exam_page_024.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; page image extracted because text may not fully capture visual content -->

(b)  Two students, Áine and Brody, are investigating the properties of an elastic resistance band
      in their school gym. The band has a natural length of 1 m and an elastic constant of
    650 N m–1. One end of the band is attached to a fixed pole.

(i)   Use integration to calculate the work done by Áine in extending the band horizontally to a
     length of 1.2 m.





Leaving Certificate, 2025                      24
Applied Mathematics – Higher Level

<!-- PAGE 25 -->
# Page 25

![Page 25](../../../image_assets/exam_papers/higher/applied_maths_higher_2025_paper_1_exam_page_025.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; page image extracted because text may not fully capture visual content -->

(ii)   Brody takes the extended band and extends it further. He claims to have done twice the
     work that Áine did.  If Brody is correct, calculate the new length of the band.





Leaving Certificate, 2025                      25
Applied Mathematics – Higher Level

<!-- PAGE 26 -->
# Page 26

![Page 26](../../../image_assets/exam_papers/higher/applied_maths_higher_2025_paper_1_exam_page_026.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; text contains visual keywords: shown below; page image extracted because text may not fully capture visual content -->

# Marking Scheme

6(a)   (i)

 Stage   State  Action   Destination   Value

 1      1     1      0          80000 ൅500 െ74000 ൌ6500*

 2      1+1   1      1          80000 ൅500 െ74000 ൅6500 ൌ13000

        2+0   2      0          80000 ൅1300 െ70000 ൌ11300*

 3      1+2   1      2          80000 ൅500 െ74000 ൅11300 ൌ17800*

        2+1   2      1          80000 ൅1300 െ70000 ൅6500 ൌ17800*

        3+0   3      0          80000 ൅2700 െ61500 ൌ21200

 4      1+3*  1      3          80000 ൅500 െ74000 ൅17800 ൌ24300

        2+2*  2      2          80000 ൅1300 െ70000 ൅11300 ൌ22600*

        3+1   3      1          80000 ൅2700 െ61500 ൅6500 ൌ27700

 5      1+4*  1      2          80000 ൅500 െ74000 ൅22600 ൌ29100*

        2+3*  2      1          80000 ൅1300 െ70000 ൅17800 ൌ29100*

        3+2*  3      0          80000 ൅2700 െ61500 ൅11300 ൌ32500

Optimal strategy = sell twice after 2 years and once after 1 year
Cost = €29 100                                                       20 [0/8/14/17]

6(a)   (ii)
Stage – current year
State – history of ownership status                                                  5

6(b)  (i)
                       ଴.ଶ
𝑊ൌ ׬ 𝑘𝑥 𝑑𝑥ൌ ׬  650𝑥 𝑑𝑥                                                      5                  ଴
              ଴.ଶమ
𝑊ൌ650 ቀ ଶቁൌ13 J                                                            5

6(b)   (ii)
       ௫
26 ൌ ׬  650𝑥 𝑑𝑥                                                               5         ଴.ଶ
            ௫మ    ଴.ଶమ
                                                                              526 ൌ650 ቀ ଶെ ଶቁൌ325𝑥ଶെ13
𝑥ൌ√ଷ so 𝑙ൌ1.35 m                                                             5     ହ





Leaving Certificate, 2025                       9                                   Marking Scheme
Applied Mathematics – M32 2025

<!-- PAGE 12 -->
# Page 12

![Page 12](../../../image_assets/marking_schemes/higher/applied_maths_higher_2025_paper_1_marking_scheme_page_012.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; page image extracted because text may not fully capture visual content -->

# Source References

Exam paper:
- file: intermediate_markdown/exam_papers/higher/applied_maths_higher_2025_paper_1_exam.md
- pages: [22, 23, 24, 25, 26]

Marking scheme:
- file: intermediate_markdown/marking_schemes/higher/applied_maths_higher_2025_paper_1_marking_scheme.md
- pages: [11, 12]

# Notes

