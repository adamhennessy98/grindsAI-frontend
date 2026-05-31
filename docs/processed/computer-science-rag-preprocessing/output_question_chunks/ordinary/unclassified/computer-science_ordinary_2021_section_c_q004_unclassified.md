---
subject: "Computer Science"
subject_id: "computer-science"
level: "Ordinary"
year: 2021
paper: "Section C"
question_number: 4
section: "Question 16"
topic: "Unclassified"
secondary_topics: []
classification_type: "unclassified"
source_type: "past_paper_with_marking_scheme"
has_visual: true
visual_assets:
  - "../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2021_section_c_exam_page_004.png"
  - "../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2021_section_c_exam_page_005.png"
  - "../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2021_section_c_exam_page_006.png"
  - "../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2021_section_c_exam_page_007.png"
  - "../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2021_section_c_exam_page_003.png"
source_exam_pages:
  - 3
  - 4
  - 5
  - 6
  - 7
  - 8
source_marking_scheme_pages:
  - 15
  - 16
  - 17
  - 18
  - 19
  - 20
pairing_confidence: "high"
needs_review: false
review_reason: ""
---

# Question

Question 16

(a)  Open the program called Question16_A.py from your device.
     The source code is shown and described briefly below.

     Before making any changes, you should save your working
     copy of the file using the format
     CandidateNumberQuestion16_A.py. For example, you
     would save the file as 123456Question16_A.py if your
     candidate number was 123456.

     Enter your Examination Number in the space provided on line 2 in your Python file.

     The program below is for a simple Automatic Teller Machine (ATM). An ATM allows banking
     customers to withdraw money from their accounts provided they enter the correct Personal
      Identification Number (PIN). When the user enters the correct PIN, a message appears
      saying “Welcome”.

    1  # Question 16(a)
    2  # Examination Number:
    3
    4  pin = "1579"
    5
    6  userTry = input("Enter PIN:")
    7
    8  if userTry == pin:
    9      print("Welcome")

    Make the following changes to the program:

        (i)    Insert a comment in the appropriate location to explain what the input command is
          doing in this program.


        (ii)  Amend the program so that the following message is displayed if an incorrect PIN is
           entered:

         Incorrect PIN

         (iii)  Create a suitably named Boolean variable (e.g. loggedIn) that is initially set to
        False before the user enters a PIN.

       (iv)  Amend the program so that the new Boolean variable is set to True when the user
           enters the correct PIN.





Leaving Certificate – 2021                      3
Computer Science, Section C – Ordinary level

<!-- PAGE 4 -->
# Page 4

