---
subject: "Computer Science"
subject_id: "computer-science"
level: "Higher"
year: 2020
paper: "Section C"
question_number: 7
section: "3. The password contains a mix of lowercase and uppercase letters. \u0d455 points"
topic: "Unclassified"
secondary_topics: []
classification_type: "unclassified"
source_type: "past_paper_with_marking_scheme"
has_visual: true
visual_assets:
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2020_section_c_exam_page_004.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2020_section_c_exam_page_005.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2020_section_c_exam_page_006.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2020_section_c_exam_page_007.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2020_section_c_exam_page_008.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2020_section_c_exam_page_009.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2020_section_c_exam_page_010.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2020_section_c_exam_page_011.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2020_section_c_exam_page_012.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2020_section_c_exam_page_013.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2020_section_c_exam_page_014.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2020_section_c_exam_page_015.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2020_section_c_exam_page_003.png"
source_exam_pages:
  - 3
  - 4
  - 5
  - 6
  - 7
  - 8
  - 9
  - 10
  - 11
  - 12
  - 13
  - 14
  - 15
  - 16
source_marking_scheme_pages:
  - 5
pairing_confidence: "high"
needs_review: false
review_reason: ""
---

# Question

3. The password contains a mix of lowercase and uppercase letters. ൅5 points

    A sample run of the program is shown below:

    Enter a password: sunshine
    6

     Here the user enters the password sunshine and the program calculates and displays a score
      of 6. This is because the password contains more than seven characters (5 points) and
      contains lowercase letters (1 point).





Leaving Certificate 2020                       3
Computer Science, Section C – Higher level

<!-- PAGE 4 -->
# Page 4

