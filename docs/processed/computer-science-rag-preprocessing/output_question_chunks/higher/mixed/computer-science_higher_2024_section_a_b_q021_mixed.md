---
subject: "Computer Science"
subject_id: "computer-science"
level: "Higher"
year: 2024
paper: "Section A B"
question_number: 21
section: "Question 14"
topic: "Mixed"
secondary_topics:
  - "Algorithms and Logic"
  - "Data Representation"
  - "Computer Systems"
classification_type: "mixed_topic"
source_type: "past_paper_with_marking_scheme"
has_visual: true
visual_assets:
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2024_section_a_b_exam_page_016.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2024_section_a_b_exam_page_017.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2024_section_a_b_exam_page_018.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2024_section_a_b_exam_page_015.png"
source_exam_pages:
  - "15"
  - "16"
  - "17"
  - "18"
source_marking_scheme_pages:
  - "17"
  - "18"
  - "19"
  - "20"
  - "21"
pairing_confidence: "high"
topic_confidence: "medium"
classification_source: "fallback_rules"
candidate_topics:
  - "Algorithms and Logic"
  - "Data Representation"
  - "Computer Systems"
needs_review: false
review_reason: ""
---


# Question

Question 14

(a)  The flowchart, shown in Figure 6 below, describes an algorithm that reads two values, swaps
     them, and then displays their new values.





                                                                Figure 6

        (i)    State the names of the two input variables.

  Input variable 1:

  Input variable 2:


        (ii)   Explain the purpose of the variable t.





         (iii)  Flowcharts are commonly used in the design process to describe algorithms. State one
          advantage and one disadvantage of using flowcharts.

 Advantage:





  Disadvantage:





                                                          This question continues on the next page.



Leaving Certificate 2024                       15
Computer Science, Sections A & B – Higher level

<!-- PAGE 16 -->
# Page 16

