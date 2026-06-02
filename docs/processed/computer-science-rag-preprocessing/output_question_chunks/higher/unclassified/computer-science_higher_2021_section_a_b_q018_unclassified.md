---
subject: "Computer Science"
subject_id: "computer-science"
level: "Higher"
year: 2021
paper: "Section A B"
question_number: 18
section: "Question 13"
topic: "Unclassified"
secondary_topics: []
classification_type: "unclassified"
source_type: "past_paper_with_marking_scheme"
has_visual: true
visual_assets:
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2021_section_a_b_exam_page_014.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2021_section_a_b_exam_page_015.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2021_section_a_b_exam_page_016.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2021_section_a_b_exam_page_017.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2021_section_a_b_exam_page_018.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2021_section_a_b_exam_page_013.png"
source_exam_pages:
  - 13
  - 14
  - 15
  - 16
  - 17
  - 18
source_marking_scheme_pages:
  - 12
  - 13
  - 14
  - 15
  - 16
pairing_confidence: "high"
needs_review: false
review_reason: ""
---

# Question

Question 13

Eircode is the postal address code system used in Ireland to uniquely identify every individual
address in the country. An Eircode is a seven‐character code made up of two parts – a three‐
character Routing Key and a four‐character Unique Identifier.

The first character in the Routing Key must always be a letter, and the second and third characters
must always be digits.
Every character in the Unique Identifier must be alpha‐numeric i.e. either a letter or a number.

The format of the Eircode, A65 F4E2, is shown below in Figure 4.





                                          Figure 4

(a)   Explain why each of the following are not valid Eircodes.

        (i)   GA5 AOK1





        (ii)  X234 Y56





         (iii)  8XT A43Y





                                                          This question continues on the next page.


Leaving Certificate 2021                       13
Computer Science, Sections A & B – Higher level

<!-- PAGE 14 -->
# Page 14

