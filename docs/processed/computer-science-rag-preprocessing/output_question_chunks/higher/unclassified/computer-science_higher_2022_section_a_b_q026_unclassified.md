---
subject: "Computer Science"
subject_id: "computer-science"
level: "Higher"
year: 2022
paper: "Section A B"
question_number: 26
section: "Question 15"
topic: "Unclassified"
secondary_topics: []
classification_type: "unclassified"
source_type: "past_paper_with_marking_scheme"
has_visual: true
visual_assets:
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2022_section_a_b_exam_page_022.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2022_section_a_b_exam_page_023.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2022_section_a_b_exam_page_024.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2022_section_a_b_exam_page_025.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2022_section_a_b_exam_page_026.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2022_section_a_b_exam_page_027.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2022_section_a_b_exam_page_021.png"
source_exam_pages:
  - 21
  - 22
  - 23
  - 24
  - 25
  - 26
  - 27
  - 28
source_marking_scheme_pages:
  - 17
  - 18
  - 19
  - 20
pairing_confidence: "high"
needs_review: false
review_reason: ""
---

# Question

Question 15

A check digit is a single digit number used to verify numbers such as
barcodes, credit cards and International Standard Book Numbers
(ISBNs), thereby helping to prevent data entry errors.

Check digits usually appear as the rightmost digit (position 1) of a
number. For example, the check digit of the ISBN number,
1020041102 highlighted here is 2.





The general procedure used to verify ISBN numbers is as follows:
     Step 1: Multiply each digit in the number by its own digit position.

     Step 2: Add the 10 results together.

     Step 3: Divide the total by 11.

     Step 4: If the remainder is zero the ISBN number is deemed to be valid.


(a)   Apply the above procedure to verify that the ISBN number 1020041102 is valid.





                                                          This question continues on the next page.



Leaving Certificate 2022                       21
Computer Science, Sections A & B – Higher level

<!-- PAGE 22 -->
# Page 22

