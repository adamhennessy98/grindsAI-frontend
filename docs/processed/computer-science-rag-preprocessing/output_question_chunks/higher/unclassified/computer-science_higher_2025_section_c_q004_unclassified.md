---
subject: "Computer Science"
subject_id: "computer-science"
level: "Higher"
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
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2025_section_c_exam_page_005.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2025_section_c_exam_page_006.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2025_section_c_exam_page_007.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2025_section_c_exam_page_008.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2025_section_c_exam_page_004.png"
source_exam_pages:
  - 4
  - 5
  - 6
  - 7
  - 8
source_marking_scheme_pages:
  - 22
  - 23
  - 24
  - 25
  - 26
  - 27
  - 28
pairing_confidence: "high"
needs_review: false
review_reason: ""
---

# Question

Question 16

(a)  Open the program called Question16_A.py from your device. The source code is shown
     below and described on the next page.

     Before making any changes, you should save your working copy of the file using the
     format ExaminationNumberQuestion16_A.py. For example, you would save the file as
     123456Question16_A.py if your Examination Number was 123456.

     Enter your Examination Number in the space provided on line 2 in your Python file.

 1  # Question 16 (a)
 2  # Examination Number:
 3
 4  def get_grade(result):
 5      grade = "Unsuccessful"
 6
 7      if result >= 80:
 8          grade = "Distinction"
 9      elif result >= 65:
 10         grade = "Upper Merit"
 11
 12     return grade
 13
 14 # Calculate and display the mean of a list of results
 15 results = [39,32,62,88,51,62,64,81,77] # Initialise the list
 16 N = len(results) # Initialise N to the number of results
 17 total = 0 # Initialise the running total to 0
 18
 19 # Loop N times
 20 for i in range(N):
 21     total = total + results[i] # Running total
 22
 23 # Divide by the total number of results to give the mean
 24 arithmetic_mean = total/9
 25
 26 # Display the answer
 27 print("The mean percentage mark is", arithmetic_mean)





Leaving Certificate 2025
Computer Science, Section C – Higher level           4

<!-- PAGE 5 -->
# Page 5

![Page 5](../../../image_assets/exam_papers/higher/computer_science_higher_2025_section_c_exam_page_005.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; text contains visual keywords -->

Line 15 of the program initialises a list called results with nine values. Each value
     represents a percentage mark obtained by an individual student in nine class tests all
      in the same subject. The final percentage for the subject is calculated by averaging the
     nine results.

     The for loop adds up the values in results and stores the answer in the variable
      called total. Line 24 of the program calculates the mean (average) of all the results by
      dividing total by 9. The mean is saved in the variable called arithmetic_mean.

    When the program is run it displays the following message:

    The mean percentage mark is 61.77777777777778


    Make the following changes to the program:

        (i)   Round the mean percentage to two decimal places.

        When the program is run the output should now look as follows:

        The mean percentage mark is 61.78


        (ii)   Currently, the code divides the total by 9 to calculate the mean. Modify the code
          so that it divides the total by the number of elements in the results list,
           regardless of its size.

        When the program is run the output should remain the same:

        The mean percentage mark is 61.78


         (iii)  Complete the function get_grade so that it sets the variable grade to the
           correct grade using the parameter result and the information provided in the
           table below.

                              Result               Grade

                          >= 80                 Distinction

                          >= 65             Upper Merit

                          >= 50             Lower Merit

                          >= 40                  Pass

                           < 40               Unsuccessful


        When the program is run the output should remain the same:

        The mean percentage mark is 61.78


                                                    This question continues on the next page.





Leaving Certificate 2025
Computer Science, Section C – Higher level           5

<!-- PAGE 6 -->
# Page 6

![Page 6](../../../image_assets/exam_papers/higher/computer_science_higher_2025_section_c_exam_page_006.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(iv)  Extend the program so that it calls the function get_grade and displays the
          grade in a message such as: The grade for the average result is [grade].
         You will need to pass arithmetic_mean into the function.

        When the program is run the output should now look as follows:

        The mean percentage mark is 61.78
        The grade for the average result is Lower Merit


      (v)  Add code so that the program finds the lowest and highest scores in results.
         The program should display this information in two separate messages such as:

          The lowest score is [lowest score]

          The highest score is [highest score]

        When the program is run the output should now look as follows:

        The mean percentage mark is 61.78
        The grade for the average result is Lower Merit
        The lowest score is 32
        The highest score is 88


       (vi)  Add two features to count how many scores in results are a) less than 40 and
           b) between 50 and 79 inclusive. The program should display both counts in two
           separate messages such as:

          The number of scores below 40 is [count1]

          The number of scores between 50 and 79 inclusive is [count2]

        When the program is run the output should now look as follows:

        The mean percentage mark is 61.78
        The grade for the average result is Lower Merit
        The lowest score is 32
        The highest score is 88
        The number of scores below 40 is 2
        The number of scores between 50 and 79 inclusive is 5





