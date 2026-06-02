---
subject: "Computer Science"
subject_id: "computer-science"
level: "Higher"
year: 2023
paper: "Section A B"
question_number: 20
section: "Question 15"
topic: "Computer Systems"
secondary_topics: []
classification_type: "topic_specific"
source_type: "past_paper_with_marking_scheme"
has_visual: true
visual_assets:
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2023_section_a_b_exam_page_019.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2023_section_a_b_exam_page_020.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2023_section_a_b_exam_page_021.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2023_section_a_b_exam_page_022.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2023_section_a_b_exam_page_023.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2023_section_a_b_exam_page_018.png"
source_exam_pages:
  - "18"
  - "19"
  - "20"
  - "21"
  - "22"
  - "23"
  - "24"
source_marking_scheme_pages:
  - "18"
  - "19"
  - "20"
  - "21"
  - "22"
pairing_confidence: "high"
topic_confidence: "medium"
classification_source: "fallback_rules"
candidate_topics:
  - "Computer Systems"
  - "Algorithms and Logic"
  - "Computers and Society"
needs_review: false
review_reason: ""
---


# Question

Question 15

Computers can use a choice of different search algorithms to find information much quicker than
humans. Two common search algorithms are the linear search and the binary search.

(a)   Consider the following list of seven names.


    Amir      Dean        Eoin       Helen       Natalia      Steve       Terry


        (i)   What search algorithm would be best suited to search the list of names shown above?
             Justify your answer.

  Search Algorithm:

  Justify:



Search algorithms work by comparing the list elements with a particular search value, known as a
key.

        (ii)    List, in order, the names that would be compared until Natalia is found using the linear
           search algorithm.




         (iii)   List, in order, the names that would be compared until Natalia is found using the
           binary search algorithm.





       (iv)  Complete the table below to show the best and worst case time complexities for the
         two search algorithms. You can assume that the size of the input is N.

                                         Best Case       Worst Case

                      Linear Search           O(1)

                     Binary Search


      (v)  What is meant by O(1) time complexity?





                                                          This question continues on the next page.


Leaving Certificate 2023                       18
Computer Science, Sections A & B – Higher level

<!-- PAGE 19 -->
# Page 19

