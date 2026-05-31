---
subject: "Computer Science"
subject_id: "computer-science"
level: "Ordinary"
year: 2025
paper: "Section C"
question_number: 4
section: "Question 16"
topic: "Unclassified"
secondary_topics: []
classification_type: "unclassified"
source_type: "past_paper_with_marking_scheme"
has_visual: true
visual_assets:
  - "../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2025_section_c_exam_page_005.png"
  - "../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2025_section_c_exam_page_006.png"
  - "../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2025_section_c_exam_page_007.png"
  - "../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2025_section_c_exam_page_004.png"
source_exam_pages:
  - 4
  - 5
  - 6
  - 7
source_marking_scheme_pages:
  - 20
  - 21
  - 22
  - 23
  - 24
pairing_confidence: "high"
needs_review: false
review_reason: ""
---

# Question

Question 16

(a)  Open the program called Question16_A.py from your
      device. The source code is shown and described briefly
     below.

     Before making any changes, you should save your
     working copy of the file using the format
     ExaminationNumberQuestion16_A.py. For example,
     you would save the file as 123456Question16_A.py if
     your examination number was 123456.

     Enter your examination number in the space provided on line 2 in your Python file.

     The program below is the start of a program to help floor tilers calculate the total cost of
       tiles. The program allows the user to enter the length of a room and then calculates and
     outputs the total area of the floor.

    1  # Question 16(a)
    2  # Examination Number:
    3
    4  print("The program")
    5
    6  length = float(input("What length is the room?: "))
    7  width = 20
    8
    9  area = length * width
    10
    11 print("The area of the floor is:", area)

    Make the following changes to the program:

        (i)   Modify the program so that it first prints out “Welcome to the Tilers Mate” instead of
          “The program”. When the program is run the output should now look as follows:

        Welcome to the Tilers Mate
        What length is the room?: 10
        The area of the floor is: 200.0



        (ii)   Modify the program to display a message stating the length that the user entered in
           metres. When the program is run the output should now look as follows:

        Welcome to the Tilers Mate
        What length is the room?: 10
        You entered a length of: 10.0 metres
        The area of the floor is: 200.0

Leaving Certificate – 2025                      4
Computer Science, Section C – Ordinary level

<!-- PAGE 5 -->
# Page 5

