---
subject: "Computer Science"
subject_id: "computer-science"
level: "Higher"
year: 2020
paper: "Section A B"
question_number: 18
section: "Question 13"
topic: "Unclassified"
secondary_topics: []
classification_type: "unclassified"
source_type: "past_paper_with_marking_scheme"
has_visual: true
visual_assets:
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2020_section_a_b_exam_page_012.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2020_section_a_b_exam_page_013.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2020_section_a_b_exam_page_014.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2020_section_a_b_exam_page_015.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2020_section_a_b_exam_page_016.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2020_section_a_b_exam_page_011.png"
source_exam_pages:
  - 11
  - 12
  - 13
  - 14
  - 15
  - 16
source_marking_scheme_pages:
  - 9
  - 10
pairing_confidence: "high"
needs_review: false
review_reason: ""
---

# Question

Question 13

In his book The Art of Computer Programming, Donald Knuth states that
“searching is the most time‐consuming part of many programs, and the
substitution of a good search method for a bad one often leads to a
substantial increase in speed.”

(a)  The Python code below shows an implementation of a search
      algorithm. Examine the code and answer the questions that follow:

 1  names = ["John", "Mary", "Zoe", "Alex", "Séamas"]
 2  name = input("Enter lookup name: ")
 3
 4  found = False
 5  index = 0
 6
 7  while (not found) and (index != len(names)):
 8      if name == names[index]:
 9          found = True
 10     else:
 11         index = index + 1
 12
 13 print("Result:", index)



        (i)    State the name of the above search algorithm.





        (ii)  What is the data type of the variable called found?





Leaving Certificate 2020                       11
Computer Science, Sections A & B – Higher level

<!-- PAGE 12 -->
# Page 12

![Page 12](../../../image_assets/exam_papers/higher/computer_science_higher_2020_section_a_b_exam_page_012.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(iii)  Step through how the algorithm finds the name Zoe in the list called names.





       (iv)  What would be the value of index after running the algorithm if the user entered a
        name that was not present in the list called names?





      (v)  What is the worst‐case time complexity of this search algorithm? Explain your answer.





Leaving Certificate 2020                       12
Computer Science, Sections A & B – Higher level

<!-- PAGE 13 -->
# Page 13

![Page 13](../../../image_assets/exam_papers/higher/computer_science_higher_2020_section_a_b_exam_page_013.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; page contains vector drawings; text contains visual keywords -->

(b)   Binary search is generally regarded as a highly efficient search algorithm.

        (i)    State one disadvantage of the binary search algorithm.





        (ii)   Step through how the binary search algorithm finds the integer 28 in the list L shown
          below.





Leaving Certificate 2020                       13
Computer Science, Sections A & B – Higher level

<!-- PAGE 14 -->
# Page 14

![Page 14](../../../image_assets/exam_papers/higher/computer_science_higher_2020_section_a_b_exam_page_014.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(iii)  What is the maximum number of comparisons the binary search algorithm would need
           to make if the value to be searched for did not exist in a list of 8 items?


       Answer:



       Space for rough work:





Leaving Certificate 2020                       14
Computer Science, Sections A & B – Higher level

<!-- PAGE 15 -->
# Page 15

![Page 15](../../../image_assets/exam_papers/higher/computer_science_higher_2020_section_a_b_exam_page_015.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(c)  Why is the study of algorithmic efficiency considered to be important in computer science?





Leaving Certificate 2020                       15
Computer Science, Sections A & B – Higher level

<!-- PAGE 16 -->
# Page 16

![Page 16](../../../image_assets/exam_papers/higher/computer_science_higher_2020_section_a_b_exam_page_016.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; page contains vector drawings; text contains visual keywords -->

# Marking Scheme

Question 13                                                        30 marks

(a)                                                      14 (2, 2, 5, 2, 3) marks

        (i)                                                            2 marks
           Linear search


        (ii)                                                            2 marks
          Boole / Boolean (2 marks)
          True / False (1 mark)



         (iii)                                                          5 marks

            Starts at index 0 – checks/compares first name. Name is John. Found stays as false.
          Index increased by 1 – checks/compares second name. Name is Mary. Found stays as
             false.
          Index increased by 1 – checks/compares third name. Name is Zoe. Found changes to
            true. Exits while loop and prints Zoe, index 2.
         Or any similar relevant explanation.

         Very good description - clear understanding demonstrated          5 marks
       Good description - clear information, lacking full understanding      3 marks
           Fair description - limited understanding                         1 mark



       (iv)                                                           2 marks
          Index = 5





                                                                              9

<!-- PAGE 10 -->
# Page 10

![Page 10](../../../image_assets/marking_schemes/higher/computer_science_higher_2020_paper_1_marking_scheme_page_010.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(v)                                                          3 marks
         Worst case: O(n) / length of list

         Worst case would mean that the item is not in the list so each item is searched
          before being found or not found or similar.
            In a list of n items there would be at most n comparisons -> worst case.


            Answer                                  1 mark
              Explanation:
           Good description - clear information          2 marks
                Fair description - limited understanding        1 mark



(b)                                                        9 (2, 5, 2) marks

        (i)                                                            2 marks

   The data set being searched must be sorted and remain sorted.
   Can be slower than linear search (average performance is O(log n) vs. average of linear
   search is O(n/2).
   More complicated than linear search and unnecessary for small data sets.
   Only works on data with a “less-than” relationship.
   Data has to be of the same type.
   Or similar answer.

                Any suitable answer     2 marks


        (ii)                                                            5 marks

# Source References

Exam paper:
- file: intermediate_markdown/exam_papers/higher/computer_science_higher_2020_section_a_b_exam.md
- pages: [11, 12, 13, 14, 15, 16]

Marking scheme:
- file: intermediate_markdown/marking_schemes/higher/computer_science_higher_2020_paper_1_marking_scheme.md
- pages: [9, 10]

# Notes

