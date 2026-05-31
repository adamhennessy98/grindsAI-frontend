---
subject: "Computer Science"
subject_id: "computer-science"
level: "Higher"
year: 2020
paper: "Section C"
question_number: 4
section: "Question 16"
topic: "Computer Systems"
secondary_topics: []
classification_type: "topic_specific"
source_type: "past_paper_with_marking_scheme"
has_visual: true
visual_assets:
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2020_section_c_exam_page_003.png"
source_exam_pages:
  - "3"
source_marking_scheme_pages:
  - "17"
  - "18"
  - "19"
  - "20"
  - "21"
  - "22"
  - "23"
  - "24"
  - "25"
  - "26"
  - "27"
  - "28"
pairing_confidence: "high"
topic_confidence: "medium"
classification_source: "fallback_rules"
candidate_topics:
  - "Computer Systems"
  - "Algorithms and Logic"
needs_review: false
review_reason: ""
---


# Question

Question 16

A password strength meter is a mechanism that can be used to safeguard against setting weak
passwords. When a user is creating a password for the first time or changing an existing password,
a password strength meter can be used to show how resistant the password is to attack.

Meters have rules they use to assign points for password strengthening measures such as
including combinations of uppercase and lowercase letters as well as numbers and special
symbols.

(a)  Open the program called Question16_A.py from your device. The source code is shown on
     the next page and described briefly below.

     Before making any changes, you should use the format CandidateNumberQuestion16_A.py
     to save your file. For example, if your candidate number was 123456 you would save the file
     as 123456Question16_A.py.

     Enter your Examination Number in the space provided on line 2.

      This program is designed to calculate and display a score that indicates the strength of a
     password entered by the user.

     The variable score is used to store the password strength. This variable is initially set to
     zero and additional points are added based on the following rules:

# Marking Scheme

Question 16

(a)                                                 50 (5, 5, 5, 5, 10, 5, 5, 10) marks
Possible solution:
 1
 2  # Examination Number:
 3
 4  # Prompt the user to enter a password and store the ...
 5  # value entered in the variable password
 6  password = input("Enter a password: ")
 7
 8  # A variable to store all the lower case letters in the alphabet
 9  LOWER_CASE_LETTERS = "abcdefghijklmnopqrstuvwxyz"
 10 UPPER_CASE_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" # Ans (iii):
 11 DIGITS = "0123456789" # Ans (v)
 12
 13 # The variables lowercase and uppercase indicate the presence of ...
 14 # ... lowercase and uppercase characters in the password
 15 lowercase = False # True if password contains at least 1 lowercase letter
 16 uppercase = False # True if password contains at least 1 uppercase letter
 17 digits = False
 18
 19 # Loop through each character in the password and ...
 20 # ... check the password for specific characters
 21 for character in password:
 22   if character in LOWER_CASE_LETTERS:
 23     lowercase = True
 24   if character in UPPER_CASE_LETTERS: # Ans (iii):
 25     uppercase = True
 26   if character in DIGITS: # Ans (v)
 27     digits = True
 28
 29
 30 # Calculate the score based on the rules
 31
 32 score = 0 # Ans (i): initialise score
 33
 34 # Rule 1
 35 # Ans (viii)
 36 if len(password) > 7:
 37     score = score + 5
 38 elif len(password) >= 4 and len(password) <= 7:
 39     score = score + 2
 40 else:



                                                                             17

<!-- PAGE 18 -->
# Page 18