![Page 5](../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2025_section_c_exam_page_005.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(iii)  Currently, the width of the room is “hard-coded” into the program. Modify the
         program so that the user is asked to enter the width of the room. The program should
          then display a message stating the width that the user entered, in metres.

        When the program is run the output may now look as follows:

        Welcome to the Tilers Mate
        What length is the room?: 5
        What width is the room?: 6
        You entered a length of: 5.0 metres
        You entered a width of: 6.0 metres
        The area of the floor is: 30.0



       (iv)  Add a new variable with a suitable name for the cost per square metre and assign it
          the value of 15. This value should be printed to the screen in an appropriate sentence.

        When the program is run the output may now look as follows:

        Welcome to the Tilers Mate
        What length is the room?: 5
        What width is the room?: 6
        You entered a length of: 5.0 metres
        You entered a width of: 6.0 metres
        The area of the floor is: 30.0
        The cost per square metre is: 15



      (v)   The total cost for tiling the floor can be found by multiplying the cost per square metre
          by the area of the floor. Modify the program to print out the total cost in an
           appropriate sentence.

        When the program is run the output may now look as follows:

        What length is the room?: 5
        What width is the room?: 6
        You entered a length of: 5.0 metres
        You entered a width of: 6.0 metres
        The area of the floor is: 30.0
        The cost per square metre is: 15
        The total cost is: 450.0





                                                          This question continues on the next page.




Leaving Certificate – 2025                      5
Computer Science, Section C – Ordinary level

<!-- PAGE 6 -->
# Page 6

![Page 6](../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2025_section_c_exam_page_006.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; text contains visual keywords -->

(vi)    If the total cost is greater than 1000 then a discount will apply. However, if the total
           cost is less than 100 then the tiler will not take on the job. Modify the program to
          output a message based on the following table:



                          Condition                             Output


                    Cost is more than 1000            You are entitled to a 10% discount

             Cost is between 100 and 1000 inclusive    You are not entitled to a 10% discount

                     Cost is less than 100                       Sorry, job is too small


        When the program is run the output may now look as follows:

        What length is the room?: 5
        What width is the room?: 6
        You entered a length of: 5.0 metres
        You entered a width of: 6.0 metres
        The area of the floor is: 30.0
        The cost per square metre is: 15
        The total cost is: 450.0
        You are not entitled to a 10% discount




     Save your file using the format ExaminationNumberQuestion16_A.py. For example, you
     would save the file as 123456Question16_A.py if your examination number was 123456.





Leaving Certificate – 2025                      6
Computer Science, Section C – Ordinary level

<!-- PAGE 7 -->
# Page 7

![Page 7](../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2025_section_c_exam_page_007.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; text contains visual keywords -->

(b)  Open the program called Question16_B.py from your device. This file contains two
    comments on lines 1 and 2.

     Before making any changes, you should use the format
     ExaminationNumberQuestion16_B.py to save your file. For example, you would save the file
     as 123456Question16_B.py if your examination number was 123456.

     Enter your examination number in the space provided on line 2.

     Write a Python program that will calculate the total cost of tiles for a new house.

     You should use comments throughout your program to explain your code. You may wish to
     reuse some of the code you used in part (a) as part of your solution.


     Your program should meet the following requirements:

# Marking Scheme

Question 16                                                   80 (60, 20) marks

(a)                                                 60 (10, 10, 10, 10, 10, 10) marks

 1   # Question 16(a)
 2   # Examination Number:
 3
 4   print("Welcome to the Tilers Mate") #(i)
 5
 6   length = float(input("What length is the room?: "))
 7   width = float(input("What width is the room?: ")) # (iii)
 8
 9   area = length * width
 10
 11  cost_per_square_metre = 15 #(iv)
 12
 13  print("You entered a length of:", length, "metres") # (ii)
 14  print("You entered a width of:", width, "metres") # (iii)
 15  print("The area of the floor is:", area)
 16  print("The cost per square metre is:", cost_per_square_metre) # (iv)
 17
 18  total_cost = cost_per_square_metre * area    # (v)
 19  print("The total cost is:", total_cost) # (v)
 20
 21  # (vi)
 22  if total_cost > 1000:
 23      print("You are entitled to a 10% discount")
 24  elif total_cost >= 100 and total_cost <= 1000:
 25      print("You are not entitled to a 10% discount")
 26  else:
 27      print("Sorry, job is too small")

(i)                                                      10 marks (A-10 scale)

 10 marks  Correct response
             Correct implementation using solution above or similar.
 5 marks   Response with some merit
           Any other reasonable attempt.



(ii)                                                      10 marks (B-10 scale)

 10 marks  Correct response
             Correct implementation using solution above or similar.
 7 marks   Almost correct response
             Correct implementation using solution above or similar but with minor syntax or
            semantic error.
 3 marks   Response with some merit
           Any other reasonable attempt.




Leaving Certificate 2025                       20
Computer Science – Ordinary Level
Marking Scheme

<!-- PAGE 21 -->
# Page 21

![Page 21](../../../image_assets/marking_schemes/ordinary/computer_science_ordinary_2025_paper_1_marking_scheme_page_021.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(iii)                                                          10 marks (B-10 scale)

 10 marks  Correct response
             Correct implementation using solution above or similar.
 7 marks   Almost correct response
             Correct implementation using solution above or similar but with minor syntax or
            semantic error.
 3 marks   Response with some merit
           Any other reasonable attempt.


(iv)                                                          10 marks (C-10 scale)
 10 marks  Correct response
             Correct implementation using solution above or similar.
 8 marks   Almost correct response
             Correct implementation using solution above or similar but with minor syntax or
            semantic error.
 5 marks   Response about half-right
               Partially correct implementation using solution above or similar but with significant
             syntax or semantic error.
 3 marks   Response with some merit
           Any other reasonable attempt.


(v)                                                          10 marks (C-10 scale)
 10 marks  Correct response
             Correct implementation using solution above or similar.
 8 marks   Almost correct response
             Correct implementation using solution above or similar but with minor syntax or
            semantic error.
 5 marks   Response about half-right
               Partially correct implementation using solution above or similar but with significant
             syntax or semantic error.
 3 marks   Response with some merit
           Any other reasonable attempt.


(vi)                                                          10 marks (C-10 scale)
 10 marks  Correct response
             Correct implementation using solution above or similar.
 8 marks   Almost correct response
             Correct implementation using solution above or similar but with minor syntax or
            semantic error.

 5 marks   Response about half-right
               Partially correct implementation using solution above or similar but with significant
             syntax or semantic error.
 3 marks   Response with some merit
           Any other reasonable attempt.


Leaving Certificate 2025                       21
Computer Science – Ordinary Level
Marking Scheme

<!-- PAGE 22 -->
# Page 22

![Page 22](../../../image_assets/marking_schemes/ordinary/computer_science_ordinary_2025_paper_1_marking_scheme_page_022.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(b)                                                       20 marks

Possible solution:
 1   # Question 16(b)
 2   # Examination Number:
 3
 4   print("Tile Cost Calculator")
 5
 6   # ask user to input cost of tiles and cast as float
 7   cost_per_sq_metre = float(input("How much do the tiles cost per square metre?
    "))
 8
 9   # ask user to input number of rooms and cast as int
 10  num_rooms = int(input("How many rooms do you want to tile? "))
 11
 12  # initialise total_cost to 0
 13  total_cost = 0.0
 14
 15  # loop through the number of rooms entered
 16  for x in range(num_rooms):
 17      print("Room ", x+1) # Display the room number
 18
 19     # prompt user to input room width and cast as float
 20      width = float(input("What width is room?: "))
 21
 22     # prompt user to input room length and cast as float
 23      length = float(input("What length is the room?: "))
 24
 25     # calculate the room cost
 26      room_cost = width * length * cost_per_sq_metre
 27
 28     # add each room cost to total_cost (running total)
 29      total_cost = total_cost + room_cost
 30
 31  # Display the total cost, rounded to 2 decimal places
 32  print("The total cost is EUR", round(total_cost,2))





Leaving Certificate 2025                       22
Computer Science – Ordinary Level
Marking Scheme

<!-- PAGE 23 -->
# Page 23

![Page 23](../../../image_assets/marking_schemes/ordinary/computer_science_ordinary_2025_paper_1_marking_scheme_page_023.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

High level of achievement         Moderate level of        Low level of achievement
                          All of the following              achievement          Poor attempt to complete any
                implemented correctly and       Reasonable attempt to              of the following
                               efficiently             implement at least two of
                                               each of the following
                  User correctly prompted       User correctly prompted       User correctly prompted
                    to enter each of the             to enter each of the             to enter each of the
                     following and stored as          following and stored as          following and stored as
                   the correct data type:          the correct data type:          the correct data type:
                      cost of tiles (float)             cost of tiles (float)             cost of tiles (float)
  Program
                     number of rooms (int)        number of rooms (int)        number of rooms (int)
    Inputs
                      length (float)                 length (float)                 length (float)
  (5 marks)
                      width (float)                  width (float)                  width (float)
                  Variable initialisation and      Variable initialisation and      Variable initialisation and
                  use of assignment             use of assignment             use of assignment
                   statements                    statements                    statements
                                       (5 marks)                      (4marks)                        (3 marks)
                 Program loops through       Program loops through       Program loops through
                     correct number of rooms        correct number of rooms        correct number of rooms
                 Program calculates the        Program calculates the        Program calculates the
                      individual room cost             individual room cost             individual room cost
Program Logic
                 Program correctly            Program correctly            Program correctly
 (Processing)
                   increments the total cost       increments the total cost       increments the total cost
  (5 marks)
                       in a variable                       in a variable                       in a variable
                  Total cost rounded to 2        Total cost rounded to 2        Total cost rounded to 2
                   decimal places                 decimal places                 decimal places
                                       (5 marks)                        (4 marks)                        (3 marks)
                 Program outputs “Tile        Program outputs “Tile        Program outputs “Tile
                   Cost Calculator” at the          Cost Calculator” at the          Cost Calculator” at the
                       start                               start                               start
                 Program outputs the room    Program outputs the room    Program outputs the room
  Program
                number correctly for each     number correctly for each     number correctly for each
   Outputs
                room                     room                     room
  (5 marks)
                 Program outputs the total     Program outputs the total     Program outputs the total
                amount in the correct         amount in the correct         amount in the correct
                   format                       format                       format
                                       (5 marks)                        (4 marks)                        (3 marks)
                 Program executes            Program executes            Program executes
                      correctly with no syntax or       correctly with no syntax or       correctly with no syntax or
                   runtime errors                runtime errors                runtime errors
                 Program meets              Program meets              Program meets
Programming
                   requirements                 requirements                 requirements
  Standards
                 Program design is well        Program design is well        Program design is well
  (5 marks)
                    explained with comments       explained with comments       explained with comments
                  Meaningful                   Meaningful                   Meaningful
                     variable/function names         variable/function names         variable/function names
                                       (5 marks)                        (4 marks)                        (3 marks)





   Leaving Certificate 2025                       23
   Computer Science – Ordinary Level
   Marking Scheme

<!-- PAGE 24 -->
# Page 24

![Page 24](../../../image_assets/marking_schemes/ordinary/computer_science_ordinary_2025_paper_1_marking_scheme_page_024.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; text contains visual keywords -->

Coursework (90 marks in total)

   The report                                                          Marks
   Quality of report website structure and layout.
   Evidence of adherence to the principles of good user interface design when creating
                                                                            5
    the website.
   Adherence to the word count (penalties may apply).

# Source References

Exam paper:
- file: intermediate_markdown/exam_papers/ordinary/computer_science_ordinary_2025_section_c_exam.md
- pages: [4, 5, 6, 7]

Marking scheme:
- file: intermediate_markdown/marking_schemes/ordinary/computer_science_ordinary_2025_paper_1_marking_scheme.md
- pages: [20, 21, 22, 23, 24]

# Notes