![Page 22](../../../image_assets/exam_papers/higher/computer_science_higher_2022_section_a_b_exam_page_022.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; page contains vector drawings -->

(b)   Given a 9-digit number, the Python program below can be used to find the number’s check
       digit, that will be used as the 10th digit.

 1  # A program to determine a check digit for a number
 2  isbn = "102004110"
 3  total = 0
 4  for i in range(10, 1, -1):
 5      total = total + int(isbn[10-i]) * i
 6
 7  check_digit = 11 - (total % 11)
 8  print("The check digit for", isbn, "is", check_digit)


        (i)    Line 1 of the above program contains a comment.
           State two reasons why programmers use comments.

 Reason 1:



 Reason 2:




        (ii)  The program makes use of a number of variables and data types.
           Explain the terms variable and data type using one example of each from the code.


 Variable:



 Data type:




         (iii)  The program makes use of the Python int function.
           Outline the purpose of the int function as it is used in the code.





                                                          This question continues on the next page.



Leaving Certificate 2022                       22
Computer Science, Sections A & B – Higher level

<!-- PAGE 23 -->
# Page 23

![Page 23](../../../image_assets/exam_papers/higher/computer_science_higher_2022_section_a_b_exam_page_023.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; text contains visual keywords -->

(iv)  The range function on line 4 of the program generates a sequence of every integer
          from 10 down to 1 (but not including 1). Describe one way these integers are used in
          the program.





(c)   The Python program below shows an alternative implementation.

 1  # A program to determine a check digit for a number
 2  isbn = 102004110
 3  isbn1 = isbn
 4  total = 0
 5  for i in range(2, 11):
 6      digit = isbn % 10
 7      total =  total + digit*i
 8      isbn = isbn//10
 9
 10 check_digit = 11 - (total % 11)
 11 print("The check digit for", isbn1, "is", check_digit)



        (i)   Complete the trace table below to show the changing states of the variables during
         program execution.

                 i     digit    total       isbn

                                  0     102004110

                 2       0        0     10200411

                 3       1        3     1020041

                 4       1        7     102004

                 5       4        27     10200

                 6       0        27     1020

                 7

                 8

                 9

                 10



                                                          This question continues on the next page.



Leaving Certificate 2022                       23
Computer Science, Sections A & B – Higher level

<!-- PAGE 24 -->
# Page 24

![Page 24](../../../image_assets/exam_papers/higher/computer_science_higher_2022_section_a_b_exam_page_024.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; page contains vector drawings -->

(ii)  What is the purpose of the variable called isbn1 in the program?





         (iii)  The program makes use of a number of arithmetic operators. State the purpose of
          each of the operators listed below.

 %



  //





       (iv)   Identify two key differences between the algorithms used in parts (b) and (c).


  Difference 1:





  Difference 2:





      (v)   Provide an example of one type of data entry error a check digit could be used to
           prevent.





Leaving Certificate 2022                       24
Computer Science, Sections A & B – Higher level

<!-- PAGE 25 -->
# Page 25

![Page 25](../../../image_assets/exam_papers/higher/computer_science_higher_2022_section_a_b_exam_page_025.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

Space for extra work.

            Indicate clearly the number and part of the question(s) you are answering.





Leaving Certificate 2022                       25
Computer Science, Sections A & B – Higher level

<!-- PAGE 26 -->
# Page 26

![Page 26](../../../image_assets/exam_papers/higher/computer_science_higher_2022_section_a_b_exam_page_026.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

Space for extra work.

                       Indicate clearly the number and part of the question





Leaving Certificate 2022                       26
Computer Science, Sections A & B – Higher level

<!-- PAGE 27 -->
# Page 27

![Page 27](../../../image_assets/exam_papers/higher/computer_science_higher_2022_section_a_b_exam_page_027.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

Space for extra work.

                       Indicate clearly the number and part of the question





Leaving Certificate 2022                       27
Computer Science, Sections A & B – Higher level

<!-- PAGE 28 -->
# Page 28

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; text contains visual keywords -->

Acknowledgements

Images
Image on page 4: https://www.forbes.com/profile/gordon-moore/
Image on page 5: https://www.indiamart.com/proddetail/automatic-garage-door-18064248973.html
Image on page 10: https://www.beeculture.com/catch-the-buzz-why-vegans-avoid-honey/
Image on page 12: https://www.startupdonut.co.uk/start-up-business-ideas/types-of-business/how-to-start-up-a-
boarding-kennel





Copyright notice
This examination paper may contain text or images for which the State Examinations Commission is not the copyright
owner, and which may have been adapted, for the purpose of assessment, without the authors’ prior consent. This
examination paper has been prepared in accordance with Section 53(5) of the Copyright and Related Rights Act, 2000.
Any subsequent use for a purpose other than the intended purpose is not authorised. The Commission does not
accept liability for any infringement of third-party rights arising from unauthorised distribution or use of this
examination paper.





Leaving Certificate – Higher Level
Computer Science – Sections A & B
Wednesday 25 May
Leaving Certificate 2022                       28
ComputerMorningScience,9:30Sections– 11:00A & B – Higher level

# Marking Scheme

Question 15                                                   30 (3, 11, 16) marks
                                                                       3 marks
(a)
     Step 1.  1x10=10
             0x9=0
             2x8=16
             0x7=0
             0x6=0
             4x5=20
             1x4=4
             1x3=3
             0x2=0
             2x1=2
     Step 2.  10+16+20+4+3+2=55
     Step 3.   55/11=5 remainder 0
     Step 4.  Remainder = 0 => ISBN is valid

                  Full correct response                3 marks
            Two or three correct steps           2 marks
             Any correct step                   1 mark


                                                             11 (2, 4, 3, 2) marks
(b)
    (i)                                                                 2 marks
           Make code more readable / understandable for self / others.
           To enable programmer to isolate a part of the code for testing.
           Comments when used as doc strings can become part of the system
            documentation.
           Comments can contain information about the author, date, version log etc.
           Any reasonable use for comments should be accepted.

         Each unique correct response         1 mark


    (ii)                                                             4 marks
      Variable.
        A variable is a placeholder for data that can change as a program runs.
        A named entity that has a value.
        A reference to a memory/storage location.
        A parameter is a special kind of variable.
     Examples from code: isbn, total, i, check_digit

     Datatype
        A category of data that can be held in a variable.
        A restriction on the values that can be stored in a variable.
     Examples from code: isbn is a string, total, i and check_digit are all integers

        For each term:
       Good description - clear understanding demonstrated              1 mark
         Valid example                                              1 mark




                                                                            17

<!-- PAGE 18 -->
# Page 18

![Page 18](../../../image_assets/marking_schemes/higher/computer_science_higher_2022_paper_1_marking_scheme_page_018.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(iii)                                                             3 marks

      int converts (casts) the string representation of each character of the isbn to an
        integer. This happens on each iteration of the loop. This is done so that the digit can be
        multiplied (integer multiplication) by its position.

        Very good description - clear understanding demonstrated          3 marks
          Fair description - limited understanding                         1 mark




   (iv)                                                             2 marks
           As a loop counter / iterating variable
           As an index into the list, isbn (to retrieve the next digit) / As a means of scanning
            the digits from left to right
           As the digit position

        Very good description - clear understanding demonstrated          2 marks
          Fair description - limited understanding                         1 mark




(c)                                                         16 (5, 3, 2, 4, 2) marks
    (i)                                                              5 marks

                 i     digit    total       isbn

                                  0     102004110

                 2       0        0     10200411

                 3       1        3     1020041

                 4       1        7     102004

                 5       4        27     10200

                 6       0        27     1020

                 7       0        27     102

                 8       2        43     10

                 9       0        43     1

                10      1        53     0


                  Full correct answer                      5 marks
            Two or more correct rows/cols             3 marks
             Any one correct row/col                  1 mark





                                                                            18

<!-- PAGE 19 -->
# Page 19

![Page 19](../../../image_assets/marking_schemes/higher/computer_science_higher_2022_paper_1_marking_scheme_page_019.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(ii)                                                             3 marks
     isbn1 is used to store the original isbn as the value of isbn is changed

      Very good description - clear understanding demonstrated          3 marks
       Fair description - limited understanding                         1 mark




(iii)                                                             2 marks
    % is the modulus/remainder operator. It returns the remainder when one number is
       divided by another e.g. 9%4 -> 1
     // is the floor division operator. It returns the result of a division rounded down to
      the next smallest whole number e.g. 9//4 -> 2

      For each operator:
     Good description - clear understanding demonstrated              1 mark




(iv)                                                             4 marks
    Use of string in program 1 and int in program 2 (to store the ISBN)
    Program 1 traverses string left to right – program 2 takes digits from right to left
    Program 1 uses range to count from 10 down to 2 (or 10 down to but not including 1)
     whereas program 2 uses range to count from 2 up to 10 (or 2 up to but not including
     11)
    Program 1 does not modify the original isbn number – program 2 does. Program 2
     needs to use isbn1 to keep track (remember) the original isbn.

      For each difference:
      Very good description - clear understanding demonstrated          2 marks




(v)                                                             2 marks
     letter/digit errors, such as l → 1 or O → 0
     single digit errors, such as 1 → 2
    transposition errors, such as 12 → 21
    twin errors, such as 11 → 22
    jump transpositions errors, such as 132 → 231
    jump twin errors, such as 131 → 232

      Very good description - clear understanding demonstrated          2 marks
       Fair description - limited understanding                         1 mark





                                                                          19

<!-- PAGE 20 -->
# Page 20

![Page 20](../../../image_assets/marking_schemes/higher/computer_science_higher_2022_paper_1_marking_scheme_page_020.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; text contains visual keywords -->

# Source References

Exam paper:
- file: intermediate_markdown/exam_papers/higher/computer_science_higher_2022_section_a_b_exam.md
- pages: [21, 22, 23, 24, 25, 26, 27, 28]

Marking scheme:
- file: intermediate_markdown/marking_schemes/higher/computer_science_higher_2022_paper_1_marking_scheme.md
- pages: [17, 18, 19, 20]

# Notes