![Page 19](../../../image_assets/exam_papers/higher/computer_science_higher_2023_section_a_b_exam_page_019.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; page contains vector drawings -->

(b)  The Python code below shows an implementation of a binary search function.
 1  def binary_search1(v, L):
 2
 3      lo = 0
 4      hi = len(L) - 1
 5
 6      while (lo <= hi):
 7          mid = (lo + hi)//2
 8
 9          if L[mid] > v:
 10             hi = mid – 1
 11         elif L[mid] < v:
 12             lo = mid + 1
 13         else:
 14             return mid
 15
 16     return len(L)

        (i)    In the code there is one example of iteration. State on which lines the iteration starts
         and ends and explain what it does.

  Start line number:

 End line number:

 Explain:





        (ii)  The function contains two examples of a return statement – line 14 and line 16.
        What is the purpose of a return statement?





         (iii)  Explain the reason for len(L) on line 16.





                                                          This question continues on the next page.


Leaving Certificate 2023                       19
Computer Science, Sections A & B – Higher level

<!-- PAGE 20 -->
# Page 20

![Page 20](../../../image_assets/exam_papers/higher/computer_science_higher_2023_section_a_b_exam_page_020.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; page contains vector drawings; text contains visual keywords -->

(c)  An alternative implementation of the binary search can be achieved using recursion as shown.
 1  def binary_search2(v, L, lo, hi):
 2
 3      if lo > hi:
 4          return len(L)
 5
 6      mid = (lo + hi)//2
 7
 8      if L[mid] > v:
 9          return binary_search2(v, L, lo, mid-1)
 10     elif L[mid] < v:
 11         return binary_search2(v, L, mid+1, hi)
 12
 13     return mid

        (i)    Referring to the code above, describe two properties of recursive functions.

  Property 1:





 Property 2:





        (ii)   State one advantage and one disadvantage of using recursion.

 Advantage:





 Disadvantage:





         (iii)  Given a list of names, initialised as shown below, write a line of code to call the
           function binary_search2 to find the name Natalia. You should store the result of
          the function in a variable called result.
names = ["Amir", "Dean", "Eoin", "Helen", "Natalia", "Steve", "Terry"]





Leaving Certificate 2023                       20
Computer Science, Sections A & B – Higher level

<!-- PAGE 21 -->
# Page 21

![Page 21](../../../image_assets/exam_papers/higher/computer_science_higher_2023_section_a_b_exam_page_021.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

Space for extra work.

            Indicate clearly the number and part of the question(s) you are answering.





Leaving Certificate 2023                       21
Computer Science, Sections A & B – Higher level

<!-- PAGE 22 -->
# Page 22

![Page 22](../../../image_assets/exam_papers/higher/computer_science_higher_2023_section_a_b_exam_page_022.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

Space for extra work.

            Indicate clearly the number and part of the question(s) you are answering.





Leaving Certificate 2023                       22
Computer Science, Sections A & B – Higher level

<!-- PAGE 23 -->
# Page 23

![Page 23](../../../image_assets/exam_papers/higher/computer_science_higher_2023_section_a_b_exam_page_023.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

Space for extra work.

            Indicate clearly the number and part of the question(s) you are answering.





Leaving Certificate 2023                       23
Computer Science, Sections A & B – Higher level

<!-- PAGE 24 -->
# Page 24

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; text contains visual keywords -->

Acknowledgements

Images
Image on page 5: https://www.ccnahub.com/ip-fundamentals/understanding-tcp-ip-and-osi-models/
Image on page 7: https://www.researchgate.net/figure/On-the-left-is-the-Wolf-Goat-and-Cabbage-puzzle-
environment-Right-screenshot-from-a_fig2_305084487
Image on page 11: https://devoxsoftware.com/blog/software-development-lifecycle/
Image on page 12: https://www.donegaldaily.com/2021/05/12/making-remote-work-an-office-with-a-view-on-
arranmore/
Image on page 14: https://skybiometry.com/the-best-face-recognition-software-for-your-business/





Copyright notice
This examination paper may contain text or images for which the State Examinations Commission is not the copyright
owner, and which may have been adapted, for the purpose of assessment, without the authors’ prior consent. This
examination paper has been prepared in accordance with Section 53(5) of the Copyright and Related Rights Act, 2000.
Any subsequent use for a purpose other than the intended purpose is not authorised. The Commission does not
accept liability for any infringement of third-party rights arising from unauthorised distribution or use of this
examination paper.





Leaving Certificate – Higher Level
Computer Science – Sections A & B
Wednesday 24 May
Leaving Certificate 2023                       24
ComputerMorningScience,9:30Sections– 11:00A & B – Higher level

# Marking Scheme

Question 15                                                  38 (12, 11, 15) marks
(a)                                                                           12(2,2,2,3,3) marks
     (i)                                                                  2 marks
         Linear search because the list is short/search is relatively fast on short lists.
         Binary search because the list is already sorted/search is faster.
      Note: No marks for identifying the search algorithm with no or invalid justification

           Valid justification for the search algorithm named           2 marks





                                       18

<!-- PAGE 19 -->
# Page 19

![Page 19](../../../image_assets/marking_schemes/higher/computer_science_higher_2023_paper_1_marking_scheme_page_019.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(ii)                                                                  2 marks
          Amir, Dean, Eoin, Helen, Natalia

             Full correct response               2 marks
              All names except Natalia listed        1 mark


      (iii)                                                                 2 marks
           Helen, Steve, Natalia

             Full correct response               2 marks
              All names except Natalia listed        1 mark




    (iv)                                                                              3(1,1,1) marks


                                         Best Case       Worst Case

                      Linear Search           O(1)            O(N)

                     Binary Search           O(1)         𝑶ሺ𝐥𝐨𝐠𝟐𝑵ሻ


          Each correct response              1 mark




    (v)                                                                  3 marks

       O(1) time complexity means that the time needed to perform a certain task remains
       constant regardless of the size of the input, N.

         Very good description - clear understanding demonstrated                3 marks
           Fair description - limited understanding                               2 marks




(b)                                                                              11(5,3,3) marks

     (i)                                                                               5(1,1,3) marks
          Start line number: 6
         End line number: 14
         The loop repeatedly divides the list in half by calculating the middle index. It
         compares the value at the middle index with the target value and updates the lower
         and higher indices accordingly until the target value is found or the search range
        becomes empty (indicated by the lower index crossing over the higher index).





                                       19

<!-- PAGE 20 -->
# Page 20

![Page 20](../../../image_assets/marking_schemes/higher/computer_science_higher_2023_paper_1_marking_scheme_page_020.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

Correct response for start line number                        1 mark
     Correct response for end line number                         1 mark
     Explanation:
         Very good explanation - clear understanding demonstrated    3 marks
           Fair explanation - limited understanding                   2 marks




     (ii)                                                                  3 marks
            The purpose of a return statement is to end the function
            To pass the result of the function back to the calling code.

         Very good explanation - clear understanding demonstrated               3 marks
           Fair explanation - limited understanding                               2 marks
      (iii)                                                                 3 marks

               It is used to indicate that the value has not been found.

         Very good explanation - clear understanding demonstrated               3 marks
           Fair explanation - limited understanding                               2 marks




(c)                                                             15 (6, 6, 3) marks
     (i)                                                                              6(3,3) marks
          Recursive functions have the following three properties:
            A recursive function must call itself. The program context for each call is placed on
             the call stack. Examples of this can be found on lines 9 and 11 of the code
             provided in the question.
            A recursive function must have a base case/exit criteria which triggers the end of
             the recursion. The base case is the smallest problem that can be solved directly
             without further recursion.
               In the example code the base case is arrived at when lo > hi (line 3).
            Progressive approach. A recursive algorithm must move towards its base case. In
             the example code this is achieved by the use of mid-1 and mid+1 to reset the
              values of lo and hi in each recursive call (lines 9 and 11).

         For each property:
          Very good description - clear understanding demonstrated         3 marks
            Fair description - limited understanding                        2 marks





                                       20

<!-- PAGE 21 -->
# Page 21

![Page 21](../../../image_assets/marking_schemes/higher/computer_science_higher_2023_paper_1_marking_scheme_page_021.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(ii)                                                                              6(3,3) marks
      Advantages
         The main benefits of a recursive approach are simplicity, elegance and
          conciseness
         Recursion can lead to more readable and efficient algorithm descriptions.
         Recursion lends itself well breaking problems down into smaller similar problems

       Disadvantages
         Performance. Recursion can lead to slower execution time due to memory
         overheads
           If recursion is too deep, then there is a danger of running out of space on the
           stack and ultimately program crashes.

      For each advantage/disadvantage:
       Very good description - clear understanding demonstrated         3 marks
         Fair description - limited understanding                        2 marks




(iii)                                                             3 marks
   result = binary_search2("Natalia", names, 0, len(names)-1)

       Full correct response                3 marks
      Almost correct response              2 marks
     Response of some merit              1 mark





                                    21

<!-- PAGE 22 -->
# Page 22

![Page 22](../../../image_assets/marking_schemes/higher/computer_science_higher_2023_paper_1_marking_scheme_page_022.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

# Source References

Exam paper:
- file: intermediate_markdown/exam_papers/higher/computer_science_higher_2023_section_a_b_exam.md
- pages: [18, 19, 20, 21, 22, 23, 24]

Marking scheme:
- file: intermediate_markdown/marking_schemes/higher/computer_science_higher_2023_paper_1_marking_scheme.md
- pages: [18, 19, 20, 21, 22]

# Notes

