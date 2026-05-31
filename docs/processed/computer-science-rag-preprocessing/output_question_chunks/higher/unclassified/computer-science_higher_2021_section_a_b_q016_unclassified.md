---
subject: "Computer Science"
subject_id: "computer-science"
level: "Higher"
year: 2021
paper: "Section A B"
question_number: 16
section: "Question 12"
topic: "Unclassified"
secondary_topics: []
classification_type: "unclassified"
source_type: "past_paper_with_marking_scheme"
has_visual: true
visual_assets:
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2021_section_a_b_exam_page_013.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2021_section_a_b_exam_page_012.png"
source_exam_pages:
  - 12
  - 13
source_marking_scheme_pages:
  - 10
  - 11
  - 12
pairing_confidence: "high"
needs_review: false
review_reason: ""
---

# Question

Question 12

The following selection of data is taken from a table in a database used to store information about
dogs.

              dog_name         breed           dob          microchip
               rover       labrador      22/11/2011        Y

                fido         poodle       02/02/2020        Y

                fido      jack russell    15/06/2015        N

               champ       greyhound     01/01/2010        Y

                spot       dalmation     24/08/2007        N

               buddy      rottweiler     21/10/2012        Y

(a)   State why each of the following fields would not be good candidates for a primary key in the
      table shown above.

 dog_name:





  breed:





(b)  One owner can own many dogs. Explain how a foreign key could be introduced to improve
     the design of this database.

owner_id  owner_name  address        dog_name   breed          dob           microchip
1        Joe Murphy  1 main st.    rover      labrador      22/11/2011     Y
1        Joe Murphy  1 main st.    fido       poodle        02/02/2020     Y
2        Ada Traore  9 park ave.   fido       jack russell  15/06/2015     N
1        Joe Murphy  1 main st.    champ      greyhound     01/01/2010     Y
2        Ada Traore  9 park ave.   spots      dalmation     24/08/2007     N
3        James Tidy  7 bond st.    buddy      rottweiler    21/10/2012     Y





Leaving Certificate 2021                       12
Computer Science, Sections A & B – Higher level

<!-- PAGE 13 -->
# Page 13

![Page 13](../../../image_assets/exam_papers/higher/computer_science_higher_2021_section_a_b_exam_page_013.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; page contains vector drawings; text contains visual keywords -->

# Marking Scheme

Question 12                                                            2+3 marks
(a)
The value of a primary key (PK) must be unique:
   •  dog_name would not be a good PK because a duplicate value exists i.e. fido.
   •  breed would not be a good PK because duplicates could exist.
   •  both fields could potentially contain duplicates.

                For each correctly stated reason  1 mark



                                      10

<!-- PAGE 11 -->
# Page 11

![Page 11](../../../image_assets/marking_schemes/higher/computer_science_higher_2021_paper_1_marking_scheme_page_011.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; text contains visual keywords -->

(b)
     •  A foreign key(FK) links two tables. It provides the relationship between two tables. In
          this case if the table shown was split into two separate tables – one for owners and
       one for dogs – the owner_id could be used as the PK in the owners table and the FK in
        the dogs table. The schema is shown below.


          owner_id  owner_name        address
                1  Joe Murphy       1 main street
                2  Ada Traore       9 park ave.
                3  James Tidy       7 bond st.

 dog_id   dog_name    breed           dob             microchip   owner_id
 1       rover       labrador       22/11/2011    Y          1
 2       fido        poodle         02/02/2020    Y          1
 3       fido        jack russell   15/06/2015    N          2
 4       champ       greyhound      01/01/2010    Y          1
 5       spot        dalmation      24/08/2007    N          2
 6       buddy       rottweiler     21/10/2012    Y          3


     Very good explanation - clear understanding demonstrated         3 marks
      Fair explanation - limited understanding                        1 mark





                                      11

<!-- PAGE 12 -->
# Page 12

![Page 12](../../../image_assets/marking_schemes/higher/computer_science_higher_2021_paper_1_marking_scheme_page_012.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

# Source References

Exam paper:
- file: intermediate_markdown/exam_papers/higher/computer_science_higher_2021_section_a_b_exam.md
- pages: [12, 13]

Marking scheme:
- file: intermediate_markdown/marking_schemes/higher/computer_science_higher_2021_paper_1_marking_scheme.md
- pages: [10, 11, 12]

# Notes

