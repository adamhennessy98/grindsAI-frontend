---
subject: "Computer Science"
subject_id: "computer-science"
level: "Higher"
year: 2024
paper: "Section C"
question_number: 4
section: "Question 16"
topic: "Unclassified"
secondary_topics: []
classification_type: "unclassified"
source_type: "past_paper_with_marking_scheme"
has_visual: true
visual_assets:
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2024_section_c_exam_page_005.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2024_section_c_exam_page_006.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2024_section_c_exam_page_007.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2024_section_c_exam_page_008.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2024_section_c_exam_page_009.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2024_section_c_exam_page_010.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2024_section_c_exam_page_011.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2024_section_c_exam_page_004.png"
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
  - 25
  - 26
  - 27
  - 28
  - 29
  - 30
pairing_confidence: "high"
needs_review: false
review_reason: ""
---

# Question

Question 16

(a)  Open the program called Question16_A.py from your device. The
     source code is shown below.

     Before making any changes, you should save your working copy of
     the file using the format ExaminationNumberQuestion16_A.py. For
     example, you would save the file as 123456Question16_A.py if your
     Examination Number was 123456.

     Enter your Examination Number in the space provided on line 2 in your Python file.

     The program initialises a list called fruits with three elements – apple, cherry and
     orange. Line 7 of the program is an assignment statement in which a random fruit is
      selected from the list and assigned to the variable called random_fruit_1.
     The program does not display any output.

 1  # Question 16(a)
 2  # Examination Number:
 3  from random import choice
 4
 5  fruits = ['apple', 'cherry', 'orange']
 6
 7  random_fruit_1 = choice(fruits)


Make the following changes to the program:

(i)   Write a line of code to display the value of the variable random_fruit_1 in a
     message.

    When the program is run the output may now look as follows:

    Random Fruit 1: cherry


(ii)  Add statements to initialise two new variables with fruits chosen randomly from the
        list. You should also display the values of the variables which should be called
    random_fruit_2 and random_fruit_3.

    When the program is run the output may now look as follows:

    Random Fruit 1: orange
    Random Fruit 2: orange
    Random Fruit 3: cherry





Leaving Certificate 2024
Computer Science, Section C – Higher level           4

<!-- PAGE 5 -->
# Page 5

