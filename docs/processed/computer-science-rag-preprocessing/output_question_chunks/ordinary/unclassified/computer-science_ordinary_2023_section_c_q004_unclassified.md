---
subject: "Computer Science"
subject_id: "computer-science"
level: "Ordinary"
year: 2023
paper: "Section C"
question_number: 4
section: "Question 16"
topic: "Unclassified"
secondary_topics: []
classification_type: "unclassified"
source_type: "past_paper_with_marking_scheme"
has_visual: true
visual_assets:
  - "../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2023_section_c_exam_page_005.png"
  - "../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2023_section_c_exam_page_006.png"
  - "../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2023_section_c_exam_page_007.png"
  - "../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2023_section_c_exam_page_008.png"
  - "../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2023_section_c_exam_page_009.png"
  - "../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2023_section_c_exam_page_010.png"
  - "../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2023_section_c_exam_page_011.png"
  - "../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2023_section_c_exam_page_004.png"
source_exam_pages:
  - 4
  - 5
  - 6
  - 7
  - 8
  - 9
  - 10
  - 11
  - 12
source_marking_scheme_pages:
  - 17
  - 18
  - 19
  - 20
  - 21
  - 22
pairing_confidence: "high"
needs_review: false
review_reason: ""
---

# Question

Question 16

(a)  Open the program called Question16_A.py from your device. The
     source code is shown and described briefly below.

     Before making any changes, you should save your working copy of
     the file using the format CandidateNumberQuestion16_A.py. For
     example, you would save the file as 123456Question16_A.py if your
     candidate number was 123456.

     Enter your Examination Number in the space provided on line 2 in
     your Python file.

     The program below produces a times table for a specific number. A times table is a
      multiplication table in a list that shows the multiples of a specific number. The code below
     works by using a for loop to multiply the number seven by zero, then by one, then by two
      until the loop repeats ten times in total.

    1  # Question 16(a)
    2  # Examination Number:
    3
    4  print("Multiplication program")
    5
    6  number = 7
    7
    8  print("Multiplications of ", number)
    9
    10 for i in range(10):
    11     print(number*i)

    Make the following changes to the program:

        (i)     Currently the first line that is printed by the program is “Multiplication program”.
           Change the program so that the first line printed is “Times Table program”.
         When the program is run the output may now look as follows:

         Times Table program
         Multiplications of 7
         0
         7
         14
         21
         28
         35
         42
         49
         56
         63
                                                          This question continues on the next page.

Leaving Certificate – 2023                      4
Computer Science, Section C – Ordinary level

<!-- PAGE 5 -->
# Page 5

