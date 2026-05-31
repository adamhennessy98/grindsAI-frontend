---
subject: "Computer Science"
subject_id: "computer-science"
level: "Ordinary"
year: 2024
paper: "Section A B"
question_number: 19
section: "Question 13"
topic: "Unclassified"
secondary_topics: []
classification_type: "unclassified"
source_type: "past_paper_with_marking_scheme"
has_visual: true
visual_assets:
  - "../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2024_section_a_b_exam_page_012.png"
  - "../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2024_section_a_b_exam_page_013.png"
  - "../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2024_section_a_b_exam_page_014.png"
  - "../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2024_section_a_b_exam_page_011.png"
source_exam_pages:
  - 11
  - 12
  - 13
  - 14
source_marking_scheme_pages:
  - 9
  - 10
  - 11
pairing_confidence: "high"
needs_review: false
review_reason: ""
---

# Question

Question 13

(a)  The pseudo code below shows the step-by-step process that a machine follows. The
     machine is used in a medical lab to repeatedly shake bottles.

     The machine reads the program line by line. It always reads one line and then executes it
     immediately. If the line contains the command ‘go to  X’, the machine jumps to line X
     and continues reading and executing.

               1  set A to 0
               2  set B to FALSE
               3  add 1 to A
               4  go to 7
               5  if A equals 60 go to 9
               6  set A to 0
               7  add 1 to A
               8  go to 3
               9  shake the bottle A times
               10 set B to TRUE
               11 end

        (i)  A and B are both variables. What is a variable?





        (ii)   Choose suitable data types for the variables A and B.

 A:

 B:


         (iii)   In lines 1 and 2 in this program the variables are initialised. Explain the term
             “initialised” in relation to variables.





                                                          This question continues on the next page.


Leaving Certificate 2024                       11
Computer Science, Sections A & B – Ordinary level

<!-- PAGE 12 -->
# Page 12

![Page 12](../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2024_section_a_b_exam_page_012.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(iv)   This program has a conditional statement. On what line number is the conditional
          statement?




      (v)   This program enters an “infinite loop”. Explain this term with reference to the code.





       (vi)  The infinite loop in the program above is an example of a “logic error”. In
          programming, what is the difference between a logic error and a syntax error?





(b)  The bottles are numbered and are stored electronically in a list. Below is the list of the bottle
     numbers.


   12      5      59      23      7      42      60      19      67      31


        (i)  Why would a programmer use a linear search to find a specific bottle from this list?





Leaving Certificate 2024                       12
Computer Science, Sections A & B – Ordinary level

<!-- PAGE 13 -->
# Page 13

![Page 13](../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2024_section_a_b_exam_page_013.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(ii)  The following pseudo code is a basic implementation of a linear search.

             1  for each element in the list
             2     if element equal target value then
             3        return its index
             4  if element is not found then
             5     print “Value not found”

          Demonstrate the steps to show how bottle number 23 would be found in the list of
            bottles using this pseudo code.





         (iii)  Explain one disadvantage of the linear search algorithm when searching large data
             sets.





Leaving Certificate 2024                       13
Computer Science, Sections A & B – Ordinary level

<!-- PAGE 14 -->
# Page 14

![Page 14](../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2024_section_a_b_exam_page_014.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; page contains vector drawings -->

# Marking Scheme

Question 13                                                      38 (22, 16) marks
(a)                                                        22 (3, 6, 2, 4, 5, 2) marks
        (i)                                                                  3 marks
          A variable is a named location in computer’s memory used to store data
          A declaration of a value that can be changed
          A term used as a placeholder for a value that can change

            Good description – clear understanding demonstrated    3 marks
                 Fair description – limited understanding                2 marks

        (ii)                                                                  6 marks
         A – Int / Integer
          B – Bool/ Boolean
                              A correct  3 marks
                                B correct  3 marks

         (iii)                                                                 2 marks
          An initialised variable is when a variable is given starting value
          The initial value given to a variable the first time it is declared

           Good description – clear understanding demonstrated     2 marks
                Fair description – limited understanding                1 marks

       (iv)                                                                 4 marks
                 Line 5
                                Correct answer   4 marks

      (v)                                                                  5 marks

    On line 4 the programme jumps to line 7. On line 7 the programme adds 1 to 0, then
    moves on to line 8. On line 8 the programme then jumps back to line 3 and adds 1 to 0,
     Next, the programme moves on to line 4 which means the code will continue to loop
     forever through these steps. Variable A will keep increasing but will not impact the loop.

            Good description – clear understanding demonstrated    5 marks
                 Fair description – limited understanding                3 marks





Leaving Certificate 2024                            9
Computer Science, Marking Scheme – Ordinary level

<!-- PAGE 10 -->
# Page 10

![Page 10](../../../image_assets/marking_schemes/ordinary/computer_science_ordinary_2024_paper_1_marking_scheme_page_010.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(vi)                                                            2 marks
     Syntax errors are mistakes in the code structure causing the program to fail during
     compilation. Logical errors, on the other hand, are flaws in the program's logic that lead to
      incorrect output or behaviour, even though the code compiles and runs successfully.

            Good description – clear understanding demonstrated    2 marks
                 Fair description – limited understanding                1 mark



(b)                                                                16 (4,6,6) marks
        (i)                                                                  4 marks
          The list in not in any sort of order, this means that a binary search will not work.
          The list is short enough to justify the use of a linear search (no need to sort)

            Good description – clear understanding demonstrated    4 marks
                 Fair description – limited understanding                2 marks

        (ii)                                                                  6 marks
          The code will check the first item in the list (12) and see if it matches the target
           item (23), these do not match so it will then move on to the next item in the list.
          The code will compare 5 and 23, these do not match so it will move on to the next
           item in the list.
          The code will compare 59 and 23, these do not match so it will move on to the next
           item in the list.
          The 4th item in the list matches the target item so the index of 3 will be returned.

             Very good - all steps demonstrated with correct index           6 marks
           Good - all steps demonstrated without incorrect index          4 marks
                Fair – limited knowledge of linear search demonstrated         2 marks

         (iii)                                                                 6 marks
          The linear search might have to check every item on a list in some cases.
          A large data set will take a lot more time.

            Good description – clear understanding demonstrated    6 marks
                 Fair description – limited understanding                4 marks





Leaving Certificate 2024                           10
Computer Science, Marking Scheme – Ordinary level

<!-- PAGE 11 -->
# Page 11

![Page 11](../../../image_assets/marking_schemes/ordinary/computer_science_ordinary_2024_paper_1_marking_scheme_page_011.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; text contains visual keywords -->

# Source References

Exam paper:
- file: intermediate_markdown/exam_papers/ordinary/computer_science_ordinary_2024_section_a_b_exam.md
- pages: [11, 12, 13, 14]

Marking scheme:
- file: intermediate_markdown/marking_schemes/ordinary/computer_science_ordinary_2024_paper_1_marking_scheme.md
- pages: [9, 10, 11]

# Notes

