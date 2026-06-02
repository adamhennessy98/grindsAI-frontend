---
subject: "Computer Science"
subject_id: "computer-science"
level: "Ordinary"
year: 2022
paper: "Section C"
question_number: 4
section: "Question 16"
topic: "Computer Systems"
secondary_topics: []
classification_type: "topic_specific"
source_type: "past_paper_with_marking_scheme"
has_visual: true
visual_assets:
  - "../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2022_section_c_exam_page_005.png"
  - "../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2022_section_c_exam_page_006.png"
  - "../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2022_section_c_exam_page_007.png"
  - "../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2022_section_c_exam_page_004.png"
source_exam_pages:
  - "4"
  - "5"
  - "6"
  - "7"
  - "8"
source_marking_scheme_pages:
  - "17"
  - "18"
  - "19"
  - "20"
pairing_confidence: "high"
topic_confidence: "medium"
classification_source: "fallback_rules"
candidate_topics:
  - "Computer Systems"
needs_review: false
review_reason: ""
---


# Question

Question 16

(a)  Open the program called Question16_A.py from your device. The source code is shown and
     described briefly below.

     Before making any changes, you should save your working copy of the file using the format
     ExaminationNumberQuestion16_A.py. For example, you would save the file as
     123456Question16_A.py if your Examination Number was 123456.

     Enter your Examination Number in the space provided on line 2 in your Python file.

     1  # Question 16 (a)
     2  # Examination Number:
     3
     4  firstName = input("What is your first name? ")
     5
     6  print("Hello", firstName)
     7  print("Please select from the list of items.\n")
     8  # \n creates a new line
     9
     10 print("\tItems Available")  # \t creates a tab
     11 print("1 = Book")
     12
     13 shoppingItem = int(input("\nEnter the number of the item you
        would like: "))
     14
     15 if shoppingItem == 1:
     16     print("You bought a book")
     17


     The program above is to simulate an automated shop. The aim of the program is to accept
     the name of the user and then to ask the user to choose what item they would like to buy.
     The user will select the number of the item they wish to buy and the program outputs a
     message confirming the item they chose.





                                                          This question continues on the next page.



Leaving Certificate 2022                       4
Computer Science, Section C – Ordinary level

<!-- PAGE 5 -->
# Page 5

![Page 5](../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2022_section_c_exam_page_005.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

Make the following changes to the program:

        (i)    Insert a comment in an appropriate place to say “user enters first name”.



        (ii)  Amend the program to ask for and accept the user's surname. Store the user’s
         surname in a variable called surname.

        When the program is run the output may now look as follows:

        What is your first name? Mary
        What is your surname? Murphy



         (iii)  Amend the program so that the user’s first name and their surname are printed when
          they are asked to select their item.

        When the program is run the output may now look as follows:

        What is your first name? Mary
        What is your surname? Murphy
        Hello Mary Murphy
        Please select from the list of items.


       (iv)  Amend the program so that the items 2 = Ruler and 3 = Pen appear in the
          shopping list under the item 1 = Book.

        When the program is run the output may now look as follows:

            Items Available
        1 = Book
        2 = Ruler
        3 = Pen



       (v)  Amend the program so that a dashed line appears above and below the available
           items.

        When the program is run the output may now look as follows:

            Items Available
        ----------------------
        1 = Book
        2 = Ruler
        3 = Pen
        ----------------------



                                                          This question continues on the next page.





Leaving Certificate 2022                       5
Computer Science, Section C – Ordinary level

<!-- PAGE 6 -->
# Page 6

![Page 6](../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2022_section_c_exam_page_006.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(vi)  Amend the program so that the correct message is printed if the user purchases a ruler
           or pen.

        When the program is run the output may now look as follows:

        Enter the number of the item you would like: 2
        You bought a ruler



       (vii) Amend the program to deal with invalid number entries. If the user enters any number
           other than the numbers 1, 2 or 3 they should be presented with an error message.

        When the program is run the output may now look as follows:

        Enter the number of the item you would like: 5
        Invalid choice. Goodbye.


Save your file using the format ExaminationNumberQuestion16_A.py. For example, you would
save the file as 123456Question16_A.py if your Examination Number was 123456.





Leaving Certificate 2022                       6
Computer Science, Section C – Ordinary level

<!-- PAGE 7 -->
# Page 7

![Page 7](../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2022_section_c_exam_page_007.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

Space for rough work.

                             This page will not be reviewed by an examiner.





Leaving Certificate 2022                       7
Computer Science, Section C – Ordinary level

<!-- PAGE 8 -->
# Page 8

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; page contains vector drawings -->

Do not hand this up.

         This document will not be returned to the
             State Examinations Commission.





Copyright notice
This examination paper may contain text or images for which the State Examinations Commission is not the copyright
owner, and which may have been adapted, for the purpose of assessment, without the authors’ prior consent. This
examination paper has been prepared in accordance with Section 53(5) of the Copyright and Related Rights Act, 2000.
Any subsequent use for a purpose other than the intended purpose is not authorised. The Commission does not
accept liability for any infringement of third-party rights arising from unauthorised distribution or use of this
examination paper.





Leaving Certificate – Ordinary Level
Computer Science – Section C
Leaving Certificate 2022                       8Wednesday 25 MayComputer Science, Section C – Ordinary level
Morning 11:30 – 12:30

# Marking Scheme

Question 16                                                        50 marks

(a)                                                 50 (5, 10, 5, 5, 5, 10, 10) marks
Possible solution:

     1  # Question 16 (a)
     2  # Examination Number:
     3  # user enters first name
     4  firstName = input("What is your first name? ")
     5  surname = input("What is your surname? ")
     6
     7  print("Hello", firstName, surname, "please select from the list
        of items.\n")
     8  # \n creates a new line
     9
     10 # List of items in shop
     11 print("\tItems Available")  # \t creates a tab
     12 print("----------------------")
     13 print("1 = Book")
     14 print("2 = Ruler")
     15 print("3 = Pen")
     16 print("----------------------")
     17
     18 shoppingItem = int(input("\nEnter the number of the item would
        you like: "))
     19
     20 if shoppingItem == 1:
     21     print("You bought a book")
     22 elif shoppingItem == 2:
     23     print("You bought a ruler")
     24 elif shoppingItem == 3:
     25     print("You bought a pen")
     26 else:
     27     print("Invalid choice. Goodbye")





                                       17

<!-- PAGE 18 -->
# Page 18

![Page 18](../../../image_assets/marking_schemes/ordinary/computer_science_ordinary_2022_paper_1_marking_scheme_page_018.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(i)                                                           5 marks (A-5 scale)

      5 marks      Correct response
                    Correct implementation using solution above or similar.
      3 marks      Almost correct response
               Comment in inappropriate location.
      2 mark      Response with some merit
                 Any reasonable attempt at inserting a comment.




(ii)                                                          10 marks (A-10 scale)

      10 marks     Correct response
                    Correct implementation using solution above or similar (using input only
                    or print and input commands).
      7 marks      Almost correct response
                  Almost correct implementation using solution above or similar but with
                  minor syntax error.
                    Correct solution but variable is not called surname
      3 mark      Response with some merit
                  Attempted use of input to attempt to take in the users surname.




(iii)                                                          5 marks (A-5 scale)

      5 marks      Correct response
                    Correct implementation using solution above or similar.
      3 marks      Almost correct response
                    Correct implementation using solution above or similar but with minor
                    syntax or semantic error.
      2 mark      Response with some merit
                  Attempt that shows some limited knowledge of print statements.




(iv)                                                          5 marks (A-5 scale)

      5 marks      Correct response
                    Correct implementation using solution above or similar.
      3 marks      Almost correct response
                    Correct implementation using solution above or similar but with minor
                    syntax or semantic error.
      2 mark      Response with some merit
                  Attempt at adding print statements to the appropriate place.





                                       18

<!-- PAGE 19 -->
# Page 19

![Page 19](../../../image_assets/marking_schemes/ordinary/computer_science_ordinary_2022_paper_1_marking_scheme_page_019.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(v)                                                          5 marks (A-5 scale)

      5 marks      Correct response
                    Correct implementation using solution above or similar.
      3 marks      Almost correct response
                    Correct implementation using solution above or similar but with minor
                    syntax or semantic error.
      2 mark      Response with some merit
                  Attempt at adding in the dividers to the list.





(vi)                                                          10 marks (A-10 scale)

      10 marks     Correct response
                    Correct implementation using solution above or similar.
      7 marks      Almost correct response
                    Correct implementation using solution above or similar but with minor
                    syntax or semantic error. Attempt at adding 2 if or elif statements to
                  complete the task.
      3 mark      Response with some merit
                  Attempt at adding 1 if statement or elif statement to complete the task


(vii)                                                          10 marks (A-10 scale)



      10 marks     Correct response
                    Correct implementation using solution above or similar.
      7 marks      Almost correct response
                    Correct implementation using solution above or similar but with minor
                    syntax or semantic error.
      3 mark      Response with some merit
                  Attempt at using an else statement or equivalent to error check.





                                       19

<!-- PAGE 20 -->
# Page 20

![Page 20](../../../image_assets/marking_schemes/ordinary/computer_science_ordinary_2022_paper_1_marking_scheme_page_020.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; text contains visual keywords -->

Coursework (90 marks in total)

# Source References

Exam paper:
- file: intermediate_markdown/exam_papers/ordinary/computer_science_ordinary_2022_section_c_exam.md
- pages: [4, 5, 6, 7, 8]

Marking scheme:
- file: intermediate_markdown/marking_schemes/ordinary/computer_science_ordinary_2022_paper_1_marking_scheme.md
- pages: [17, 18, 19, 20]

# Notes

