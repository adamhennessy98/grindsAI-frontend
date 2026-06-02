---
subject: "Computer Science"
subject_id: "computer-science"
level: "Higher"
year: 2022
paper: "Section C"
question_number: 4
section: "Question 16"
topic: "Mixed"
secondary_topics:
  - "Computer Systems"
  - "Modelling and Simulation"
classification_type: "mixed_topic"
source_type: "past_paper_with_marking_scheme"
has_visual: true
visual_assets:
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2022_section_c_exam_page_005.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2022_section_c_exam_page_006.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2022_section_c_exam_page_007.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2022_section_c_exam_page_008.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2022_section_c_exam_page_009.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2022_section_c_exam_page_010.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2022_section_c_exam_page_011.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2022_section_c_exam_page_004.png"
source_exam_pages:
  - "4"
  - "5"
  - "6"
  - "7"
  - "8"
  - "9"
  - "10"
  - "11"
  - "12"
source_marking_scheme_pages:
  - "20"
  - "21"
  - "22"
  - "23"
pairing_confidence: "high"
topic_confidence: "medium"
classification_source: "fallback_rules"
candidate_topics:
  - "Computer Systems"
  - "Modelling and Simulation"
needs_review: false
review_reason: ""
---


# Question

Question 16

(a)  Open the program called Question16_A.py from your device. The
     source code is shown below.

     Before making any changes, you should save your working copy of
     the file using the format ExaminationNumberQuestion16_A.py.
     For example, you would save the file as 123456Question16_A.py if
     your Examination Number was 123456.

     Enter your Examination Number in the space provided on line 2 in
     your Python file.


     The program simulates the rolling of a die 100 times.

     The result of each roll (throw) is stored in a variable called throw_result. Each of the 100
      results are appended to a list called results as they are generated.

     The program also contains code to keep track of the number of times a one and a two are
      rolled. These are stored in a list called frequencies.

 1  # Question 16(a)
 2  # Examination Number:
 3  from random import randint
 4
 5  print("Dice simulation program")
 6  results = []
 7  frequencies = [0, 0, 0, 0, 0, 0]
 8
 9  # Loop 100 times
 10 for i in range (100):
 11     throw_result = randint(1,6) # store a random value between 1 and 6
 12     results.append(throw_result) # append each value to results
 13
 14     # Start to build up a list of frequencies for each value thrown
 15     if throw_result == 1:
 16         frequencies[0] = frequencies[0] + 1
 17     elif throw_result == 2:
 18         frequencies[1] = frequencies[1] + 1
 19
 20 print()
 21 print("Results:", results)


                                                          This question continues on the next page.





Leaving Certificate 2022
Computer Science, Section C – Higher level           4

<!-- PAGE 5 -->
# Page 5