![Page 18](../../../image_assets/marking_schemes/higher/computer_science_higher_2020_paper_1_marking_scheme_page_018.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

41     score = score - 2
42
43 # Rule 2
44 if lowercase:
45     score = score + 1
46
47 # Rule 3
48 if lowercase and uppercase:
49     score = score + 5
50
51 # Ans (iv): Rule 4
52 if uppercase:
53     score = score + 2
54
55 # Ans (v): Rule 5
56 if digits:
57     score = score + 5
58
59 # Ans (vi): Rule 6
60 if password[0] in DIGITS:
61     score = score + 1
62 if password[-1] in DIGITS:
63     score = score + 1
64 if password[0] in DIGITS and password[-1] in DIGITS:
65     score = score + 2
66
67 # Ans (vii): Rule 7
68 if digits and not lowercase and not uppercase:
69     score = score - 10
70
71
72 # Display the score
73 #print(score)
74 # Ans (ii):
75 print("Password:", password)
76 print("Score:", score)





                                                                            18

<!-- PAGE 19 -->
# Page 19

![Page 19](../../../image_assets/marking_schemes/higher/computer_science_higher_2020_paper_1_marking_scheme_page_019.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(i)                                                           5 marks (A-5 scale)

      5 marks      Correct response
                    Correct implementation using included solution or similar.
      3 marks     Almost correct response
               Comment in inappropriate location.
      2 mark      Response with some merit
                 Any reasonable attempt at inserting a comment.



(ii)                                                          5 marks (B-5 scale)

      5 marks     Correct response
                   Correct implementation using included solution or similar.
      4 marks    Almost correct response
                   Correct implementation of only one output using included solution or
                      similar.
                Minor string concatenation error.
      3 marks    Response about half-right
                   Correct implementation using included solution or similar but with one
                   syntax error.
                 Only prints both variables (without text).
                    String and variable printed on separate lines.
                Any other similar half-right response.
      2 marks    Response with some merit
                Attempted use of print or similar.


(iii)                                                          5 marks (B-5 scale)

      5 marks      Correct response
                    Correct implementation using included solution or similar.
      4 marks     Almost correct response
                    Correct design of solution evident but syntax/semantic error in
                   implementation.
      3 marks     Response about half-right
                    Correct implementation of variable declaration but not used in if
                    statement.
                     Variable name changed in if statement but not declared.
                 Any other similar half-right response.
      2 mark      Response with some merit
                 Any attempt at creating variable or any relevant attempt at changing if
                    statement.



                                                                             19

<!-- PAGE 20 -->
# Page 20

![Page 20](../../../image_assets/marking_schemes/higher/computer_science_higher_2020_paper_1_marking_scheme_page_020.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(iv)                                                        5 marks (B-5 scale)

 5 marks     Correct response
             Correct implementation using included solution or similar.
 4 marks    Almost correct response
             Correct design of solution evident but syntax/semantic error in
             implementation.
 3 marks    Response about half-right
            Attempted use of conditional statement or similar.
 2 marks    Response with some merit
             Value of the score changed correctly but not inside conditional statement
             or similar.



(v)                                                    10 marks (C-10 scale)

 10 marks   Correct response
             Correct implementation using included solution or similar.
 8 marks    Almost correct response
             Correct design of solution evident but syntax/semantic error in
            implementation.
             Correct design of solution but flag not initialised.
 6 marks    Response more than half-right
             Correct implementation of solution to determine that the password
             contains at least one digit (e.g. flag is set correctly by searching through
            the string for digits, but not tested).
 4 marks    Response about half-right
           Attempted use of conditional statement to test flag.
           Any reasonable attempt to create digits variable, list or flag or use of
         isdigit() function on whole password.
 2 marks    Response with some merit
            Value of the score changed correctly but no attempt to set or test flag.





                                                                        20

<!-- PAGE 21 -->
# Page 21

![Page 21](../../../image_assets/marking_schemes/higher/computer_science_higher_2020_paper_1_marking_scheme_page_021.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(vi)                                                             5 marks (B-5 scale)

      5 marks    Correct response
                  Correct implementation using included solution or similar (optimal).
              Do not award full marks if solution is inside the for loop.
      4 marks    Almost correct response
                  Correct design of solution evident but syntax/semantic error in
                  implementation.
                  Correct implementation but the if statements are inside the for loop
                   (suboptimal).
      3 marks    Response about half-right
                Implements any part of the rule correctly using the included solution or
                     similar.
      2 marks    Response with some merit
                Attempted use of any combination of conditional statement and string
                   index.
                Use of conditional statements and attempt at finding a specific character in
                 the string.
                 Value of the score changed correctly.



       (vii)                                                      5 marks (B-5 scale)


      5 marks     Correct response
                   Correct implementation using included solution or similar.
      4 marks    Almost correct response
                   Correct design of solution evident but syntax/semantic error in
                  implementation.
      3 marks    Response about half-right
                  Relevant attempt at including a condition to test any of digits, lowercase
                and uppercase.
      2 marks    Response with some merit
                  Value of the score changed correctly.





                                                                             21

<!-- PAGE 22 -->
# Page 22

![Page 22](../../../image_assets/marking_schemes/higher/computer_science_higher_2020_paper_1_marking_scheme_page_022.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(viii)                                                     10 marks (C-10 scale)

 10 marks   Correct response
             Correct implementation using included solution or similar (optimal).
 8 marks    Almost correct response
             Correct implementation using multiple if statements instead of
             using elif (suboptimal).
 6 marks    Response more than half-right
           Code runs but solution is incorrect due to one semantic error e.g.
             error in conditionals.
           Any two parts of the solution correctly implemented.
             Correct implementation using included solution or similar but one
             syntax error (e.g. relational operators correctly identified and
           combined using the logical and operator or similar).
 4 marks    Response about half-right
           Attempted use of conditional statement and relational operators
              (correctly identified) or similar.
 2 marks    Response with some merit
            Value of the score changed correctly.





                                                                        22

<!-- PAGE 23 -->
# Page 23

![Page 23](../../../image_assets/marking_schemes/higher/computer_science_higher_2020_paper_1_marking_scheme_page_023.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(b)                                                        30 (5, 5, 5, 10, 5) marks

Possible solution (note 3 options for function definition):
 1    # Question 16(b)
 2    # Examination Number:
 3
 4    # A variable to store all the lower case letters in the alphabet
 5    LOWER_CASE_LETTERS = "abcdefghijklmnopqrstuvwxyz"
 6
 7    # Ans (iv)
 8    def is_strong(password):
 9        return (calculate_score(password) == 11)
 10
 11  # Ans (iv) - version 1
 12  def is_strong_v1(password):
 13      strong = False
 14
 15      if calculate_score(password) == 11:
 16          strong = True
 17
 18      return strong
 19
 20  # Ans (iv) - version 2
 21  def is_strong_v2(password):
 22      strong = False
 23
 24      lowercase = False # True if password contains a lowercase letter
 25      uppercase = False # True if password contains an uppercase letter
 26
 27       # Loop through each character in the password and ...
 28       # ...check the password for specific characters
 29      for character in password:
 30        if character in LOWER_CASE_LETTERS:
 31          lowercase = True
 32        if character in "ABCDEFGHIJKLMNOPQRSTUVWXYZ":
 33          uppercase = True
 34
 35      if len(password) > 7 and lowercase and uppercase:
 36          strong = True
 37
 38      return strong
 39
 40  def calculate_score(password):
 41
 42       # The variables lowercase and uppercase indicate the presence of ...
 43       # ... lowercase and uppercase characters in the password
 44      lowercase = False # True if password contains at least 1 lowercase
      letter


                                                                             23

<!-- PAGE 24 -->
# Page 24

![Page 24](../../../image_assets/marking_schemes/higher/computer_science_higher_2020_paper_1_marking_scheme_page_024.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

45      uppercase = False # True if password contains at least 1 uppercase
     letter
46
47       # Loop through each character in the password and ...
48       # ... check the password for specific characters
49      for character in password:
50        if character in LOWER_CASE_LETTERS:
51          lowercase = True
52        if character in "ABCDEFGHIJKLMNOPQRSTUVWXYZ":
53          uppercase = True
54
55       # Calculate the score based on the rules
56
57      score = 0
58
59       # Rule 1
60      if len(password) > 7:
61          score = score + 5
62
63       # Rule 2
64      if lowercase:
65          score = score + 1
66
67       # Rule 3
68      if lowercase and uppercase:
69          score = score + 5
70
71
72      return score
73
74  # Test driver ...
75  test_passwords = ["sun", "Sun", "Sunshine", "12345", "123456789"]
76  test_passwords[4] = "Moonlight" # Ans (ii)
77
78  print("Score\tPassword") # Ans (i)
79  print("-----\t--------") # Ans (i)
80  lowest_score = 999 # Ans (iii)
81  weakest_password = "" # Ans (iii)
82  for password in test_passwords:
83      pass_score = calculate_score(password)
84      if pass_score < lowest_score: # Ans (iii)
85          lowest_score = pass_score # Ans (iii)
86          weakest_password = password # Ans (iii)
87      print(pass_score, "\t", password) # Ans (i)
88
89  print()# Ans (iii)
90  print("The weakest password is:", weakest_password) # Ans (iii)
91  print("Score:", lowest_score) # Ans (iii)



                                                                            24

<!-- PAGE 25 -->
# Page 25

![Page 25](../../../image_assets/marking_schemes/higher/computer_science_higher_2020_paper_1_marking_scheme_page_025.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

92
 93  # Ans (v)
 94  # Modify the program so that it calls the function is_strong for each
      password in the list, test_passwords, and
 95  # ... displays the password if it is strong
 96  print()
 97  print("The strong passwords are:")
 98  for password in test_passwords:
 99      if is_strong(password):
 100         print(password)
 101


(i)                                                             5 marks (B-5 scale)

      5 marks    Correct response
                  Correct implementation using included solution or similar.
      4 marks    Almost correct response
                  Correct design of solution evident but syntax/semantic error in
                  implementation.
                  Correct implementation but display incorrect (e.g. did not use \t).
      3 marks    Response about half-right
                  Correct use of only one print statement or similar.
                   Variables are displayed on separate lines.
      2 marks    Response with some merit
                Attempt at using print statement or similar.



(ii)                                                             5 marks (B-5 scale)

      5 marks     Correct response
                   Correct implementation using included solution or similar.
      4 marks    Almost correct response
                   Correct design of solution evident but syntax/semantic error in
                  implementation.
                 Changes the wrong password (e.g. index 5) or similar.
      3 marks    Response about half-right
               Good attempt at changing the password.
      2 marks    Response with some merit
                 Hard-coded change of the password in the list.





                                                                             25

<!-- PAGE 26 -->
# Page 26

![Page 26](../../../image_assets/marking_schemes/higher/computer_science_higher_2020_paper_1_marking_scheme_page_026.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(iii)                                                            5 marks (B-5 scale)

   5 marks   Correct response
               Correct implementation using included solution or similar.
   4 marks   Almost correct response
               Correct design of solution evident but syntax/semantic error in implementation.
              Evidence of attempt to use loop to find the weakest password.
   3 marks   Response about half-right
             Program runs but incorrect implementation – identifies the wrong password but
              has used variables and conditional statement.
   2 marks   Response with some merit
             Not working but creates variable(s) and uses conditional statement. Only uses
               conditional statement and does not store the password in a variable.
              Creates a variable to store the password but no conditional.
              Evidence of link between weakest password and the score.
             Hard-coded password displayed in the correct message.
             Attempt at sorting list of scores.



(iv)                                                           10 marks (C-10 scale)

    10 marks    Correct response
                  Correct implementation using included solution or similar.
    8 marks    Almost correct response
                  Correct design of solution evident but syntax/semantic error in
                 implementation.
    6 marks    Response more than half-right
                  Correct implementation of test for any two of length, lowercase and uppercase
                   inside the function definition.
                 Function returns Boolean value.
    4 marks    Response about half-right
                  Correct implementation of test for any one of length, lowercase and uppercase
                   inside the function definition.
    2 marks    Response with some merit
                Reasonable attempt at defining function (e.g. function header and body placed
                   at an appropriate location in the program).





                                                                             26

<!-- PAGE 27 -->
# Page 27

![Page 27](../../../image_assets/marking_schemes/higher/computer_science_higher_2020_paper_1_marking_scheme_page_027.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(v)                                                      5 marks (B-5 scale)

5 marks     Correct response
            Correct implementation using included solution or similar.
            Correct code but returns incorrect solution due incorrect function definition in
            previous question (no double penalty).
4 marks    Almost correct response
            Correct design of solution evident but syntax/semantic error in
            implementation.
3 marks    Response about half-right
            Correct solution but without using function calls or similar.
            Correct use of loop and conditional only or similar.
2 marks    Response with some merit
           Attempt at making function call (outside loop/conditional).
          Use of print statement.





                                                                         27

<!-- PAGE 28 -->
# Page 28

![Page 28](../../../image_assets/marking_schemes/higher/computer_science_higher_2020_paper_1_marking_scheme_page_028.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; text extraction is sparse relative to visible page content -->

28

# Source References

Exam paper:
- file: intermediate_markdown/exam_papers/higher/computer_science_higher_2020_section_c_exam.md
- pages: [3]

Marking scheme:
- file: intermediate_markdown/marking_schemes/higher/computer_science_higher_2020_paper_1_marking_scheme.md
- pages: [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28]

# Notes