![Page 4](../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2021_section_c_exam_page_004.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(v)   Using a while loop or similar, keep asking the user to enter their PIN until they have
          entered it correctly.

        When the program is run the output may look as follows:

        Enter PIN:1234
        Incorrect PIN
        Enter PIN:1456
        Incorrect PIN
        Enter PIN:1579
        Welcome


       (vi)  Create a suitably named variable (e.g. failedAttempts) that is initially set to 0
          before the user enters a PIN. This variable will keep track of the number of failed login
           attempts.



       (vii)  The user should only be allowed 3 failed login attempts. If the PIN is entered
            incorrectly 3 times an appropriate message should be displayed.

        When the program is run the output may look as follows:

        Enter PIN:1111
        Incorrect PIN
        Enter PIN:2222
        Incorrect PIN
        Enter PIN:3333
        Incorrect PIN
        You have entered the PIN incorrectly 3 times.



     Save your file using the format CandidateNumberQuestion16_A.py. For example, you would
     save the file as 123456Question16_A.py if your candidate number was 123456.





Leaving Certificate – 2021                      4
Computer Science, Section C – Ordinary level

<!-- PAGE 5 -->
# Page 5

![Page 5](../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2021_section_c_exam_page_005.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

Space for rough work.

                             This page will not be reviewed by an examiner.





Leaving Certificate – 2021                      5
Computer Science, Section C – Ordinary level

<!-- PAGE 6 -->
# Page 6

![Page 6](../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2021_section_c_exam_page_006.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

Space for rough work.

                             This page will not be reviewed by an examiner.





Leaving Certificate – 2021                      6
Computer Science, Section C – Ordinary level

<!-- PAGE 7 -->
# Page 7

![Page 7](../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2021_section_c_exam_page_007.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

Space for rough work.

                             This page will not be reviewed by an examiner.





Leaving Certificate – 2021                      7
Computer Science, Section C – Ordinary level

<!-- PAGE 8 -->
# Page 8

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; text contains visual keywords -->

Acknowledgements

Images
Image: page 3: www.thejournal.ie/atm‐use‐poll‐3465721‐Jun2017/





Copyright notice
This examination paper may contain text or images for which the State Examinations Commission is not the copyright
owner, and which may have been adapted, for the purpose of assessment, without the authors’ prior consent. This
examination paper has been prepared in accordance with Section 53(5) of the Copyright and Related Rights Act, 2000.
Any subsequent use for a purpose other than the intended purpose is not authorised. The Commission does not
accept liability for any infringement of third‐party rights arising from unauthorised distribution or use of this
examination paper.





Leaving Certificate – Ordinary Level
Computer Science – Section C
Leaving Certificate – 2021                      8Saturday 22 MayComputer Science, Section C – Ordinary level
Morning 11:30 – 12:30

# Marking Scheme

Question 16                                                        50 marks

(a)                                                 50 (5, 10, 5, 5, 10, 5, 10) marks
Possible solution:
1  # Question 16(a)
2  # Examination Number:
3
4  pin = "1579"
5  loggedIn = False
6  failedAttempts = 0
7
8  while not loggedIn and (failedAttempts < 3):
9      #input command is asking the user for a PIN
10     userTry = input("Enter PIN:")
11
12     if userTry == pin:
13         print("Welcome")
14         loggedIn = True
15     else:
16         print("Incorrect PIN")
17         failedAttempts += 1
18
19 if failedAttempts >= 3:
20     print("You have entered the PIN incorrectly", failedAttempts, "times.")


(i)                                                           5 marks (A-5 scale)
      5 marks      Correct response
                    Correct implementation using solution above or similar.
      3 marks     Almost correct response
               Comment in inappropriate location.
      2 mark      Response with some merit
                 Any reasonable attempt at inserting a comment.



(ii)                                                          10 marks (A-10 scale)
      10 marks     Correct response
                    Correct implementation using solution above or similar (included else
                 and a print statement).
      7 marks     Almost correct response
                  Almost correct implementation using solution above or similar (included
                      else and print statement) but with minor syntax error.
      3 mark      Response with some merit
                  Attempted use of print that shows output to user indicating incorrect
                       pin.


                                       15

<!-- PAGE 16 -->
# Page 16

![Page 16](../../../image_assets/marking_schemes/ordinary/computer_science_ordinary_2021_paper_1_marking_scheme_page_016.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(iii)                                                          5 marks (A-5 scale)
      5 marks      Correct response
                    Correct implementation using solution above or similar.
      3 marks     Almost correct response
                    Correct implementation using solution above or similar but with minor
                    syntax or semantic error.
      2 mark      Response with some merit
                  Attempt that indicates limited knowledge of Boolean.




(iv)                                                          5 marks (A-5 scale)
      5 marks      Correct response
                    Correct implementation using solution above or similar.
      3 marks     Almost correct response
                    Correct implementation using solution above or similar but with minor
                    syntax or semantic error.
      2 mark      Response with some merit
                  Attempt to set the Boolean variable but with logical error e.g. in the
                 wrong place.




(v)                                                          10 marks (A-10 scale)
      10 marks     Correct response
                    Correct implementation using solution above or similar.
      7 marks     Almost correct response
                    Correct implementation using solution above or similar but with minor
                    syntax or semantic error.
                    Correct implementation using solution above or similar but output is
                     incorrect e.g. does not state incorrect PIN or ask user to enter PIN.
      3 mark      Response with some merit
                  Attempted to use a loop but with some logical errors and syntax errors in
                           its implementation.





                                      16

<!-- PAGE 17 -->
# Page 17

![Page 17](../../../image_assets/marking_schemes/ordinary/computer_science_ordinary_2021_paper_1_marking_scheme_page_017.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(vi)                                                          5 marks (A-5 scale)
      5 marks      Correct response
                    Correct implementation using solution above or similar.
      3 marks     Almost correct response
                    Correct implementation using solution above or similar but with minor
                    syntax or semantic error.
      2 mark      Response with some merit
                  Attempt to set the variable but with logical error e.g. in the wrong place.




(vii)                                                         10 marks (B-10 scale)
      10 marks     Correct response
                    Correct implementation using solution above or similar for both cases
                      (successful login or total many attempts).
      8 marks     Almost correct response
                    Correct implementation using solution above or similar for both cases
                      (successful login or total many attempts) but with minor syntax error.
                 Any three of:
                   •  while loop modified
                   •  failedAttempts incremented
                   •  if statement line 19
                   •  print statement
      5 marks     Response about half-right
                  Attempted calculation of number of failed attempts.
                 Any two of:
                   •  while loop modified
                   •  failedAttempts incremented
                   •  if statement line 19
                   •  print statement
      3 mark      Response with some merit
                 Any one of:
                   •  while loop modified
                   •  failedAttempts incremented
                   •  if statement line 19
                   •  print statement





                                      17

<!-- PAGE 18 -->
# Page 18

![Page 18](../../../image_assets/marking_schemes/ordinary/computer_science_ordinary_2021_paper_1_marking_scheme_page_018.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

Coursework (90 marks in total)
Description                                                            Marks
                     Quality of report structure and layout; evidence of student’sPresentation of                  adherence to the principles of good user interface design when       5report                     creating the website.
A rationale for the approach to the brief
                 Shows evidence of research and investigation of the context andResearch                   the task.                                                                          10Response to the     Clearly explains choices made; offers clear rationale behind the
brief                 overall design approach.
The artefact (design, development and operation)
                  The artefact is consistent with the context and theme of the brief.
Meeting the brief   The requirements of the brief are met; identified end-user needs     10
                    are met.
Iterative design     Presents a design timeline with justification of key decisions;                                                                          15process              explains the iterative design approach adopted.
                  The construction of the artefact shows skills such as abstraction,Computational                    decomposition, algorithmic thinking, evaluation and testing.thinking and                                                                15                  The ability to systematically address and solve problems thrownproblem solving                 up in the implementation of the design are clearly demonstrated.
                  Fundamental skills are demonstrated, such as using a modular
                    approach, using high level data structures, testing and debugging,Programming skills                                                           15                   minimal duplication of code, readability, effective use of
                  commenting.
Use of computing   Shows an awareness of adaptive technology; creative and
technologies and    appropriate use of technology; an awareness of core computer                                                                          10awareness of        science concepts. Demonstrates an awareness of the end-user(s)
social impacts      and potential social impacts.
Evaluation
                     Explains the extent to which the artefact meets the designReflection                    ambition; how well the needs of the envisaged end user are met.                                                                          10Future              Describes with justification how the artefact could be modified
development       and improved.
References
References        You must also include references and/or a bibliography.             0
Summary word count
Summary word      Include a summary of the word count of the report, including the                                                                           0count                 total word count.





                                      18

<!-- PAGE 19 -->
# Page 19

![Page 19](../../../image_assets/marking_schemes/ordinary/computer_science_ordinary_2021_paper_1_marking_scheme_page_019.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

Mark                                                                 Mark         Mark                                   Highergrade           grade                                                                                             Higher                                                                        Ordinary                                                                      Ordinary                                                                                                              Reference

                  1              81 – 90   81 – 90     90
                  2              72 – 80   72 – 80     90
                  3              63 – 71   63 – 71     90
                  4              54 – 62   54 – 62     90
                  5        1     45 – 53   45 – 53   81 – 90
                  6        2     36 – 44   36 – 44   72 – 80
                  7        3     27 – 35   27 – 35   63 – 71
                           4     23 – 26   23 – 26   54 – 62
                           5     18 – 22   18 – 22   45 – 53
                  8        6     14 – 17   14 – 17   36 – 44
                           7      9 – 13    9 – 13   27 – 35
                           8      0 – 8     0 – 8     0 - 26

COURSEWORK – conversion from reference mark to Ordinary-level mark
For Ordinary-level candidates, the final mark is found from the reference mark as follows:
•    If the reference mark is 54 or more the final mark is 90.
•    If the reference mark is at least 27 but less than 54, then add 36 to the reference mark to get
    the final mark.
•    If the reference is at least 1 but less than 27, then double the reference mark and add 9 to get
    the final mark.
•    If the reference mark is 0 the final mark is 0
      Reference Mark                            Conversion
        54 or more                         Award 90 marks
          27 – 53                           Add 36 marks
          1 - 26                  Multiply the reference mark by 2 and add 9 marks
            0                                    0





                                      19

<!-- PAGE 20 -->
# Page 20

![Page 20](../../../image_assets/marking_schemes/ordinary/computer_science_ordinary_2021_paper_1_marking_scheme_page_020.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; text extraction is sparse relative to visible page content -->

20

# Source References

Exam paper:
- file: intermediate_markdown/exam_papers/ordinary/computer_science_ordinary_2021_section_c_exam.md
- pages: [3, 4, 5, 6, 7, 8]

Marking scheme:
- file: intermediate_markdown/marking_schemes/ordinary/computer_science_ordinary_2021_paper_1_marking_scheme.md
- pages: [15, 16, 17, 18, 19, 20]

# Notes