![Page 16](../../../image_assets/exam_papers/higher/computer_science_higher_2024_section_a_b_exam_page_016.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; page contains vector drawings -->

(b)  The Python code below shows an implementation of the bubble sort algorithm.
 1  values = [50, 70, 30, 60, 20]
 2
 3  for i in range(len(values)):
 4      for j in range(len(values)-1):
 5          if values[j] > values[j+1]:
 6              t = values[j+1]
 7              values[j+1] = values[j]
 8              values[j] = t
 9
 10 print("OUTPUT:", values)

        (i)    State the data type of the variable, values.




        (ii)  What is the index of the element 70?




         (iii)  What does the Python expression len(values) return?



       (iv)  What does the slice expression values[2:4] return?




      (v)   Explain why the expression values[5] would generate a runtime error.





       (vi)  State one advantage and one disadvantage of sorting a data set.


 Advantage:



 Disadvantage:





Leaving Certificate 2024                       16
Computer Science, Sections A & B – Higher level

<!-- PAGE 17 -->
# Page 17

![Page 17](../../../image_assets/exam_papers/higher/computer_science_higher_2024_section_a_b_exam_page_017.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(c)   The algorithm takes five passes to complete the bubble sort of the integers in values.

        (i)   Apply the bubble sort algorithm to sort values. Show the contents of values after
          each of the five passes.


     Initial state of values:     50       70       30       60       20



               After pass 1:



               After pass 2:



               After pass 3:


               After pass 4:


               After pass 5:

        (ii)  The bubble sort algorithm has O(𝑛ଶ) best and worst case time complexity. Explain
         what this means in terms of the number of compare operations performed.





         (iii)  Suggest one possible improvement that could be made to the algorithm that would
          reduce either the number of comparisons or the number of swaps required to
          complete the sort.





Leaving Certificate 2024                       17
Computer Science, Sections A & B – Higher level

<!-- PAGE 18 -->
# Page 18

![Page 18](../../../image_assets/exam_papers/higher/computer_science_higher_2024_section_a_b_exam_page_018.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; page contains vector drawings; text contains visual keywords -->

# Marking Scheme

Question 14                                                   38 (9, 14, 15) marks

(a)                                                               9 (2, 3, 4) marks
     (i)                                                                 2 marks
     Input variable 1: a
     Input variable 2: b

                             Each correct response 1 mark




    (ii)                                                                 3 marks
      t is a temporary variable used to store the value of a
     Without t, the contents of a would be lost when b is assigned to a

        Very good explanation - clear understanding demonstrated 3 marks
          Fair explanation – limited understanding                2 mark




    (iii)                                                             4 (2, 2) marks

Advantages
  They are easier to understand than code (especially for non-programmers).
  The visual representation of flowcharts clearly depicts the flow and logic of an algorithm.
  They are independent of any programming language.
  They are flexible tools used to represent algorithms during the design stage of the design
    process.

Disadvantages
  They take a significant amount of time to develop.
  They can become unwieldly for detailed and complex algorithms.
  Lack of standards can lead to ambiguity and cause confusion.

   For each advantage/disadvantage
        Very good explanation - clear understanding demonstrated 2 marks
          Fair explanation – limited understanding                1 mark



(b)                                                      14 (1, 1, 1, 2, 3, 6) marks

     (i)                                                                 1 mark

     the data type of the variable, values. Is a list (array)


                                    Correct response       1 mark



                                                                             17

<!-- PAGE 18 -->
# Page 18

![Page 18](../../../image_assets/marking_schemes/higher/computer_science_higher_2024_paper_1_marking_scheme_page_018.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(ii)                                                                 1 mark
     the index of the element 70 is 1

                                Correct response     1 mark




    (iii)                                                                 1 mark
     the Python expression, len(values) returns 5

                                Correct response     1 mark




   (iv)                                                                 2 marks

     the slice expression, values[2:4] returns the list, [30, 60]

                       Full correct response              2 marks
                 Response with some merit         1 mark




   (v)                                                                 3 marks

     the expression values[5] would generate a runtime error because the index 5 is out
       of bounds

        Very good explanation - clear understanding demonstrated 3 marks
          Fair explanation – limited understanding                2 mark




   (vi)                                                             6 (3, 3) marks

Advantages
  Binary search requires a dataset to be sorted
  Sorted data can be more user friendly e.g. social media timeline sorted by date/time,
   product catalogue sorted by cost etc.
  Sorted data can also make it easier for data analysis e.g. finding the median or quartiles of a
    set of data or identifying patterns/trends and outliers

Disadvantages
   sorting algorithms can take time
   sorting algorithms can consume valuable computational resources such as CPU and memory.
    If a dataset is already sorted (or almost sorted) the time and resources spent on sorting may
   not provide significant benefits.


                                                                             18

<!-- PAGE 19 -->
# Page 19

![Page 19](../../../image_assets/marking_schemes/higher/computer_science_higher_2024_paper_1_marking_scheme_page_019.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

  the efficiency of sorting algorithms can vary dramatically depending on the size of the input
    dataset, and the size of the dataset may not always be known in advance. This places a
   burden on designers/programmers to have a detailed understanding of the sorting algorithm
   being used and an awareness of the implications under all circumstances.
  Once a dataset is sorted there is a cost to maintaining the dataset in a sorted state

           For each advantage/disadvantage
                 Valid statement      3 marks


(c)                                                           15 (5, 5, 5) marks

     (i)


     Initial state of values:     50       70       30       60       20



              After pass 1:     50       30       60       20       70



              After pass 2:     30       50       20       60       70



              After pass 3:     30       20       50       60       70


              After pass 4:     20       30       50       60       70


              After pass 5:     20       30       50       60       70



                       For each pass correctly completed     1 mark



    (ii)                                                                 5 marks
      In a list of size N the bubble sort algorithm performs N passes. On each pass it will
      perform N-1 compare operations. This gives a total of 𝑵𝟐െ𝑵 operations. For large N this
         is approximately the same as 𝑵𝟐. Hence we write O(𝑵𝟐).
     The best-case scenario is when the input list is already sorted. The worst-case scenario is
     when the input list is in reverse order. In both scenarios bubble sort will also carry out
      the same number of comparisons.
      As the number of elements increases the number of compare operations increases
       quadratically (by a power of 2). For example, the number of compare operations carried
      out by a bubble sort algorithm on a list of size 5 would be of the order of 25. If you
      double the size of the input list, the number of compare operations could increase by a
       factor of four.

     Very good explanation - clear understanding demonstrated                  5 marks

                                                                             19

<!-- PAGE 20 -->
# Page 20

![Page 20](../../../image_assets/marking_schemes/higher/computer_science_higher_2024_paper_1_marking_scheme_page_020.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; text contains visual keywords -->

Good explanation - clear information, lacking demonstration of full understanding 3 marks
      Fair explanation - limited understanding                                 1 mark



    (iii)                                                                 5 marks

Enhancement 1 (reducing size of list by 1 on each pass)
  On the 1st pass the largest item in the list is moved to the rightmost position
  The 2nd pass moves the next largest item to the second last position
  Each pass moves the largest item remaining to its correct position towards the end of the list
  The standard algorithm continues to compare adjacent elements that are already sorted at
   the end (right) of the list even though they are already sorted.
  The algorithm can be enhanced by preventing these unnecessary comparisons.
   This can be achieved by reducing the number of adjacent compares by 1 on each pass as
   shown in the implementation below.

L = [50, 20, 70, 40, 60]

for i in range(len(L)):

    for j in range(len(L)-1-i):
        if L[j] > L[j+1]:
            temp = L[j+1]
            L[j+1] = L[j]
            L[j] = temp
                                OR
Enhancement 2 (halting if no swaps made during any pass)
An alternative enhancement can be achieved by introducing a ‘flag’ to indicate whether a swap
was needed on a particular pass. If no swap was performed the list is deemed to be sorted and
the algorithm can end regardless of the number of passes complete e.g. if the initial list is sorted
there won’t be any swaps on the 1st pass. Therefore, the algorithm can be terminated.

L = [50, 20, 70, 40, 60]

for i in range(len(L)):
    swap = False
    for j in range(len(L)-1):
        if L[j] > L[j+1]:
            temp = L[j+1]
            L[j+1] = L[j]
            L[j] = temp
            swap = True
    if swap == False:
        break

   Very good explanation - clear understanding demonstrated                    5 marks
  Good explanation - clear information, lacking demonstration of full understanding  3 marks
   Fair explanation - limited understanding                                   1 mark




                                                                             20

<!-- PAGE 21 -->
# Page 21

![Page 21](../../../image_assets/marking_schemes/higher/computer_science_higher_2024_paper_1_marking_scheme_page_021.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; text contains visual keywords -->

# Source References

Exam paper:
- file: intermediate_markdown/exam_papers/higher/computer_science_higher_2024_section_a_b_exam.md
- pages: [15, 16, 17, 18]

Marking scheme:
- file: intermediate_markdown/marking_schemes/higher/computer_science_higher_2024_paper_1_marking_scheme.md
- pages: [17, 18, 19, 20, 21]

# Notes

