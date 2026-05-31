---
subject: "Computer Science"
subject_id: "computer-science"
level: "Higher"
year: 2022
paper: "Section A B"
question_number: 19
section: "Question 14"
topic: "Unclassified"
secondary_topics: []
classification_type: "unclassified"
source_type: "past_paper_with_marking_scheme"
has_visual: true
visual_assets:
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2022_section_a_b_exam_page_016.png"
source_exam_pages:
  - 16
source_marking_scheme_pages:
  - 14
  - 15
  - 16
  - 17
pairing_confidence: "high"
needs_review: false
review_reason: ""
---

# Question

Question 14

(a)  A simplified version of the selection sort algorithm involves the use of two lists called list1
     and list2. At the start of the algorithm the elements in list1 are unsorted, and list2
        is empty as shown.

                 list1:

                 list2:


     At the end of the algorithm list1 is empty, and list2 contains the elements that were in
    list1 at the start, now sorted in ascending order.

                 list1:


                 list2:



     The algorithm is described by the following pseudo-code:

# Marking Scheme

Question 14                                                     30 (13, 17) marks

(a)                                                         13 (3, 2, 3, 2, 3) marks
       (i)                                                            3 marks





              Each correct pass              1 mark




       (ii)                                                            2 marks
             Select the largest (instead of the smallest) element from list 1 and move it to list2
            Any valid response.

       Good description - clear understanding demonstrated              2 marks





                                                                            14

<!-- PAGE 15 -->
# Page 15

![Page 15](../../../image_assets/marking_schemes/higher/computer_science_higher_2022_paper_1_marking_scheme_page_015.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; page contains vector drawings -->

(iii)                                                           3 marks
       Initialise the minimum to be the first element in the list. Then, working/walk across
        the list compare each element to the minimum element so far. If the current element
           is less than the minimum element so far then let it be the new minimum. Continue in
          this manner until the end of the list is reached.
       Pseudocode / flowchart / code are also acceptable

        Very good description - clear understanding demonstrated     3 marks
          Fair description - limited understanding/use of built in functions 1 mark




      (iv)                                                           2 marks
         The same element would always be copied.
          list1 will remain unchanged.
         This would result in an infinite loop.

        Very good explanation - clear understanding demonstrated     2 marks




    (v)                                                             3 marks
       The selection sort algorithm works by passing across every element in the list to sort
       (from left to right). The element being passed over is called the current element. For
       each current element the algorithm looks for the minimum (smallest) element to its
         right. This minimum element is selected and swapped with the current element. The
        algorithm then moves on to the next element.
       Pseudocode / flowchart / code are also acceptable.

        Very good description - clear understanding demonstrated     3 marks
          Fair description - limited understanding                     1 mark



                                                             17 (4, 4, 4, 5) marks
(b)

    (i)                                                              4 marks





              Each correct pass              1 mark




                                                                            15

<!-- PAGE 16 -->
# Page 16

![Page 16](../../../image_assets/marking_schemes/higher/computer_science_higher_2022_paper_1_marking_scheme_page_016.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(ii)                                                               4 marks
         The insertion sort works by passing across each element in the list starting from the
        second element. At the start, the first element is considered sorted and all elements
         to its right are considered unsorted. On each pass the first element in the unsorted list
             is inserted into the sorted list at its correct position.
         Pseudocode / flowchart / code are also acceptable.

Very good explanation - clear understanding demonstrated                       4 marks
Good explanation - clear information, lacking demonstration of full understanding    2 marks
Fair explanation - limited understanding                                      1 mark




         (iii)                                                           4 marks
            A list that is already sorted.
            A list where all the values are the same.
            A list with only two distinct values.
            A list where all the values are different.
            A list with just one element – list size 1.
            An empty list – list size zero.
            Any valid test case.

     For each unique test case:
     Very good description - clear understanding demonstrated                  2 marks



       (iv)                                                               5 marks
            Worst case is O(n2) – list in reverse order. For each of the n elements there are n
            comparisons required to make the insertion at the correct positon.
       AND
            Average case is also O(n2) / best case is O(n) – list is already sorted so no there is
            need to execute inner loop.


     Very good discussion - clear understanding demonstrated                   5 marks
    Good discussion - clear information, lacking demonstration of full understanding 3 marks
      Fair discussion - limited understanding                                  1 mark





                                                                             16

<!-- PAGE 17 -->
# Page 17

![Page 17](../../../image_assets/marking_schemes/higher/computer_science_higher_2022_paper_1_marking_scheme_page_017.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

# Source References

Exam paper:
- file: intermediate_markdown/exam_papers/higher/computer_science_higher_2022_section_a_b_exam.md
- pages: [16]

Marking scheme:
- file: intermediate_markdown/marking_schemes/higher/computer_science_higher_2022_paper_1_marking_scheme.md
- pages: [14, 15, 16, 17]

# Notes