![Page 14](../../../image_assets/exam_papers/higher/computer_science_higher_2021_section_a_b_exam_page_014.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; text contains visual keywords -->

(b)  The intention of the Python code shown below is to implement a validation check for an
      Eircode.

 1  def is_valid_eircode(test_eircode):
 2
 3  # This function checks whether 'test_eircode' is a valid Eircode or not
 4  # It returns True if 'test_eircode' is a valid Eircode. False otherwise.
 5
 6  # Uses:
 7  #    s.isalpha() -> True if s contains alphabetic only; False otherwise
 8  #    s.idigit()  -> True if s contains digits only; False otherwise
 9  #    s.isalnum() -> True if s contains alpha-numeric only; False otherwise
 10
 11   if not test_eircode[0].isalpha():
 12       return False
 13
 14   # if the second character isn’t a digit or the third character isn’t a
 15   # digit the Eircode is invalid so return False
 16   if ((not test_eircode[1].isdigit()) or (not test_eircode[2].isdigit())):
 17       return False
 18
 19   if not test_eircode[-4:].isalnum():
 20       return False
 21
 22   return True



        (i)   What is meant by the term ‘validation check’?





        (ii)   Outline briefly how a test case could be used to test the above code.





                                                          This question continues on the next page.




Leaving Certificate 2021                       14
Computer Science, Sections A & B – Higher level

<!-- PAGE 15 -->
# Page 15

![Page 15](../../../image_assets/exam_papers/higher/computer_science_higher_2021_section_a_b_exam_page_015.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(iii)  Two types of testing that could be performed on the code are unit testing and system
            testing. Distinguish between these two types of testing.





       (iv)   This Python code will show that the Eircode, A99 SP@M A1OK, is valid even though it is
            not. Why does the code indicate that this Eircode is valid?





      (v)   After code has been changed it is important to conduct regression testing. Why is this
          important?





                                                                   This question continues on the next page.


Leaving Certificate 2021                       15
Computer Science, Sections A & B – Higher level

<!-- PAGE 16 -->
# Page 16

![Page 16](../../../image_assets/exam_papers/higher/computer_science_higher_2021_section_a_b_exam_page_016.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; text contains visual keywords -->

(c)   The following questions are based on the code in part (b).

        (i)    Explain what the following code does:

 11 if not test_eircode[0].isalpha():
 12     return False





        (ii)   Consider the following statement from line 16.

 16 if ((not test_eircode[1].isdigit()) or (not test_eircode[2].isdigit())):

                 If we let P represent the possible boolean values for
        test_eircode[1].isdigit() and Q represent the possible boolean values for
        test_eircode[2].isdigit(), complete the truth table below for the
           expression, not P or not Q.

          P          Q        not P       not Q     not P or not Q

        False      False

        False       True

         True       False

         True       True



         (iii)  Using the same meanings for P and Q from part (ii) complete the truth table below for
          the expression, not (P and Q).

                 P          Q       P and Q   not (P and Q)

               False      False

               False       True

                True       False

                True       True





                                                                   This question continues on the next page.



Leaving Certificate 2021                       16
Computer Science, Sections A & B – Higher level

<!-- PAGE 17 -->
# Page 17

![Page 17](../../../image_assets/exam_papers/higher/computer_science_higher_2021_section_a_b_exam_page_017.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(iv)   Use your findings from parts (ii) and (iii) to re‐write the statement on line 16, without
            changing its logical meaning.

 16 if ((not test_eircode[1].isdigit()) or (not test_eircode[2].isdigit())):





      (v)     Explain how the technique of string slicing could be used to provide an alternative to
            the statement on line 16.

 16 if ((not test_eircode[1].isdigit()) or (not test_eircode[2].isdigit())):





Leaving Certificate 2021                       17
Computer Science, Sections A & B – Higher level

<!-- PAGE 18 -->
# Page 18

![Page 18](../../../image_assets/exam_papers/higher/computer_science_higher_2021_section_a_b_exam_page_018.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; page contains vector drawings; text contains visual keywords -->

# Marking Scheme

Question 13                                                   30 (3, 15, 12) marks

(a)                                                               3 (1, 1, 1) marks

        (i)                                                            1 mark
               •  The second character (‘A’) is not a digit.
               •  Any other valid reason.


        (ii)                                                            1 mark
               •  The routing key must be 3 characters (and not 4).
               •  The unique ID must be 4 characters (and not 3).
               •  The unique ID must be after the routing key .
               •  Any other valid reason.



         (iii)                                                          1 mark

               •  The first character (‘8’) is not a letter.
               •  The second character (‘X’) is not a digit.
               •  The third character (‘T’) is not a digit.
               •  Any other valid reason.



(b)                                                        15 (2, 2, 4, 2, 5) marks

        (i)                                                            2 marks

        A validation check is a test carried out by a program to make sure data is in the
           correct format. In the context of Eircode, a validation check will make sure it
          conforms to the rules for the Routing Key and the Unique Identifier provided at the
            start of the question.

       Good explanation - clear understanding demonstrated             2 marks





                                      12

<!-- PAGE 13 -->
# Page 13

![Page 13](../../../image_assets/marking_schemes/higher/computer_science_higher_2021_paper_1_marking_scheme_page_013.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(ii)                                                            2 marks

    A test case would be any value passed into the function.
     The test case e.g. 123 4568 would be passed into the function and the result would
     be compared to an expected result.
        If the Eircode was valid the result of the test case would be True; False otherwise.

   Good explanation - clear understanding demonstrated             2 marks



(iii)                                                           4 marks
Unit Testing
   •  Usually carried out by the programmer.
   •  The purpose of unit testing is to test specific units of code.
   •  Test cases are designed to trigger all execution paths in the code.
   •   Typically automated.
   •  A form of white box testing (as testers are familiar with the code being tested).

System Testing
   •  Usually carried out by testers.
   •  The overall aim of system testing is to determine that the system meets the user
      requirements (i.e. it does what it is supposed/designed to do).
   •  System testing includes testing how the system operates under certain abnormal
       conditions e.g. after a power cut, by cutting off internet access, under stressed
       conditions.
   •   Typically carried out by testers (proxies for end-users).
   •  A form of black box testing (as testers are unfamiliar with the code being tested).

     For each of Unit Testing/System Testing
    Good explanation - clear understanding demonstrated        2 marks



(iv)                                                           2 marks

     •  The function only looks at the first three characters and the last four characters –
             it does not check for length or look for any characters in between .

    Very good explanation - clear understanding demonstrated     2 marks





                                  13

<!-- PAGE 14 -->
# Page 14

![Page 14](../../../image_assets/marking_schemes/higher/computer_science_higher_2021_paper_1_marking_scheme_page_014.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(v)                                                            5 marks

          Regression testing is important because it ensures that a change to the code does
          not result in breaking some pieces of code that had already been tested. It ensures
           that no new bugs are introduced as a result of implementing a software update.

         Good explanation - clear understanding demonstrated        5 marks



(c)                                                        12 (2, 4, 3, 1, 2) marks

          (i)                                                           2 marks
        The Python code checks whether the first character of the Eircode passed in is a letter
         or not. If it is not a letter (A-Z or a-z) the condition will be True and the function will
         return False

       Good explanation - clear understanding demonstrated    2 marks


          (ii)                                                           4 marks

     P          Q         not P      not Q      not P or not Q
        False           False        True          True          True
        False         True        True           False         True
       True           False         False         True          True
       True          True          False          False          False


        1 Mark per correct row
       OR
        2 Marks for 1st fully correct column
        1 Mark for 2nd and 3rd correct column
       OR
        1 mark for more than 2 correct values in each column





                                      14

<!-- PAGE 15 -->
# Page 15

![Page 15](../../../image_assets/marking_schemes/higher/computer_science_higher_2021_paper_1_marking_scheme_page_015.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(iii)                                                          3 marks

           P          Q         P and Q    not (P and Q)
               False           False         False         True
               False         True          False         True
              True           False         False         True
              True          True        True           False

         Every value correct                  3 marks
        1 mark for each correct row (up to a max. of 2)
        1 mark for more than 2 correct values in each column
        1 mark for any correct value

        (iv)                                                          1 mark

if not (test_eircode[1].isdigit() and test_eircode[2].isdigit()):
OR
if not (P and Q):

                      Correct response          1 mark

        (v)                                                           2 marks
           Slicing could be used to extract the 2nd and 3rd characters and test them together (as a
            slice) for digits (as opposed to testing them individually).
OR

        if not (test_eircode[1:3].isdigit()):

         Very good explanation - clear understanding demonstrated     2 marks





                                      15

<!-- PAGE 16 -->
# Page 16

![Page 16](../../../image_assets/marking_schemes/higher/computer_science_higher_2021_paper_1_marking_scheme_page_016.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

# Source References

Exam paper:
- file: intermediate_markdown/exam_papers/higher/computer_science_higher_2021_section_a_b_exam.md
- pages: [13, 14, 15, 16, 17, 18]

Marking scheme:
- file: intermediate_markdown/marking_schemes/higher/computer_science_higher_2021_paper_1_marking_scheme.md
- pages: [12, 13, 14, 15, 16]

# Notes