![Page 5](../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2023_section_c_exam_page_005.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; text contains visual keywords -->

(ii)  Update the program so that a row of asterisks appears above and below the line which
          outputs “Times Table program”.
        When the program is run the output may now look as follows:

        ********************
        Times Table program
        ********************
        Multiplications of 7
        0
        7
        14
        21
        28
        35
        42
        49
        56
        63


         (iii)  Amend the program to ask for and accept the user's choice of number to be used as
          the multiplier. Store the entered number in the variable called number.
        When the program is run and the user enters 8 as the number, the output may now
           look as follows:

         ********************
         Times Table program
         ********************
         Enter number: 8
         Multiplications of 8
         0
         8
         16
         24
         32
         40
         48
         56
         64
         72


       (iv)  Currently the user can enter a negative number. Negative numbers should not be
          allowed in this program. Amend the program so that the times table is not printed out
         and an appropriate error message is displayed if the user enters a negative number.
        When the program is run and the user enters -2 as the number, the output may now
           look as follows:

         Times Table program
         Enter number: -2
         This program does not support negative numbers.


                                                          This question continues on the next page.



Leaving Certificate – 2023                      5
Computer Science, Section C – Ordinary level

<!-- PAGE 6 -->
# Page 6

![Page 6](../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2023_section_c_exam_page_006.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; text contains visual keywords -->

(v)   Times tables normally shows the result of multiplying a specific number by zero to
          twelve inclusive. Amend the program so it displays the results of multiplying the
          entered number by zero to twelve inclusive.
        When the program is run and the user enters the number 8, the output may now look
           as follows:

         ********************
         Times Table program
         ********************
         Enter number: 8
         Multiplications of 8
         0
         8
         16
         24
         32
         40
         48
         56
         64
         72
         80
         88
         96

       (vi)  Update the program so that it displays the results in the format “3 x 8 = 24”, as shown
          below.
        When the program is run and the user enters the number 8, the output may now look
           as follows:

         ********************
         Times Table program
         ********************
         Enter number: 8
         Multiplications of 8
         0 x 8 = 0
         1 x 8 = 8
         2 x 8 = 16
         3 x 8 = 24
         4 x 8 = 32
         5 x 8 = 40
         6 x 8 = 48
         7 x 8 = 56
         8 x 8 = 64
         9 x 8 = 72
         10 x 8 = 80
         11 x 8 = 88
         12 x 8 = 96


     Save your file using the format CandidateNumberQuestion16_A.py. For example, you would
     save the file as 123456Question16_A.py if your candidate number was 123456.

                                                          This question continues on the next page.

Leaving Certificate – 2023                      6
Computer Science, Section C – Ordinary level

<!-- PAGE 7 -->
# Page 7

![Page 7](../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2023_section_c_exam_page_007.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; page contains vector drawings; text contains visual keywords -->

(b)  Open the program called Question16_B.py from your device. This file
     only contains two comments on lines 1 and 2.

     Before making any changes, you should use the format
     CandidateNumberQuestion16_B.py to save your file. For example, you
     would save the file as 123456Question16_B.py if your candidate
    number was 123456.

     Enter your Examination Number in the space provided on Line 2.

     Implement a program for a temperature alert system for a baby’s room.

     You should use comments throughout your program to explain your code. You may wish to
     reuse some of the code you used in part (a) as part of your solution.

     Your program should do the following:
       Display a message which outputs “Welcome to Temperature Alert System”.
       Ask the user to enter a temperature value in degrees Celsius. An example of how this
        might look is shown below.

      Enter temperature value in degrees Celsius: 22

       Use a conditional statement to output different pieces of information based on the
        temperature value that has been input by the user. See the table below for conditions
        and the outputs that should be displayed.


                          Condition                        Output


              Temperature is less than 20        Too cold. Turn up heating.


              Temperature between 20 – 24      Temperature is just right.


              Temperature is more than 24       Too warm. Turn down heating.



         An example output is shown below.

        Welcome to Temperature Alert System
        Enter temperature value in degrees Celsius: 22
        Temperature is just right.


          Save your file using the format CandidateNumberQuestion16_B.py. For example, you
         would save the file as 123456Question16_B.py if your candidate number was 123456.





Leaving Certificate – 2023                      7
Computer Science, Section C – Ordinary level

<!-- PAGE 8 -->
# Page 8

![Page 8](../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2023_section_c_exam_page_008.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

Space for rough work.

                             This page will not be reviewed by an examiner.





Leaving Certificate – 2023                      8
Computer Science, Section C – Ordinary level

<!-- PAGE 9 -->
# Page 9

![Page 9](../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2023_section_c_exam_page_009.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

Space for rough work.

                             This page will not be reviewed by an examiner.





Leaving Certificate – 2023                      9
Computer Science, Section C – Ordinary level

<!-- PAGE 10 -->
# Page 10

![Page 10](../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2023_section_c_exam_page_010.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

Space for rough work.

                             This page will not be reviewed by an examiner.





Leaving Certificate – 2023                     10
Computer Science, Section C – Ordinary level

<!-- PAGE 11 -->
# Page 11

![Page 11](../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2023_section_c_exam_page_011.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

Space for rough work.

                             This page will not be reviewed by an examiner.





Leaving Certificate – 2023                     11
Computer Science, Section C – Ordinary level

<!-- PAGE 12 -->
# Page 12

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; text contains visual keywords -->

Acknowledgements

Images
Image on page 7: https://www.philips.co.uk/c-p/SCH480_00/avent-digital-thermometer





Copyright notice
This examination paper may contain text or images for which the State Examinations Commission is not the copyright
owner, and which may have been adapted, for the purpose of assessment, without the authors’ prior consent. This
examination paper has been prepared in accordance with Section 53(5) of the Copyright and Related Rights Act, 2000.
Any subsequent use for a purpose other than the intended purpose is not authorised. The Commission does not
accept liability for any infringement of third-party rights arising from unauthorised distribution or use of this
examination paper.





Leaving Certificate – Ordinary Level
Computer Science – Section C
Leaving Certificate – 2023                     12Wednesday 24 MayComputer Science, Section C – Ordinary level
Morning 11:30 – 12:30

# Marking Scheme

Question 16                                                        80 marks

(a)                                                     50 (15, 10, 10, 5, 5, 5) marks
Possible solution:
1  # Question 16(a)
2  # Examination Number:
3  print("********************") #(ii)
4  print("Times Table program") #(i)
5  print("********************") #(ii)
6
7  number = int(input("Enter number: ")) #(iii)
8  if number < 0: #(iv)
9      print("This program does not support negative numbers")
10 else: #(iv)
11
12     for i in range(13): #(v)
13         print(i, "x", number, "=", number*i) #(vi)
14




(i)                                                           15 marks (B-15 scale)

  15 marks  Correct response
             Correct implementation using solution above or similar.

  10 marks  Almost correct response
             Correct implementation using solution above or similar but with minor syntax or
            semantic error.

  5 marks   Response with some merit
           Any other reasonable attempt.




(ii)                                                          10 marks (B-10 scale)

  10 marks  Correct response
             Correct insertion of row of asterisks in both locations

  8 marks   Almost correct response
             Correct implementation using solution above or similar but with minor syntax or
            semantic error

  5 marks   Response with some merit
           Any other reasonable attempt.





                                              17

<!-- PAGE 18 -->
# Page 18

![Page 18](../../../image_assets/marking_schemes/ordinary/computer_science_ordinary_2023_paper_1_marking_scheme_page_018.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(iii)                                                          10 marks (C-10 scale)

 10 marks  Correct response
             Correct implementation using solution above or similar.
           Note variable does not have to be cast to int  in the input statement for full
           marks
 7 marks   Almost correct response
             Correct implementation using solution above or similar but with minor syntax or
            semantic error.

 5 marks   Response about half-right
               Partially correct implementation using solution above or similar but with significant
             syntax or semantic error.
 3 marks   Response with some merit
           Any other reasonable attempt.





(iv)                                                          5 marks (B-5 scale)

 5 marks   Correct response
             Correct implementation using solution above or similar.

 3 marks   Almost correct response
             Correct implementation using solution above or similar but with minor syntax or
            semantic error.

 2 marks   Response with some merit
           Any other reasonable attempt.





(v)                                                          5 marks (A-5 scale)

 5 marks   Correct response
             Correct implementation using solution above or similar.

 2 marks   Response with some merit
           Any other reasonable attempt.





                                              18

<!-- PAGE 19 -->
# Page 19

![Page 19](../../../image_assets/marking_schemes/ordinary/computer_science_ordinary_2023_paper_1_marking_scheme_page_019.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(vi)                                                          5 marks (B-5 scale)


 5 marks   Correct response
             Correct implementation using solution above or similar.

 3 marks   Almost correct response
           Almost correct implementation using solution above or similar but with minor
             syntax error.

 2 marks   Response with some merit
           Any attempt at string concatenation, format function or similar





                                              19

<!-- PAGE 20 -->
# Page 20

![Page 20](../../../image_assets/marking_schemes/ordinary/computer_science_ordinary_2023_paper_1_marking_scheme_page_020.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(b)                                                               30 marks
Possible solution:
1  # Question 16(b)
2  # Examination Number:
3
4  # Display a welcome message
5  print("Welcome to Temperature Alert System")
6
7  # Ask the user to enter the temperature
8  temperature = int(input("Enter temperature value in degrees: "))
9
10 # Display a message based on the value of temperature
11 # If temperature is less than 20 degrees display too cold
12 if temperature <20:
13    print(" Too cold. Turn up heating.")
14 # Else if temperature is between 20 and 24 display just right
15 elif temperature>=20 and temperature <=24:
16    print("Temperature is just right.")
17 # Otherwise temperature must be above 24 degrees. Display too warm.
18 else:
19    print("Too warm. Turn down heating. ")





                                              20

<!-- PAGE 21 -->
# Page 21

![Page 21](../../../image_assets/marking_schemes/ordinary/computer_science_ordinary_2023_paper_1_marking_scheme_page_021.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

High level of achievement        Moderate level of        Low level of achievement
                          All of the following              achievement          Poor attempt to complete any
                implemented correctly and       Reasonable attempt to             of the following
                               efficiently             implement at least two of
                                               each of the following
                Program executes with     Program executes with     Program executes with
               no syntax or runtime       no syntax or runtime       no syntax or runtime
                   errors                        errors                        errors
                Program meets            Program meets            Program meets
Programming      requirements               requirements               requirements
  Standards      Program design is well      Program design is well      Program design is well
  (5 marks)
                  explained with              explained with              explained with
               comments               comments               comments
                Meaningful               Meaningful               Meaningful
                   variable/function names      variable/function names      variable/function names
                                       (5 marks)                        (4 marks)                        (3 marks)
                User correctly prompted    User correctly prompted    User correctly prompted
                  to enter a temperature       to enter a temperature       to enter a temperature
                  value in degrees Celsius      value in degrees Celsius      value in degrees Celsius
  Program      Temperature value         Temperature value         Temperature value
    Inputs         converted to integer         converted to integer         converted to integer
  (5 marks)      Variable initialisation       Variable initialisation       Variable initialisation
               and use of assignment      and use of assignment      and use of assignment
                 statements                 statements                 statements
                                       (5 marks)                        (4 marks)                         (3 mark)
                Conditional Logic          Conditional Logic          Conditional Logic
Program Logic    Use of                    Use of                    Use of
 (Processing)       relational/Boolean           relational/Boolean           relational/Boolean
  (10 marks)                  operators                   operators                   operators
                                   (10 marks)                        (7 marks)                        (5 marks)
                 Initial welcome message     Initial welcome message     Initial welcome message
                Output message 1: Too     Output message 1: Too     Output message 1: Too
                    cold. Turn up heating          cold. Turn up heating          cold. Turn up heating
  Program      Output message 2:         Output message 2:         Output message 2:
   Outputs       Temperature is just right     Temperature is just right     Temperature is just right
 (10 marks)     Output message 3: Too     Output message 3: Too     Output message 3: Too
               warm. Turn down          warm. Turn down          warm. Turn down
                  heating                     heating                     heating
                                   (10 marks)                        (7 marks)                        (5 marks)





                                             21

<!-- PAGE 22 -->
# Page 22

![Page 22](../../../image_assets/marking_schemes/ordinary/computer_science_ordinary_2023_paper_1_marking_scheme_page_022.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; text contains visual keywords -->

Coursework (90 marks in total)

# Source References

Exam paper:
- file: intermediate_markdown/exam_papers/ordinary/computer_science_ordinary_2023_section_c_exam.md
- pages: [4, 5, 6, 7, 8, 9, 10, 11, 12]

Marking scheme:
- file: intermediate_markdown/marking_schemes/ordinary/computer_science_ordinary_2023_paper_1_marking_scheme.md
- pages: [17, 18, 19, 20, 21, 22]

# Notes