![Page 4](../../../image_assets/exam_papers/higher/computer_science_higher_2020_section_c_exam_page_004.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

1  # Question 16(a)
 2  # Examination Number:
 3
 4  # Prompt the user to enter a password and store the ...
 5  # value entered in the variable password
 6  password = input("Enter a password: ")
 7
 8  # A variable to store all the lowercase letters in the alphabet
 9  LOWER_CASE_LETTERS = "abcdefghijklmnopqrstuvwxyz"
 10
 11 # The variables lowercase and uppercase indicate the presence or ...
 12 # absence of lowercase and uppercase characters in the password
 13 lowercase = False # True if password contains a lowercase letter
 14 uppercase = False # True if password contains an uppercase letter
 15
 16 # Loop through each character in the password and ...
 17 # check the password for specific characters
 18 for character in password:
 19    if character in LOWER_CASE_LETTERS:
 20     lowercase = True
 21    if character in "ABCDEFGHIJKLMNOPQRSTUVWXYZ":
 22     uppercase = True
 23
 24 # Calculate the score based on the rules
 25
 26 score = 0
 27
 28 # Rule 1
 29 if len(password) > 7:
 30     score = score + 5
 31
 32 # Rule 2
 33 if lowercase:
 34     score = score + 1
 35
 36 # Rule 3
 37 if lowercase and uppercase:
 38     score = score + 5
 39
 40 # Display the score
 41 print(score)
 42





Leaving Certificate 2020                       4
Computer Science, Section C – Higher level

<!-- PAGE 5 -->
# Page 5

![Page 5](../../../image_assets/exam_papers/higher/computer_science_higher_2020_section_c_exam_page_005.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

Make the following changes to the program:

        (i)    Insert a comment to say ‘initialise score’ in an appropriate location in the program.


        (ii)  Amend the program so that is displays two lines of output as follows:
              -    the first line will display the word Password: followed by the password that was
               entered by the user, and
              -    the second line will display the word Score: followed by the calculated score for
                 that password.

        When the program is run the output may look as follows:

        Enter a password: sunshine
        Password: sunshine
        Score: 6


         (iii)  Currently in the program, the uppercase letters are hard‐coded as the string:
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

          Replace the use of this string with a variable, in a manner similar to that used to
           represent the lowercase letters. The output of the program should not be changed.
         You should name the variable UPPER_CASE_LETTERS.


       (iv)  Implement a new rule (rule 4) so that the score is increased by 2 points if the password
           contains at least one uppercase letter.

        When the program is run the output may look as follows:

        Enter a password: Sunshine
        Password: Sunshine
        Score: 13


      (v)   Implement a new rule (rule 5) so that the score is increased by 5 points if the password
           contains at least one digit (any integer in the range 0 to 9: ൅5 points).

        When the program is run the output may look as follows:

        Enter a password: 3Sunshine
        Password: 3Sunshine
        Score: 18





Leaving Certificate 2020                       5
Computer Science, Section C – Higher level

<!-- PAGE 6 -->
# Page 6

![Page 6](../../../image_assets/exam_papers/higher/computer_science_higher_2020_section_c_exam_page_006.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; text contains visual keywords -->

(vi)  Implement a new rule (rule 6) so that the score is increased by:
               1 point if the first character of the password is a digit
               1 point if the last character of the password is a digit
               2 extra points if both the first and the last characters of the password are digits

        When the program is run the output may look as follows:

        Enter a password: 3Sunshine7
        Password: 3Sunshine7
        Score: 22


       (vii)  Implement a new rule (rule 7) so that the score is reduced by 10 points if the password
           contains only digits.

        When the program is run the output may look as follows:

        Enter a password: 1234
        Password: 1234
        Score: -1


        (viii) Change rule 1 so that the score is adjusted according to the password lengths as shown
             in the following table.


                     Password Length             Score
                       Greater than 7 characters    ൅5 points
                    From 4 to 7 characters      ൅2 points
                         Less than 4 characters      െ2 points

         The table below shows the scores that would be awarded for a variety of passwords.
         You could use this information to test your program.

                               Password     Score
                                 sun        െ1
                               Sun          6
                                sun2          9
                                2sun3        12
                                  3Sunshine     19
                                 3Sunshine7    22



     Use the format CandidateNumberQuestion16_A.py to save your file. For example, if your
     candidate number was 123456 you would save the file as 123456Question16_A.py.





Leaving Certificate 2020                       6
Computer Science, Section C – Higher level

<!-- PAGE 7 -->
# Page 7

![Page 7](../../../image_assets/exam_papers/higher/computer_science_higher_2020_section_c_exam_page_007.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; text contains visual keywords -->

(b)  Open the program called Question16_B.py from your device. The source code is shown on
     the next page and described briefly below.

     Before making any changes, you should use the format CandidateNumberQuestion16_B.py
     to save your file. For example, if your candidate number was 123456 you would save the file
     as 123456Question16_B.py.

     Enter your Examination Number in the space provided on line 2.

      This program is very similar to that provided for part (a) with two main differences:
        The code to calculate the password score is contained in a function definition called
        calculate_score. This function accepts a parameter called password and
           returns the calculated score.
        Instead of prompting the user to enter a single password this program, uses a list of
          hard‐coded passwords called test_passwords.

    When the program is run it loops through each password in the list test_passwords. As
        it does so, it calculates and displays the score of each password.


    A sample run of the program is shown below:

    1
    6
    11
    0
    5





Leaving Certificate 2020                       7
Computer Science, Section C – Higher level

<!-- PAGE 8 -->
# Page 8

![Page 8](../../../image_assets/exam_papers/higher/computer_science_higher_2020_section_c_exam_page_008.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

1  # Question 16(b)
 2  # Examination Number:
 3
 4  # A variable to store all the lower case letters in the alphabet
 5  LOWER_CASE_LETTERS = "abcdefghijklmnopqrstuvwxyz"
 6
 7  def calculate_score(password):
 8
 9      # The variables lowercase and uppercase indicate the presence or
 10     # absence of lowercase and uppercase characters in the password
 11     lowercase = False #True if password contains a lowercase letter
 12     uppercase = False #True if password contains an uppercase letter
 13
 14     # Loop through each character in the password and ...
 15     # ... check the password for specific characters
 16     for character in password:
 17       if character in LOWER_CASE_LETTERS:
 18         lowercase = True
 19       if character in "ABCDEFGHIJKLMNOPQRSTUVWXYZ":
 20         uppercase = True
 21
 22     # Calculate the score based on the rules
 23
 24     score = 0
 25
 26     # Rule 1
 27     if len(password) > 7:
 28         score = score + 5
 29
 30     # Rule 2
 31     if lowercase:
 32         score = score + 1
 33
 34     # Rule 3
 35     if lowercase and uppercase:
 36         score = score + 5
 37
 38     return score
 39
 40 # Test driver
 41 test_passwords = ["sun", "Sun", "Sunshine", "12345", "123456789"]
 42 for password in test_passwords:
 43     pass_score = calculate_score(password)
 44     print(pass_score)





Leaving Certificate 2020                       8
Computer Science, Section C – Higher level

<!-- PAGE 9 -->
# Page 9

![Page 9](../../../image_assets/exam_papers/higher/computer_science_higher_2020_section_c_exam_page_009.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

Make the following changes to the program:

        (i)   Amend the program so that the output is displayed in the following format:

        Score   Password
        -----   --------
        1       sun
        6       Sun
        11      Sunshine
        0       12345
        5       123456789


        (ii)   Insert a line of code to change the password contained at index 4 of the list
        test_passwords from 123456789 to Moonlight.

        When the program is run the output may look as follows:

        Score   Password
        -----   --------
        1       sun
        6       Sun
        11      Sunshine
        0       12345
        11      Moonlight


         (iii)  Amend the program so that it determines and displays the weakest password in the list
           along with its score.


        When the program is run the output may look as follows:

        Score   Password
        -----   --------
        1       sun
        6       Sun
        11      Sunshine
        0       12345
        11      Moonlight

        The weakest password is: 12345
        Score: 0





Leaving Certificate 2020                       9
Computer Science, Section C – Higher level

<!-- PAGE 10 -->
# Page 10

![Page 10](../../../image_assets/exam_papers/higher/computer_science_higher_2020_section_c_exam_page_010.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(iv)  Write a function definition called is_strong which accepts a password as a
          parameter and returns True if the password is strong; False otherwise.

        A password is deemed strong if it contains more than seven characters and both
          lowercase and uppercase letters.

         The first line of the function definition will look like this:
        def is_strong(password):


      (v)   Modify the program so that it calls the function is_strong for each password in the
                list test_passwords and displays all the strong passwords.


        When the program is run the output may look as follows:

        Score   Password
        -----   --------
        1       sun
        6       Sun
        11      Sunshine
        0       12345
        11      Moonlight

        The weakest password is: 12345
        Score: 0

        The strong passwords are:
        Sunshine
        Moonlight



     Use the format CandidateNumberQuestion16_B.py to save your file. For example, if your
     candidate number was 123456 you would save the file as 123456Question16_B.py.





Leaving Certificate 2020                       10
Computer Science, Section C – Higher level

<!-- PAGE 11 -->
# Page 11

![Page 11](../../../image_assets/exam_papers/higher/computer_science_higher_2020_section_c_exam_page_011.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

Space for rough work.

                             This page will not be reviewed by an examiner.





Leaving Certificate 2020                       11
Computer Science, Section C – Higher level

<!-- PAGE 12 -->
# Page 12

![Page 12](../../../image_assets/exam_papers/higher/computer_science_higher_2020_section_c_exam_page_012.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

Space for rough work.

                             This page will not be reviewed by an examiner.





Leaving Certificate 2020                       12
Computer Science, Section C – Higher level

<!-- PAGE 13 -->
# Page 13

![Page 13](../../../image_assets/exam_papers/higher/computer_science_higher_2020_section_c_exam_page_013.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

Space for rough work.

                             This page will not be reviewed by an examiner.





Leaving Certificate 2020                       13
Computer Science, Section C – Higher level

<!-- PAGE 14 -->
# Page 14

![Page 14](../../../image_assets/exam_papers/higher/computer_science_higher_2020_section_c_exam_page_014.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

Space for rough work.

                             This page will not be reviewed by an examiner.





Leaving Certificate 2020                       14
Computer Science, Section C – Higher level

<!-- PAGE 15 -->
# Page 15

![Page 15](../../../image_assets/exam_papers/higher/computer_science_higher_2020_section_c_exam_page_015.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

Space for rough work.

                             This page will not be reviewed by an examiner.





Leaving Certificate 2020                       15
Computer Science, Section C – Higher level

<!-- PAGE 16 -->
# Page 16

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images -->

Copyright notice
This examination paper may contain text or images for which the State Examinations Commission is not the copyright
owner, and which may have been adapted, for the purpose of assessment, without the authors’ prior consent. This
examination paper has been prepared in accordance with Section 53(5) of the Copyright and Related Rights Act, 2000.
Any subsequent use for a purpose other than the intended purpose is not authorised. The Commission does not
accept liability for any infringement of third‐party rights arising from unauthorised distribution or use of this
examination paper.





Leaving Certificate – Higher Level
Computer Science – Section C
1 hour

# Marking Scheme

Question 3                                                         5 marks
Contains address of the instruction to be executed in memory or similar
      Very good description - clear understanding demonstrated            5 marks
     Good description - clear information, lacking full understanding         3 marks
        Fair description - limited understanding                            1 mark

# Source References

Exam paper:
- file: intermediate_markdown/exam_papers/higher/computer_science_higher_2020_section_c_exam.md
- pages: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

Marking scheme:
- file: intermediate_markdown/marking_schemes/higher/computer_science_higher_2020_paper_1_marking_scheme.md
- pages: [5]

# Notes