Leaving Certificate 2025
Computer Science, Section C – Higher level           6

<!-- PAGE 7 -->
# Page 7

![Page 7](../../../image_assets/exam_papers/higher/computer_science_higher_2025_section_c_exam_page_007.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(vii)  Extend the program so that it determines and displays the longest run
           (sequence) of consecutive result increases.

          Example:

           Input: results = [39,32,62,88,51,62,64,81,77]
          Output: [51,62,64,81]
           Explanation: The sub-list [51,62,64,81] is the longest run of result
            increases. The value 77 breaks the sequence because it is less than its previous
            value, 81.


        When the program is run the output should now look as follows:

        The mean percentage mark is 61.78
        The grade for the average result is Lower Merit
        The lowest score is 32
        The highest score is 88
        The number of scores below 40 is 2
        The number of scores between 50 and 79 inclusive is 5
        The longest run of result increases is [51, 62, 64, 81]




     Save your file using the format ExaminationNumberQuestion16_A.py. For example,
     you would save the file as 123456Question16_A.py if your Examination Number was
     123456.





                                                             This question continues on the next page.





Leaving Certificate 2025
Computer Science, Section C – Higher level           7

<!-- PAGE 8 -->
# Page 8

![Page 8](../../../image_assets/exam_papers/higher/computer_science_higher_2025_section_c_exam_page_008.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; page contains vector drawings; text contains visual keywords -->

(b)  Open the program called Question16_B.py from
     your device. This file contains only two comments,
    on lines 1 and 2.

     Before adding any code, you should save your
     working copy of the file using the format
     ExaminationNumberQuestion16_B.py.

     For example, you would save the file as 123456Question16_B.py if your Examination
    Number was 123456.

     Enter your Examination Number in the space provided on line 2 in your Python file.


     The median of a list of values is the middle value in that list after it has been sorted in
      either ascending or descending order. If the number of values in the list is odd the
     median is the middle value. However, if the number of values in the list is even the
     median is found by calculating the mean of the two middle values i.e. by adding both
     middle values and then dividing the result by two.

     Write a Python program to find the median of a list of zero or more values.

     You should use comments throughout your program to explain your code. You may
     wish to reuse some of the code you used in part (a) as part of your solution.

     Your program should meet the following requirements:
       Initialise a list of integers.
       Display the list.
       Sort the list.
       Display the sorted list.
      Determine the median by examining the list length.
       o  Odd: The number of elements divided by 2 will have a remainder of 1. In this
             case the median is the element at the middle position of the sorted list.
       o  Even: The number of elements divided by 2 will have no remainder. In this
             case the median is the mean of the two middle elements in the sorted list.
       Display the median.
       Display an error message if the list is empty.

     Note:

# Marking Scheme

Question 16                                                     80 (50, 30) marks

(a)                                                 50 (5, 5, 5, 5, 5, 10, 15) marks
Possible solution:
 1   # Question 16 (a)
 2   # Examination Number:
 3
 4   def get_grade(result):
 5       grade = "Unsuccessful"
 6
 7       if result >= 80:
 8           grade = "Distinction"
 9       elif result >= 65:
 10          grade = "Upper Merit"
 11      # part iii - start
 12      elif result >= 50:
 13          grade = "Lower Merit"
 14      elif result >= 40:
 15          grade = "Pass"
 16      # part iii - end
 17
 18      return grade
 19
 20  # Calculate and display the mean of a list of results
 21  results = [39,32,62,88,51,62,64,81,77] # Initialise the list
 22  N = len(results) #initialise N to the number of results
 23  total = 0 #initialise the running total to 0
 24
 25  # Loop N times
 26  for i in range(N):
 27      total = total + results[i] # running total
 28
 29  # Divide by the total number of results to give the mean
 30  arithmetic_mean = total/N # part ii
 31  arithmetic_mean = round(arithmetic_mean, 2) # part i
 32  # Display the answer
 33  print("The mean percentage mark is", arithmetic_mean)
 34
 35  # part (iv) - start
 36  grade = get_grade(arithmetic_mean)
 37  print("The grade for the average result is", grade)
 38  # part (iv) - end
 39
 40  # part (v) - start
 41  highest = max(results)
 42  lowest = min(results)
 43  print("The lowest score is", lowest)
 44  print("The highest score is", highest)
 45  # part (v) - end
 46
 47  # part (vi) - start
 48  a = 0 # count of results less than 40
 49  b = 0 # count of results between 50 and 79 inclusive
 50  for result in results:
 51      if result < 40:
 52          a += 1

Leaving Certificate 2025                         22
Computer Science – Higher Level
Marking Scheme

<!-- PAGE 23 -->
# Page 23

![Page 23](../../../image_assets/marking_schemes/higher/computer_science_higher_2025_paper_1_marking_scheme_page_023.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

53      elif result >= 50 and result <= 79:
 54          b += 1
 55  print("The number of scores below 40 is", a)
 56  print("The number of scores between 50 and 79 inclusive is", b)
 57  # part (vi) - end
 58
 59  # part (vii) - start
 60  longest_run = []
 61  current_run = [results[0]]
 62
 63  for i in range(1, N):
 64      if results[i] > results[i - 1]:
 65          current_run.append(results[i])
 66      else:
 67          if len(current_run) > len(longest_run):
 68              longest_run = current_run
 69          current_run = [results[i]]
 70
 71  # Check one last time at the end of the loop
 72  if len(current_run) > len(longest_run):
 73      longest_run = current_run
 74
 75  print("Longest run of result increases is", longest_run)
 76  # part (vii) - end
 77





Leaving Certificate 2025                         23
Computer Science – Higher Level
Marking Scheme

<!-- PAGE 24 -->
# Page 24

![Page 24](../../../image_assets/marking_schemes/higher/computer_science_higher_2025_paper_1_marking_scheme_page_024.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(i)                                                           5 marks (B-5 scale)

 5 marks   Correct response
             Correct implementation using solution above or similar.

 3 marks   Response with some merit
           Any other reasonable attempt.




(ii)                                                          5 marks (B-5 scale)


 5 marks   Correct response
             Correct implementation using solution above or similar.

 3 marks   Response with some merit
           Any other reasonable attempt.




(iii)                                                          5 marks (C-5 scale)

 5 marks   Correct response
             Correct implementation using solution above or similar.

 3 marks   Almost correct response
             Correct implementation using solution above or similar but with minor syntax or
            semantic error.
 2 marks   Response with some merit
           Any other reasonable attempt.




(iv)                                                          5 marks (C-5 scale)

 5 marks   Correct response
             Correct implementation using solution above or similar.

 3 marks   Almost correct response
             Correct implementation using solution above or similar but with minor syntax or
            semantic error.
 2 marks   Response with some merit
           Any other reasonable attempt.





Leaving Certificate 2025                         24
Computer Science – Higher Level
Marking Scheme

<!-- PAGE 25 -->
# Page 25

![Page 25](../../../image_assets/marking_schemes/higher/computer_science_higher_2025_paper_1_marking_scheme_page_025.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(v)                                                          5 marks (C-5 scale)

 5 marks   Correct response
             Correct implementation using solution above or similar.

 3 marks   Almost correct response
             Correct implementation using solution above or similar but with minor syntax or
            semantic error.
 2 marks   Response with some merit
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

 10 marks  Almost correct response
             Correct implementation using solution above or similar but with minor syntax or
            semantic error.

 7 marks   Response about half-right
               Partially correct implementation using solution above or similar but with significant
             syntax or semantic error.
 3 marks   Response with some merit
           Any other reasonable attempt.





Leaving Certificate 2025                         25
Computer Science – Higher Level
Marking Scheme

<!-- PAGE 26 -->
# Page 26

![Page 26](../../../image_assets/marking_schemes/higher/computer_science_higher_2025_paper_1_marking_scheme_page_026.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(b)                                                                    30 marks
Possible solution:

 1   # Question 16 (b)
 2   # Examination Number:
 3
 4   # Initialise the list
 5   nums = [27, 13, 32, 50, 16]
 6
 7   # Display the list
 8   print("The initial list of values is:", nums)
 9
 10  # Sort the list
 11  nums.sort()
 12
 13  # Display the sorted list
 14  print("The sorted list of values is:", nums)
 15
 16  # Determine the median
 17  N = len(nums)
 18  if N == 0:
 19      print("The list is empty. Cannot compute the median.")
 20  else:
 21      if N % 2 != 0:
 22          median = nums[N//2]
 23      else:
 24          median = (nums[N//2-1] + nums[N//2])/2
 25
 26      # Display the median
 27      print("The median is", median)
 28





Leaving Certificate 2025                         26
Computer Science – Higher Level
Marking Scheme

<!-- PAGE 27 -->
# Page 27

![Page 27](../../../image_assets/marking_schemes/higher/computer_science_higher_2025_paper_1_marking_scheme_page_027.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

High level of achievement         Moderate level of         Low level of achievement
                         All of the following               achievement           Poor attempt to complete any
               implemented correctly and        Reasonable attempt to               of the following
                              efficiently           implement at least two of each
                                                         of the following
                  Initial list of integers             Initial list of integers             Initial list of integers
                    correctly initialised                correctly initialised                correctly initialised
    Program     List sorted correctly            List sorted correctly            List sorted correctly
       Inputs     Variable initialisation and       Variable initialisation and       Variable initialisation and
    (5 marks)     use of assignment              use of assignment              use of assignment
                  statements                    statements                    statements
                                       (5 marks)                         (4 marks)                         (3 marks)
                 Length of list calculated         Length of list calculated         Length of list calculated
                 Logic to test even/odd          Logic to test even/odd          Logic to test even/odd    Program
        Logic     Calculation of median           Calculation of median           Calculation of median
 (Processing)      (even)                          (even)                          (even)
                 Calculation of median (odd)     Calculation of median (odd)     Calculation of median (odd)
   (10 marks)     Logic to test empty list          Logic to test empty list          Logic to test empty list
                                   (10 marks)                         (7 marks)                         (5 marks)
                  Initial list of integers             Initial list of integers             Initial list of integers
                   displayed                        displayed                        displayed
                 Sorted list of integers           Sorted list of integers           Sorted list of integers
    Program      displayed                        displayed                        displayed
     Outputs    Median displayed             Median displayed             Median displayed
    (5 marks)     Error message displayed        Error message displayed        Error message displayed
                                       (5 marks)                         (4 marks)                         (3 marks)


Programming    Program executes correctly     Program executes correctly     Program executes correctly
   Standards     with no syntax or runtime        with no syntax or runtime        with no syntax or runtime
   (10 marks)                    errors                            errors                            errors
                Program meets               Program meets               Program meets
                  requirements                  requirements                  requirements
                Program design is well         Program design is well         Program design is well
                  explained with comments        explained with comments        explained with comments
                 Meaningful                    Meaningful                    Meaningful
                    variable/function names          variable/function names          variable/function names
                                   (10 marks)                         (7 marks)                         (5 marks)





     Leaving Certificate 2025                         27
    Computer Science – Higher Level
    Marking Scheme

<!-- PAGE 28 -->
# Page 28

![Page 28](../../../image_assets/marking_schemes/higher/computer_science_higher_2025_paper_1_marking_scheme_page_028.png)

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
- file: intermediate_markdown/exam_papers/higher/computer_science_higher_2025_section_c_exam.md
- pages: [4, 5, 6, 7, 8]

Marking scheme:
- file: intermediate_markdown/marking_schemes/higher/computer_science_higher_2025_paper_1_marking_scheme.md
- pages: [22, 23, 24, 25, 26, 27, 28]

# Notes