![Page 5](../../../image_assets/exam_papers/higher/computer_science_higher_2024_section_c_exam_page_005.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(iii)  Add code to display the message “First fruit is cherry” if the first random fruit is a
      cherry.

    When the program is run the output may now look as follows:

    Random Fruit 1: cherry
    Random Fruit 2: apple
    Random Fruit 3: cherry

    First fruit is cherry


(iv)  Add code to display the message “First pair match” if the first two fruits are the same.

    When the program is run the output may now look as follows:

    Random Fruit 1: cherry
    Random Fruit 2: cherry
    Random Fruit 3: apple

    First fruit is cherry
    First pair match


(v)  Add code to display the message “First pair are cherries” if the first two fruits are both
      cherries.

    When the program is run the output may now look as follows:

    Random Fruit 1: cherry
    Random Fruit 2: cherry
    Random Fruit 3: apple

    First fruit is cherry
    First pair match
    First pair are cherries


(vi)  Add code to display the message “Matching pair” if any two fruits are the same.

    When the program is run the output may now look as follows:

    Random Fruit 1: apple
    Random Fruit 2: cherry
    Random Fruit 3: apple

    Matching pair


                                                    This question continues on the next page.





Leaving Certificate 2024
Computer Science, Section C – Higher level           5

<!-- PAGE 6 -->
# Page 6

![Page 6](../../../image_assets/exam_papers/higher/computer_science_higher_2024_section_c_exam_page_006.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(vii)  Extend the program with a loop that iterates 100 times. The loop should generate a
    random fruit on each iteration. After the loop is executed, the program should display
     a count of the number of times each fruit was generated. There is no need to display
     the names of the 100 fruits.

    When the program is run the output may now look as follows:

    Random Fruit 1: orange
    Random Fruit 2: cherry
    Random Fruit 3: cherry

    Matching pair

    apple 33
    cherry 36
    orange 31


Save your file using the format ExaminationNumberQuestion16_A.py. For example, you
would save the file as 123456Question16_A.py if your Examination Number was 123456.





Leaving Certificate 2024
Computer Science, Section C – Higher level           6

<!-- PAGE 7 -->
# Page 7

![Page 7](../../../image_assets/exam_papers/higher/computer_science_higher_2024_section_c_exam_page_007.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; page contains vector drawings; text contains visual keywords -->

(b)  Open the program called Question16_B.py from your device.
      This file contains only two comments, on lines 1 and 2.
     Before adding any code, you should save your working copy
      of the file using the format
     ExaminationNumberQuestion16_B.py. For example, you
     would save the file as 123456Question16_B.py if your
     Examination Number was 123456.

     Enter your Examination Number in the space provided on line 2 in your Python file.

     Implement a simulation of a fruit machine in Python.
     You should use comments throughout your program to explain your code. You may
     wish to reuse some of the code you used in part (a) as part of your solution.

     The program should proceed according to the following sequence:
          Initialise a list called fruits with three elements – apple, cherry and orange.
          Display the initial list of fruits as shown.

        The initial list of fruits is:
        ['apple', 'cherry', 'orange']
         Prompt the user to enter an additional fruit, for example kiwi, pear or lemon and
         append the value entered to fruits.

        Enter an additional fruit: kiwi
          Display the list of four fruits, for example:

        The list of four fruits is:
        ['apple', 'cherry', 'orange', 'kiwi']

         Prompt the user to nominate their winning fruit which must be in the above list.
                 If the user enters a fruit that is not in fruits, the program should display an
           error message and prompt the user to nominate their winning fruit again. This
          should continue as long as the winning fruit entered is not in fruits.

        Nominate your winning fruit: cherry

          Display the winning fruit, as show below.

        Nominate your winning fruit: cherry
        The winning fruit you selected is cherry

          Write code to select three random fruits from fruits. Compare the selected
             fruits to the winning fruit entered earlier and keep going until all three fruits
         match the winning fruit.
         The program should keep a count of the number of tries taken and display this
          with a “Winner” message at the end, as shown below.

         Winner after 38 tries



                                                             This question continues on the next page.
Leaving Certificate 2024
Computer Science, Section C – Higher level           7

<!-- PAGE 8 -->
# Page 8

![Page 8](../../../image_assets/exam_papers/higher/computer_science_higher_2024_section_c_exam_page_008.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; text contains visual keywords -->

Two example outputs are shown below.

     Sample output 1:

    The initial list of fruits is:
    ['apple', 'cherry', 'orange']

    Enter an additional fruit: kiwi
    The list of 4 fruits is:
    ['apple', 'cherry', 'orange', 'kiwi']

    Nominate your winning fruit: cherry
    The winning fruit you selected is cherry

    Winner after 38 tries


     Sample output 2:

    The initial list of fruits is:
    ['apple', 'cherry', 'orange']

    Enter an additional fruit: kiwi
    The list of 4 random fruits is:
    ['apple', 'cherry', 'orange', 'kiwi']

    Nominate your winning fruit: pear
    Error: winning fruit must be in the list
    Nominate your winning fruit: orange

    The winning fruit you selected is orange

    Winner after 27 tries


Use the format CandidateNumberQuestion16_B.py to save your file. For example, you
would save the file as 123456Question16_B.py if your candidate number was 123456.





Leaving Certificate 2024
Computer Science, Section C – Higher level           8

<!-- PAGE 9 -->
# Page 9

![Page 9](../../../image_assets/exam_papers/higher/computer_science_higher_2024_section_c_exam_page_009.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

Space for rough work.

                              This page will not be reviewed by an examiner.





Leaving Certificate 2024
Computer Science, Section C – Higher level           9

<!-- PAGE 10 -->
# Page 10

![Page 10](../../../image_assets/exam_papers/higher/computer_science_higher_2024_section_c_exam_page_010.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

Space for rough work.

                              This page will not be reviewed by an examiner.





Leaving Certificate 2024
Computer Science, Section C – Higher level          10

<!-- PAGE 11 -->
# Page 11

![Page 11](../../../image_assets/exam_papers/higher/computer_science_higher_2024_section_c_exam_page_011.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

Space for rough work.

                              This page will not be reviewed by an examiner.





Leaving Certificate 2024
Computer Science, Section C – Higher level          11

<!-- PAGE 12 -->
# Page 12

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; page contains vector drawings; text contains visual keywords -->

Acknowledgements

Images
Image on page 4: https://www.flaticon.com/free-icons/fruit-machine
Image on page 7: https://dm0qx8t0i9gc9.cloudfront.net/thumbnails/video/qEue9C6/videoblocks-slot-machine-
wheels-three-3-cherries-jackpot-winner-3-d-animation_bkbn1fknu_thumbnail-1080_09.png





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
LeavingWednesdayCertificate222024May
Computer Science, Section C – Higher level          12Morning 11:30 – 12:30

# Marking Scheme

Question 16                                                     80 (50, 30) marks

(a)                                                 50 (5, 5, 5, 5, 5, 10, 15) marks
Possible solution:
 1   # Question 16 (a)
 2   # Examination Number:
 3   from random import choice
 4
 5   fruits = ['apple', 'cherry', 'orange']
 6
 7   random_fruit_1 = choice(fruits)
 8
 9   # (i) Write a line of code to display (print) the value of random_fruit_1 in a
     message as shown:
 10  print("Random Fruit 1:",random_fruit_1) # (i)
 11
 12  # (ii) Add statements to initialise and display two variables to random fruits from
     the list
 13  # You should name the variables random_fruit_2 and random_fruit_3
 14  random_fruit_2 = choice(fruits) # (ii)
 15  print("Random Fruit 2:",random_fruit_2) # (ii)
 16  random_fruit_3 = choice(fruits) # (ii)
 17  print("Random Fruit 3:",random_fruit_3) # (ii)
 18  print()
 19
 20  # (iii) Add a line of code to display FIRST FRUIT IS CHERRY if the first fruit is a
     cherry
 21  if (random_fruit_1 == 'cherry'):
 22      print("FIRST FRUIT IS CHERRY")
 23
 24  # (iv) Add a line of code to display FIRST PAIR MATCH if the first two fruits are
     the same/match
 25  if (random_fruit_1 == random_fruit_2):
 26      print("FIRST PAIR MATCH")
 27
 28  # (v) Add a line of code to display FIRST PAIR ARE CHERRIES if the first two fruits
     are the same/match
 29  if (random_fruit_1 == random_fruit_2) and (random_fruit_1 == 'cherry'):
 30      print("FIRST PAIR ARE CHERRIES ")
 31
 32  # (vi) Add a line of code to display MATCHING PAIR if any two fruits are the
     same/match
 33  if (random_fruit_1 == random_fruit_2) or (random_fruit_1 == random_fruit_3) or
     (random_fruit_2 == random_fruit_3):
 34      print("MATCHING PAIR")
 35
 36  # (vii)
 37  # Write a loop that iterates 100 times.
 38  # On each iteration the loop body should generate a random fruit.
 39  # After the loop is executed the program should display a count of the number of
     times each fruit was generated.
 40  random_fruits = []
 41  for i in range(100):
 42      random_fruit = choice(fruits)
 43      random_fruits.append(random_fruit)
 44
 45  for i in range(len(fruits)):
 46      print(fruits[i], random_fruits.count(fruits[i]))
 47



                                                                             25

<!-- PAGE 26 -->
# Page 26

![Page 26](../../../image_assets/marking_schemes/higher/computer_science_higher_2024_paper_1_marking_scheme_page_026.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(i)                                                           5 marks (C-5 scale)

 5 marks   Correct response
             Correct implementation using solution above or similar.

 3 marks   Almost correct response
             Correct implementation using solution above or similar but with minor syntax or
            semantic error.
 2 marks   Response with some merit
           Any other reasonable attempt.




(ii)                                                          5 marks (C-5 scale)


 5 marks   Correct response
             Correct implementation using solution above or similar.

 3 marks   Almost correct response
             Correct implementation using solution above or similar but with minor syntax or
            semantic error.
 2 marks   Response with some merit
           Any other reasonable attempt.




(iii)                                                          5 marks (C-5 scale)

 5 marks   Correct response
             Correct implementation using solution above or similar.

 3 marks   Almost correct response
             Correct implementation using solution above or similar but with minor syntax or
            semantic error.
 2 marks   Response with some merit
           Any other reasonable attempt.




(iv)                                                          5 marks (B-5 scale)

 5 marks   Correct response
             Correct implementation using solution above or similar.

 3 marks   Response with some merit
           Any other reasonable attempt.




                                                                             26

<!-- PAGE 27 -->
# Page 27

![Page 27](../../../image_assets/marking_schemes/higher/computer_science_higher_2024_paper_1_marking_scheme_page_027.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(v)                                                          5 marks (B-5 scale)

 5 marks   Correct response
             Correct implementation using solution above or similar.

 3 marks   Response with some merit
           Any other reasonable attempt.




(vi)                                                          10 marks (D-10 scale)

 10 marks  Correct response
             Correct implementation using solution above or similar.

 7 marks   Almost correct response
             Correct implementation using solution above or similar but with minor syntax or
            semantic error.

 5 marks   Response about half-right
               Partially correct implementation using solution above or similar but with significant
             syntax or semantic error.
 3 marks   Response with some merit
           Any other reasonable attempt.




(vii)                                                         15 marks (D-15 scale)

 15 marks  Correct response
             Correct implementation using solution above or similar.

 12 marks  Almost correct response
             Correct implementation using solution above or similar but with minor syntax or
            semantic error.

 8 marks   Response about half-right
               Partially correct implementation using solution above or similar but with significant
             syntax or semantic error.
 5 marks   Response with some merit
           Any other reasonable attempt.





                                                                             27

<!-- PAGE 28 -->
# Page 28

![Page 28](../../../image_assets/marking_schemes/higher/computer_science_higher_2024_paper_1_marking_scheme_page_028.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(b)                                                 30 marks
Possible solution:

 1   # Question 16 (b)
 2   # Examination Number:
 3   from random import choice
 4
 5   # Initialises a list called fruits with three elements – apple, cherry and
    orange.
 6   fruits = ['apple', 'cherry', 'orange']
 7   print("The initial list of fruits is:")
 8   print(fruits)
 9   print()
 10
 11  # Prompt the user to enter an additional fruit (e.g. kiwi, lemon etc.) and
    append the value entered to fruits.
 12  fruit = input("Enter an additional fruit: ")
 13  fruits.append(fruit)
 14
 15  print("The list of 4 fruits is:")
 16  print(fruits)
 17  print()
 18
 19  # Prompt the user to nominate their winning fruit which must be in the
    above list
 20  # If the user does not enter a fruit that’s in the list the program
    displays an eror
 21  winning_fruit = input("Nominate your winning fruit: ")
 22  while winning_fruit not in fruits:
 23      print("ERROR: winning fruit must be one of", fruits)
 24      winning_fruit = input("Nominate your winning fruit: ")
 25
 26  # Display the winning fruit.
 27  print("The winning fruit you selected is", winning_fruit)
 28  print()
 29
 30  # Write the code to select three random fruits from fruits.
 31  # Compare the selected fruits to the winning fruit entered earlier and ...
 32  # ... keep going until all three fruits match the winning fruit.
 33  # The program should keep a count of the number of tries taken and
 34  # display this with a JACKPOT! message at the end
 35  random_fruit_1 = choice(fruits)
 36  random_fruit_2 = choice(fruits)
 37  random_fruit_3 = choice(fruits)
 38
 39  count = 1
 40  while True:
 41      if (random_fruit_1 == random_fruit_2) and \
 42         (random_fruit_1 == random_fruit_3) and \
 43         (random_fruit_1 == winning_fruit):
 44          break
 45      random_fruit_1 = choice(fruits)
 46      random_fruit_2 = choice(fruits)
 47      random_fruit_3 = choice(fruits)
 48      count = count + 1
 49
 50  print("JACKPOT! after", count, "tries")




                                                                             28

<!-- PAGE 29 -->
# Page 29

![Page 29](../../../image_assets/marking_schemes/higher/computer_science_higher_2024_paper_1_marking_scheme_page_029.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

High level of achievement        Moderate level of       Low level of achievement
                       All of the following             achievement           Poor attempt to complete
              implemented correctly and      Reasonable attempt to         any of the following
                            efficiently            implement at least two of
                                            each of the following
                Program executes          Program executes            Program executes
                    correctly with no syntax       correctly with no syntax or       correctly with no syntax
                   or runtime errors            runtime errors                 or runtime errors
                Program meets            Program meets              Program meets
Programming     requirements               requirements                 requirements
   Standards    Program design is well      Program design is well        Program design is well
   (10 marks)      explained with               explained with comments       explained with
               comments                 Meaningful                 comments
                 Meaningful                   variable/function names       Meaningful
                    variable/function names                        (7 marks)      variable/function names
                                (10 marks)                                                        (5 marks)
                  Initial list of fruits            Initial list of fruits correctly      Initial list of fruits
                    correctly initialised              initialised                        correctly initialised
                 User correctly prompted     User correctly prompted       User correctly prompted
                   to enter additional fruit       to enter additional fruit         to enter additional fruit
                and to nominate           and to nominate winning       and to nominate winning
    Program     winning fruit                     fruit                                  fruit
       Inputs    Program correctly          Program correctly            Program correctly
    (5 marks)     generates three random      generates three random        generates three random
                       fruits                             fruits                                fruits
                 Variable initialisation        Variable initialisation and      Variable initialisation and
                and use of assignment       use of assignment             use of assignment
                  statements                 statements                    statements
                                    (5 marks)                        (4 marks)                      (3 marks)
                 Additional fruit correctly     Additional fruit correctly       Additional fruit correctly
                appended to list of fruits     appended to list of fruits       appended to list of fruits
    Program
                 Logic to validate winning     Logic to validate winning       Logic to validate winning
        Logic
                       fruit                               fruit                                  fruit
 (Processing)
                 Logic to simulate fruit        Logic to simulate fruit          Logic to simulate fruit
                machine and maintain       machine and maintain         machine and maintain
   (10 marks)
                  counter variable             counter variable               counter variable
                                (10 marks)                        (7 marks)                      (5 marks)
                  Initial list of fruits            Initial list of fruits              Initial list of fruits
                   displayed                    displayed                       displayed
                Extended list of four        Extended list of four fruits     Extended list of four
                       fruits displayed               displayed                           fruits displayed
    Program    Winning fruit correctly      Winning fruit correctly        Winning fruit correctly
     Outputs                   displayed                    displayed                       displayed
    (5 marks)    Winner! message          Winner! message correctly    Winner! message
                    correctly displayed with       displayed with counter           correctly displayed with
                  counter                                         (4 marks)     counter
                                    (5 marks)                                                        (3 marks)




                                                                             29

<!-- PAGE 30 -->
# Page 30

![Page 30](../../../image_assets/marking_schemes/higher/computer_science_higher_2024_paper_1_marking_scheme_page_030.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; text contains visual keywords -->

Coursework (90 marks in total)

# Source References

Exam paper:
- file: intermediate_markdown/exam_papers/higher/computer_science_higher_2024_section_c_exam.md
- pages: [4, 5, 6, 7, 8, 9, 10, 11, 12]

Marking scheme:
- file: intermediate_markdown/marking_schemes/higher/computer_science_higher_2024_paper_1_marking_scheme.md
- pages: [25, 26, 27, 28, 29, 30]

# Notes

