---
subject: "Computer Science"
subject_id: "computer-science"
level: "Higher"
year: 2025
paper: "Section A B"
question_number: 19
section: "Question 14"
topic: "Computer Systems"
secondary_topics: []
classification_type: "topic_specific"
source_type: "past_paper_with_marking_scheme"
has_visual: true
visual_assets:
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2025_section_a_b_exam_page_014.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2025_section_a_b_exam_page_015.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2025_section_a_b_exam_page_016.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2025_section_a_b_exam_page_017.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2025_section_a_b_exam_page_013.png"
source_exam_pages:
  - "13"
  - "14"
  - "15"
  - "16"
  - "17"
source_marking_scheme_pages:
  - "14"
  - "15"
  - "16"
  - "17"
  - "18"
pairing_confidence: "high"
topic_confidence: "medium"
classification_source: "fallback_rules"
candidate_topics:
  - "Computer Systems"
  - "Algorithms and Logic"
  - "Data Representation"
needs_review: false
review_reason: ""
---


# Question

Question 14

(a)  The Greatest Common Divisor (GCD) of two integers a and b is the largest
    number that divides into both with no remainder. One of the oldest and
     most famous algorithms was first described by Greek mathematician,
      Euclid, in his book of Elements written around 300BC. The code snippet
     below is an implementation of Euclid’s algorithm using subtraction to find
     the GCD of 45 and 18.


 1  def gcd(a, b):
 2      while a != b:
 3          if a > b:
 4              a = a - b
 5          elif b > a:
 6              b = b - a
 7
 8      return a
 9
 10 print("The GCD is", gcd(45,18))

        (i)    State the purpose of the def keyword on line 1 of the code.





        (ii)   Starting from line 2 of the code, complete the trace table shown below. The variables
        a and b have been initialised to 45 and 18 respectively.

                           a           b

                                45             18





         (iii)  This implementation uses a while loop. Explain why a for loop would not be
            suitable for this algorithm.





                                                          This question continues on the next page.


Leaving Certificate 2025                       13
Computer Science, Sections A & B – Higher level

<!-- PAGE 14 -->
# Page 14