![Page 5](../../../image_assets/exam_papers/higher/computer_science_higher_2022_section_c_exam_page_005.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

When the program is run, the output may look as follows:
     (Your output will be different because the dice numbers are generated randomly.)

    Dice simulation program

    Results: [1, 4, 1, 4, 2, 3, 2, 2, 2, 4, 3, 1, 6, 1, 3, 3, 5,
    1, 1, 3, 2, 2, 4, 1, 6, 4, 4, 5, 2, 2, 4, 2, 1, 2, 4, 2, 6, 6,
    5, 4, 3, 5, 5, 1, 1, 6, 5, 1, 3, 3, 5, 3, 1, 5, 3, 5, 3, 2, 1,
    1, 1, 1, 4, 2, 5, 6, 4, 3, 4, 6, 4, 5, 2, 5, 5, 3, 1, 5, 4, 3,
    2, 2, 6, 2, 2, 3, 3, 2, 3, 1, 5, 2, 5, 4, 6, 4, 3, 5, 5, 2]



Make the following changes to the program:

(i)    Currently the first line in the program output is Dice simulation program.

     Change the program so that the first line in the output is Dice simulation and analysis
     program.

    When the program is run the output may now look as follows:

    Dice simulation and analysis program

    Results: [1, 4, 1, 5, 3, 6, 2, 6, 6, 1, 3, 6, 4, 5, 1, 2, 5,
    3, 5, 6, 5, 6, 5, 3, 3, 3, 4, 1, 2, 6, 1, 2, 4, 4, 6, 2, 4, 6,
    5, 3, 4, 6, 4, 1, 4, 5, 6, 1, 1, 3, 5, 6, 6, 1, 2, 2, 5, 4, 3,
    2, 6, 2, 2, 2, 2, 1, 2, 3, 4, 3, 3, 4, 3, 1, 6, 4, 1, 2, 4, 1,
    3, 4, 1, 5, 3, 3, 5, 4, 4, 1, 2, 4, 4, 5, 6, 5, 6, 1, 5, 3]



(ii)   Insert a new line of code at the end of the program to display the list of dice frequencies.

    When the program is run the output may now look as follows:

    Dice simulation and analysis program

    Results: [1, 3, 5, 1, 5, 1, 2, 4, 2, 5, 5, 5, 6, 4, 1, 1, 6,
    4, 2, 1, 2, 6, 5, 3, 6, 5, 3, 6, 3, 3, 2, 1, 4, 2, 3, 4, 6, 6,
    3, 3, 6, 5, 6, 6, 6, 5, 3, 2, 1, 3, 3, 6, 1, 4, 2, 5, 6, 4, 2,
    1, 6, 6, 6, 4, 2, 2, 4, 5, 6, 3, 2, 6, 2, 2, 3, 3, 3, 1, 5, 6,
    3, 6, 2, 5, 5, 1, 4, 5, 4, 1, 5, 4, 6, 4, 4, 5, 3, 3, 1, 4]
    Frequencies: [14, 15, 0, 0, 0, 0]

     The frequencies list tells us that the number one has been rolled 14 times and the number
     two has been rolled 15 times.

     The frequencies for the numbers three, four, five and six are not calculated by the program
      yet. This is the reason they are all zero.



                                                          This question continues on the next page.





Leaving Certificate 2022
Computer Science, Section C – Higher level           5

<!-- PAGE 6 -->
# Page 6

![Page 6](../../../image_assets/exam_papers/higher/computer_science_higher_2022_section_c_exam_page_006.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; text contains visual keywords -->

(iii)  Complete the code to calculate the frequencies for the numbers three, four, five and six.

    When the program is run the output may now look as follows:

    Dice simulation and analysis program

    Results: [2, 4, 6, 2, 1, 4, 1, 3, 1, 3, 3, 6, 5, 5, 4, 3, 2,
    2, 2, 1, 3, 4, 4, 3, 4, 6, 4, 2, 3, 1, 3, 3, 1, 5, 3, 3, 6, 5,
    4, 6, 1, 5, 3, 4, 2, 1, 6, 6, 5, 2, 6, 4, 5, 2, 2, 6, 6, 5, 5,
    6, 2, 3, 5, 6, 4, 1, 6, 2, 2, 6, 2, 6, 3, 3, 4, 2, 5, 5, 5, 3,
    1, 2, 3, 4, 2, 6, 2, 1, 5, 6, 6, 2, 5, 2, 3, 2, 5, 2, 2, 6]
    Frequencies: [11, 23, 18, 13, 16, 19]

      In this case the frequencies list tells us that the number one has been rolled 11 times, the
    number two has been rolled 23 times, the number three has been rolled 18 times, the
    number four has been rolled 13 times, the number five has been rolled 16 times and the
    number six has been rolled 19 times.



(iv)  Comment out the line that displays the list of individual results.

    When the program is run the output may now look as follows:
    Dice simulation and analysis program

    Frequencies: [17, 21, 17, 18, 11, 16]



(v)   Extend the program to display the frequency of each number in a tabular format as shown in
     the sample output here.
    Dice simulation and analysis program

    Frequencies: [15, 10, 25, 15, 15, 20]
    Dice Frequency
    ---- ---------
    1     15
    2     10
    3     25
    4     15
    5     15
    6     20


                                                          This question continues on the next page.





Leaving Certificate 2022
Computer Science, Section C – Higher level           6

<!-- PAGE 7 -->
# Page 7

![Page 7](../../../image_assets/exam_papers/higher/computer_science_higher_2022_section_c_exam_page_007.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; text contains visual keywords -->

(vi)  Extend the program so that it determines and displays the number that was rolled most
     often along with its frequency. For example, in the output below the number five was rolled
     most often (25 times). You can ignore the possibility of ties.

    When the program is run the output may now look as follows:
     Dice simulation and analysis program

     Frequencies: [16, 14, 12, 20, 25, 13]
     Dice Frequency
     ---- ---------
     1     16
     2     14
     3     12
     4     20
     5     25
     6     13

     5 was rolled the most often (25 times)


(vii)  Extend the program to display a horizontal bar chart of the frequencies.

     The number of asterisks (*) in each row should correspond to each frequency. For example,
      in the output below there are eight asterisks in row one because the frequency for the
    number one is eight.

     Each asterisk (*) can be printed using the single statement: print("*", end="")

    When the program is run the output may now look as follows:
     Dice simulation and analysis program

     Dice frequencies: [8, 12, 22, 26, 22, 10]
     Dice Frequency
     ---- ---------
     1     8
     2     12
     3     22
     4     26
     5     22
     6     10

     4 was rolled most often - 26 times

     ********
     ************
     **********************
     ****************************
     **********************
     **********


Save your file using the format ExaminationNumberQuestion16_A.py. For example, you would
save the file as 123456Question16_A.py if your Examination Number was 123456.



Leaving Certificate 2022
Computer Science, Section C – Higher level           7

<!-- PAGE 8 -->
# Page 8

![Page 8](../../../image_assets/exam_papers/higher/computer_science_higher_2022_section_c_exam_page_008.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

Space for rough work.

                                  This page will not be reviewed by an examiner.





Leaving Certificate 2022
Computer Science, Section C – Higher level           8

<!-- PAGE 9 -->
# Page 9

![Page 9](../../../image_assets/exam_papers/higher/computer_science_higher_2022_section_c_exam_page_009.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

Space for rough work.

                                  This page will not be reviewed by an examiner.





Leaving Certificate 2022
Computer Science, Section C – Higher level           9

<!-- PAGE 10 -->
# Page 10

![Page 10](../../../image_assets/exam_papers/higher/computer_science_higher_2022_section_c_exam_page_010.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

Space for rough work.

                                  This page will not be reviewed by an examiner.





Leaving Certificate 2022
Computer Science, Section C – Higher level          10

<!-- PAGE 11 -->
# Page 11

![Page 11](../../../image_assets/exam_papers/higher/computer_science_higher_2022_section_c_exam_page_011.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

Space for rough work.

                                  This page will not be reviewed by an examiner.





Leaving Certificate 2022
Computer Science, Section C – Higher level          11

<!-- PAGE 12 -->
# Page 12

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; page contains vector drawings; text contains visual keywords -->

Acknowledgements

   Images
   Image on P. 4: https://freesvg.org/vector-image-of-game-dice-close-up





               Do not hand this up.

          This document will not be returned to the
               State Examinations Commission.





   Copyright notice
    This examination paper may contain text or images for which the State Examinations Commission is not the
    copyright owner, and which may have been adapted, for the purpose of assessment, without the authors’
    prior consent. This examination paper has been prepared in accordance with Section 53(5) of the Copyright
   and Related Rights Act, 2000. Any subsequent use for a purpose other than the intended purpose is not
    authorised. The Commission does not accept liability for any infringement of third-party rights arising from
   unauthorised distribution or use of this examination paper.





Leaving Certificate – Higher Level
Computer Science – Section C
Wednesday 25 May
Morning 11:30 – 12:30

# Marking Scheme

Question 16


(a)                                                 50 (5, 5, 5, 5, 10, 10, 10) marks
Possible solution:
 1   # Question 16(a)
 2   # Examination Number:
 3   from random import randint
 4
 5   print("Dice simulation and analysis program") # part (i)
 6   results = []
 7   frequencies = [0, 0, 0, 0, 0, 0]
 8
 9   # Generate 100 random values between 1 and 6 and append them to the results list
 10  for i in range (100):
 11      throw_result = randint(1,6)
 12      results.append(throw_result)
 13
 14      # Start to build up a list of frequencies for each number thrown
 15      if throw_result == 1:
 16          frequencies[0] = frequencies[0] + 1
 17      elif throw_result == 2:
 18          frequencies[1] = frequencies[1] + 1
 19      # part (iii) – start
 20      elif throw_result == 3:
 21          frequencies[2] = frequencies[2] + 1
 22      elif throw_result == 4:
 23          frequencies[3] = frequencies[3] + 1
 24      elif throw_result == 5:
 25          frequencies[4] = frequencies[4] + 1
 26      elif throw_result == 6:
 27          frequencies[5] = frequencies[5] + 1
 28      # part (iii) - end
 29
 30  print()
 31  #print("Results:",results) # part (iv)
 32
 33  print("Frequencies:", frequencies) # part (ii)
 34
 35  # part (v) - start
 36  print()
 37  print("Dice\tFrequency")
 38  print("----\t---------")
 39  for i in range(6):
 40      print(i+1,"\t",frequencies[i])
 41
 42  # part (vi) - start
 43  print()
 44  largest = max(frequencies)
 45  print(frequencies.index(largest)+1, "was rolled most often -", largest, "times")
 46
 47  # part (vii)
 48  # Horizontal Bar Chart ... nested loop
 49  print()
 50  for freq in frequencies:
 51      for i in range(freq):
 52          print("*", end="")
 53      print()
 54





                                                                             20

<!-- PAGE 21 -->
# Page 21

![Page 21](../../../image_assets/marking_schemes/higher/computer_science_higher_2022_paper_1_marking_scheme_page_021.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(i)                                                           5 marks (A-5 scale)

      5 marks      Correct response
                    Correct implementation using solution above or similar.




(ii)                                                          5 marks (B-5 scale)

      5 marks      Correct response
                    Correct implementation using solution above or similar.
      3 marks     Almost correct response
                        Correct implementation using solution above or similar but with syntax
                             error.
                        Correct output displayed but spread over more than a single line.
                        Correct output displayed in the wrong position.

      2 marks     Response with some merit
                 Any other reasonable attempt.




(iii)                                                          5 marks (B-5 scale)

      5 marks      Correct response
                    Correct implementation using solution above or similar.
      3 marks     Almost correct response
                    Correct implementation using solution above or similar but with syntax
                     error or ‘off by one’ index error.
      2 marks     Response with some merit
                 Any other reasonable attempt.





(iv)                                                          5 marks (A-5 scale)

      5 marks      Correct response
                    Correct implementation using solution above or similar.





                                                                             21

<!-- PAGE 22 -->
# Page 22

![Page 22](../../../image_assets/marking_schemes/higher/computer_science_higher_2022_paper_1_marking_scheme_page_022.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(v)                                                          10 marks (B-10 scale)

      10 marks   Correct response
                  Correct implementation using solution above or similar.
      7 marks    Almost correct response
                   Actual frequency values displayed correctly and any 2 of:
                        First header row displayed correctly.
                       Second header row displayed correctly.
                       Correct column alignment.
                       Dice values displayed correctly.

      3 marks    Response with some merit
               Any other reasonable attempt.




(vi)                                                          10 marks (B-10 scale)

      10 marks   Correct response
                  Correct implementation using solution above or similar.
      7 marks    Almost correct response
                     Most frequent value determined but not correctly displayed.
                     Minor error in code to determine the most frequent value.
                     Minor error in code to display the number that was rolled most often.

      3 marks    Response with some merit
               Any other reasonable attempt.



(vii)                                                         10 marks (C-10 scale)

      10 marks   Correct response
                  Correct implementation using solution above or similar.
      8 marks    Almost correct response
                  Correct solution structure but problem with newline e.g.
                   Separate newline for each row
                   No blank lines between rows

      5 marks    Response about half-right
                  Correct solution structure but incorrect number of asterisks
      3 marks    Response with some merit
               Any other reasonable attempt.





                                                                             22

<!-- PAGE 23 -->
# Page 23

![Page 23](../../../image_assets/marking_schemes/higher/computer_science_higher_2022_paper_1_marking_scheme_page_023.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; text contains visual keywords -->

Coursework (90 marks in total)

# Source References

Exam paper:
- file: intermediate_markdown/exam_papers/higher/computer_science_higher_2022_section_c_exam.md
- pages: [4, 5, 6, 7, 8, 9, 10, 11, 12]

Marking scheme:
- file: intermediate_markdown/marking_schemes/higher/computer_science_higher_2022_paper_1_marking_scheme.md
- pages: [20, 21, 22, 23]

# Notes