![Page 14](../../../image_assets/exam_papers/higher/computer_science_higher_2025_section_a_b_exam_page_014.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; page contains vector drawings; text contains visual keywords -->

(b)  The code below shows a recursive implementation to find the GCD of two integers.

 1  def recursive_gcd(a, b):
 2      if b == 0:
 3          return a
 4      return recursive_gcd(b, a%b)
 5
 6  print("The GCD is", recursive_gcd(45, 18))

        (i)   Every recursive function, including the one shown here, has a base case and a
           recursive case. Outline the meaning of the terms ‘base case’ and ‘recursive case’.

 Base case:





 Recursive case:





        (ii)   Explain the use of the variable b and the expression a%b on line 4 of the code.

  b:





 a%b:





         (iii)  Given a choice of using gcd shown in part (a), or recursive_gcd shown here in
           part (b), which version would you recommend to find the greatest common divisor of
           very large numbers on machines with limited RAM? Justify your answer, in terms of
        memory utilisation.

 gcd or recursive_gcd:

  Justify:





Leaving Certificate 2025                       14
Computer Science, Sections A & B – Higher level

<!-- PAGE 15 -->
# Page 15

![Page 15](../../../image_assets/exam_papers/higher/computer_science_higher_2025_section_a_b_exam_page_015.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; page contains vector drawings; text contains visual keywords -->

(c)   Quicksort is a widely used sorting algorithm developed by British computer
      scientist Tony Hoare in 1960. The algorithm itself is recursive and it uses a
     process called partitioning around a chosen pivot to achieve its objective.
     Quicksort is known for its efficiency and speed, especially in handling very
     long lists of data.

        (i)   Given the unsorted list shown below and a pivot of 13, state the contents of the two
             sub-lists created after one partitioning step of quicksort.

                     29    10    14    37    13



  Left sub-list:

  Right sub-list:


        (ii)   Describe the next steps quicksort would take in order to achieve its objective.





         (iii)  Outline two common strategies used when selecting a pivot for a quicksort algorithm.


 1.



 2.





                                                          This question continues on the next page.





Leaving Certificate 2025                       15
Computer Science, Sections A & B – Higher level

<!-- PAGE 16 -->
# Page 16

![Page 16](../../../image_assets/exam_papers/higher/computer_science_higher_2025_section_a_b_exam_page_016.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; page contains vector drawings; text contains visual keywords -->

(iv)  Referring to Figure 4 below, explain the best and worst-case time complexity of the
           quicksort algorithm.





                                           Figure 4


 Best case:





 Worst case:





Leaving Certificate 2025                       16
Computer Science, Sections A & B – Higher level

<!-- PAGE 17 -->
# Page 17

![Page 17](../../../image_assets/exam_papers/higher/computer_science_higher_2025_section_a_b_exam_page_017.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; page contains vector drawings; text contains visual keywords -->

# Marking Scheme

Question 14                                                  38 (10, 15, 13) marks

(a)                                                          10 (2, 4, 4) marks

     (i)                                                                 2 marks
     To introduce (define) the function gcd.

                                Correct response     2 marks




    (ii)                                                                 4 marks


                           a           b

                                45             18

                                27             18

                                9             18

                                9              9


                           For each correct row       1 mark
                                 Full correct response       4 marks




    (iii)                                                                 4 marks
     The number of iterations is not known in advance of running the algorithm.
     The number of iterations required can vary depending on the arguments passed into the
       function gcd.

        Very good explanation - clear understanding demonstrated 4 marks
          Fair explanation – limited understanding                2 marks





Leaving Certificate 2025                         14
Computer Science – Higher Level
Marking Scheme

<!-- PAGE 15 -->
# Page 15

![Page 15](../../../image_assets/marking_schemes/higher/computer_science_higher_2025_paper_1_marking_scheme_page_015.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(b)                                                          15 (4, 6, 5) marks

     (i)                                                             4 (2, 2) marks

Base Case
     the condition that stops the recursive function from calling itself indefinitely (or until a
       stack overflow error occurs).
     Each recursive call works towards the base case decomposing the problem into simpler
      problems until the simplest version of the problem is reached. The answer to the
       simplest version of the problem is known e.g. recursive_gcd(a, 0) is a.
      In the example code the condition b == 0 is the base case.
.
Recursive Case
     the part of the function that calls itself to solve a simpler/smaller version of the problem.
     eventually the recursive calls converge on the base case.
      In the example code the recursive case is on line 6 i..e. recursive_gcd(b, a % b).

     For each case:
          Very good explanation - clear understanding demonstrated    2 marks
            Fair explanation – limited understanding                   1 mark




    (ii)                                                             6 (3, 3) marks

The variable b:
     This is the first argument (parameter/value) passed into the function as a.
       (Within the function b determines whether the base case (b == 0) is reached).
The expression a%b:
     This is the second argument (parameter/value) passed into the function as b.
          It computes the remainder when a is divided by b. The remainder becomes the new
       value of b in the next recursive call.
       (Within the function its use is to reduce the problem size by applying the principle that
      the GCD of two numbers (a and b) is the same as the GCD of b and the remainder of
     a %  b).

     For each answer:
          Very good explanation - clear understanding demonstrated    3 marks
            Fair explanation – limited understanding                   2 marks





Leaving Certificate 2025                         15
Computer Science – Higher Level
Marking Scheme

<!-- PAGE 16 -->
# Page 16

![Page 16](../../../image_assets/marking_schemes/higher/computer_science_higher_2025_paper_1_marking_scheme_page_016.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; text contains visual keywords -->

(iii)                                                             5 (1, 4) marks
     gcd
                                   Correct response: 1 mark

     The non-recursive solution is more suitable for finding the GCD of very large numbers on
      machines with limited RAM because it avoids the potentially high memory overhead of
       recursion (and the possibility of causing a stack overflow).
      In a non-recursive solution memory usage remains constant, as the loop reuses the same
       variables regardless of the size of the numbers or the number of iterations.
      In a recursive solution the memory usage grows with each recursive call as the call stack
       increases. For very large numbers this could exhaust the stack leading to a stack overflow
        error.

     Very good explanation - clear understanding demonstrated                  4 marks
      Fair explanation - limited understanding                                 2 marks




(c)                                                           13 (2, 5, 2, 4) marks

     (i)                                                             2 (1, 1) marks

      Left sub-list: [10]
     Right sub-list: [29, 14, 37]

                          For each correct sub-list         1 mark



    (ii)                                                                 5 marks

     After the first pass, quicksort continues by applying the same process to each sub-list
       created during partitioning. If a sub-list has only one element, it is already sorted. For
       larger sub-lists, a new pivot is chosen, and the list is divided into elements less than the
       pivot and elements greater than or equal to it. This divide-and-conquer approach is
      repeated recursively on each sub-list. Once all sub-lists are reduced to single elements,
      they are combined in order, resulting in a fully sorted list.
     Appropriate diagram.

     Very good explanation - clear understanding demonstrated                   5 marks
    Good explanation - clear information, lacking demonstration of full understanding 3 marks
      Fair explanation - limited understanding                                  1 mark





Leaving Certificate 2025                         16
Computer Science – Higher Level
Marking Scheme

<!-- PAGE 17 -->
# Page 17

![Page 17](../../../image_assets/marking_schemes/higher/computer_science_higher_2025_paper_1_marking_scheme_page_017.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(iii)                                                             2 (1, 1) marks

Pivot selection strategies
   First element
   Last element
  Middle
  Median of first, middle and last element
  Median of medians
  Random

                          For each correct strategy        1 mark




(iv)                                                              4 (2, 2) marks

Best case:
  The best-case time complexity of quicksort is 𝑶ሺ𝒏 𝒍𝒐𝒈 𝒏ሻ because, in this scenario, each
    pivot divides the list evenly into two halves. This results in a balanced recursion tree with
   about 𝒍𝒐𝒈 𝒏 levels. At each level, the algorithm processes all n elements once during
    partitioning, so the total work done across all levels is 𝒏 ൈ 𝒍𝒐𝒈 𝒏.

Worst case:
  The worst-case time complexity of quicksort is 𝑶ሺ𝒏𝟐ሻ. This happens when the pivot
   repeatedly creates very unbalanced splits, such as when it is always the smallest or largest
   element in the list. Instead of dividing the list in half, one sub list ends up with n - 1 elements
   and the other with 0, creating a recursion tree with n levels. Since the algorithm still
   processes n elements at each level, the total number of operations becomes 𝒏ൈ𝒏ൌ𝑶ሺ𝒏𝟐ሻ.
    This makes quicksort inefficient in the worst case, especially on already sorted or reverse-
   sorted lists if no precautions are taken.

     For each case (best and worst):
          Very good explanation - clear understanding demonstrated    2 marks
            Fair explanation – limited understanding                   1 mark





Leaving Certificate 2025                         17
Computer Science – Higher Level
Marking Scheme

<!-- PAGE 18 -->
# Page 18

![Page 18](../../../image_assets/marking_schemes/higher/computer_science_higher_2025_paper_1_marking_scheme_page_018.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

# Source References

Exam paper:
- file: intermediate_markdown/exam_papers/higher/computer_science_higher_2025_section_a_b_exam.md
- pages: [13, 14, 15, 16, 17]

Marking scheme:
- file: intermediate_markdown/marking_schemes/higher/computer_science_higher_2025_paper_1_marking_scheme.md
- pages: [14, 15, 16, 17, 18]

# Notes

