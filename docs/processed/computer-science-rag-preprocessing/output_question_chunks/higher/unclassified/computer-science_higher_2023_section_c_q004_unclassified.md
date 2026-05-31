---
subject: "Computer Science"
subject_id: "computer-science"
level: "Higher"
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
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2023_section_c_exam_page_005.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2023_section_c_exam_page_006.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2023_section_c_exam_page_007.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2023_section_c_exam_page_008.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2023_section_c_exam_page_009.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2023_section_c_exam_page_010.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2023_section_c_exam_page_011.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2023_section_c_exam_page_004.png"
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
  - 22
  - 23
  - 24
  - 25
  - 26
  - 27
pairing_confidence: "high"
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

     The program defines a function called guess_game which simulates a guessing
     game.

    When the function is called, the program generates a secret number between 1 and 5
      inclusive. This is stored in a variable called secret_number.

     The program then enters a loop in which the user is prompted to guess the number.
     The user’s guess is stored in the variable user_guess. Every time the user enters a
     guess the program increases the variable guess_count by one. If the user’s guess
     matches the computer’s secret number, the message ‘Congratulations! You win!’ is
      displayed. The loop continues until the user guesses the secret number.
 1  # Question 16(a)
 2  # Examination Number:
 3  from random import randint
 4
 5  def guess_game(max_guesses_allowed):
 6
 7      secret_number = randint(1, 5)
 8      guess_count = 0
 9      user_guess = 0
 10
 11     while (user_guess != secret_number):
 12
 13         user_guess = int(input("Enter your guess: "))
 14         guess_count += 1   #Increase guess_count by 1
 15         if user_guess == secret_number:
 16             print("Congratulations! You win!")
 17
 18 print("Welcome to the guessing game!")
 19 guess_game(3)
                                                   This question continues on the next page.



Leaving Certificate 2023
Computer Science, Section C – Higher level           4

<!-- PAGE 5 -->
# Page 5

![Page 5](../../../image_assets/exam_papers/higher/computer_science_higher_2023_section_c_exam_page_005.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

When the program is run, the output may look as follows.
     Your output may be different as the secret number is generated randomly.

    Welcome to the guessing game!
    Enter your guess: 2
    Enter your guess: 3
    Enter your guess: 1
    Congratulations! You win!



Make the following changes to the program:

(i)   Change the program to display an extra line of output when the user wins, showing
     the number of guesses taken.

    When the program is run the output may now look as follows:

    Welcome to the guessing game!
    Enter your guess: 2
    Enter your guess: 3
    Enter your guess: 1
    Congratulations! You win!
    You took 3 guesses.



(ii)  The program does not display a message unless the user guesses the secret number.

     Change the program so that it displays one of the following messages as a hint to the
      user:
      ‘Sorry! Your guess was too low’ or ‘Sorry! Your guess was too high’

    When the program is run the output may now look as follows:

    Welcome to the guessing game!
    Enter your guess: 1
    Sorry! Your guess was too low
    Enter your guess: 5
    Sorry! Your guess was too high
    Enter your guess: 3
    Sorry! Your guess was too low
    Enter your guess: 4
    Congratulations! You win!
    You took 4 guesses.





                                                   This question continues on the next page.



Leaving Certificate 2023
Computer Science, Section C – Higher level           5

<!-- PAGE 6 -->
# Page 6

![Page 6](../../../image_assets/exam_papers/higher/computer_science_higher_2023_section_c_exam_page_006.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(iii)  Currently the program has no way of ending unless the user guesses the secret
     number.
     Change the program so that it does not allow the user more than three guesses. This is
     the value currently being passed into the function.

      Hint: You will need to change the loop so that it continues as long as the user’s guess
        is not equal to the secret number and the number of guesses is less than
    max_guesses_allowed.

    When the program is run the output may now look as follows:

    Welcome to the guessing game!
    Enter your guess: 1
    Sorry! Your guess was too low
    Enter your guess: 5
    Sorry! Your guess was too high
    Enter your guess: 2
    Sorry! Your guess was too low


(iv)  Currently the number of guesses that the user is allowed is hard coded to three.

     Modify the program so that the user is presented with the prompt:

     Enter the maximum number of guesses allowed.

     Store the value entered as an integer and pass this value into the function
    guess_game.

    When the program is run the output may now look as follows:
    Welcome to the guessing game!
    Enter the maximum number of guesses allowed: 2
    Enter your guess: 1
    Sorry! Your guess was too low
    Enter your guess: 5
    Sorry! Your guess was too high


(v)   Currently the secret number is always between 1 and 5 inclusive.

     Modify the program so that it prompts the user to enter a difficulty level – ‘E’ for easy
     and ‘H’ for hard. If the user chooses ‘H’ the secret number should be between 1 and
     100 inclusive. A value of anything other than ‘H’ can be interpreted as easy.

    When the program is run the output may now look as follows:
    Welcome to the guessing game!
    Enter the maximum number of guesses allowed: 3
    Enter difficulty E(asy) or H(ard): H
    Enter your guess: 50
    Sorry! Your guess was too low
    Enter your guess: 75
    Sorry! Your guess was too low
    Enter your guess: 95
    Sorry! Your guess was too low

Leaving Certificate 2023
Computer Science, Section C – Higher level           6

<!-- PAGE 7 -->
# Page 7

![Page 7](../../../image_assets/exam_papers/higher/computer_science_higher_2023_section_c_exam_page_007.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

This question continues on the next page.

(vi)  Modify the code so that if the user guesses a number that was already guessed the
      following message is displayed: ‘You already guessed this number.’

    When the program is run the output may now look as follows:
     Welcome to the guessing game!
     Enter the maximum number of guesses allowed: 3
     Enter difficulty E(asy) or H(ard): E
     Enter your guess: 1
     Sorry! Your guess was too low
     Enter your guess: 1
     You already guessed this number.
     Sorry! Your guess was too low
     Enter your guess: 3
     Congratulations! You win!
     You took 3 guesses.



Save your file using the format ExaminationNumberQuestion16_A.py. For example, you
would save the file as 123456Question16_A.py if your Examination Number was 123456.





                                                   This question continues on the next page.




Leaving Certificate 2023
Computer Science, Section C – Higher level           7

<!-- PAGE 8 -->
# Page 8

![Page 8](../../../image_assets/exam_papers/higher/computer_science_higher_2023_section_c_exam_page_008.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; text contains visual keywords -->

(b)  Open the program called Question16_B.py from your device. This file contains only
    two comments, on lines 1 and 2.

     Before adding any code, you should save your working copy of the file using the
     format ExaminationNumberQuestion16_B.py. For example, you would save the file as
     123456Question16_B.py if your Examination Number was 123456.

     Enter your Examination Number in the space provided on line 2 in your Python file.

     Implement a number guessing game in Python. The game requires the user to guess a
    random number between 1 and 100 and they are awarded points based on how close
     they get to the number.

     You should use comments throughout your program to explain your code. You may
     wish to reuse some of the code you used in part (a) as part of your solution.

     The game should proceed according to the following sequence:

         The user’s score is set to zero.
         At the start of every new round the computer generates a random number
         between 1 and 100. This is the secret number that the user is trying to guess.
         The user is then prompted to enter a guess as shown below.

        Enter your guess:

          Calculate the difference between the secret number and the user guess.
         The numbers are then displayed in a meaningful message on a single line as
         shown below.

        Secret number is 55. You guessed 50. Difference is 5.


         The numbers are compared and the score is updated according the following
             rules:
         o   If the user’s guess and the secret number are the same then the score is
               increased by 100 and the message "JACKPOT!!! You score 100 points" is
                displayed.
         o   If the user’s guess is within 20 (either side) of the secret number the user’s
               score is increased by 20 and the message "You score 20 points" is displayed.
         o   If the user’s guess is more than 30 away from the secret number the user’s
               score is decreased by 30 and the message "You lose 30 points" is displayed.
         At the end of each round the score is displayed and user is prompted with the
         message “Play again? (Y/N):”
         The game ends when the user enters anything other than the single letter ‘Y’.

    An example output is shown on the next page.

                                                            This question continues on the next page.




Leaving Certificate 2023
Computer Science, Section C – Higher level           8

<!-- PAGE 9 -->
# Page 9

![Page 9](../../../image_assets/exam_papers/higher/computer_science_higher_2023_section_c_exam_page_009.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

Example:

    Enter your guess: 35
    Secret number is 31. You guessed 35. Difference is 4.
    You score 20 points
    Your total score is: 20
    Play again? (Y/N): Y
    Enter your guess: 91
    Secret number is 6. You guessed 91. Difference is 85.
    You lose 30 points
    Your total score is: -10
    Play again? (Y/N): Y
    Enter your guess: 54
    Secret number is 54. You guessed 54. Difference is 0.
    JACKPOT!!! You score 100 points
    Your total score is: 90
    Play again? (Y/N): Y
    Enter your guess: 50
    Secret number is 28. You guessed 50. Difference is 22.
    Your total score is: 90
    Play again? (Y/N): N


Use the format CandidateNumberQuestion16_B.py to save your file. For example, you
would save the file as 123456Question16_B.py if your candidate number was 123456.





Leaving Certificate 2023
Computer Science, Section C – Higher level           9

<!-- PAGE 10 -->
# Page 10

![Page 10](../../../image_assets/exam_papers/higher/computer_science_higher_2023_section_c_exam_page_010.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

Space for rough work.

                              This page will not be reviewed by an examiner.





Leaving Certificate 2023
Computer Science, Section C – Higher level          10

<!-- PAGE 11 -->
# Page 11

![Page 11](../../../image_assets/exam_papers/higher/computer_science_higher_2023_section_c_exam_page_011.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

Space for rough work.

                              This page will not be reviewed by an examiner.





Leaving Certificate 2023
Computer Science, Section C – Higher level          11

<!-- PAGE 12 -->
# Page 12

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; page contains vector drawings; text contains visual keywords -->

Acknowledgements

   Images
   Image on page 4 generated by https://openai.com/dall-e-2/





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
WednesdayLeaving Certificate24 May2023
   Computer Science, Section C – Higher level          12Morning 11:30 – 12:30

# Marking Scheme

Question 16                                                     80 (50, 30) marks

(a)                                                 50 (10,10, 5, 5, 10, 10) marks
Possible solution:
1   # Question 16(a)
2   # Examination Number:
3   from random import randint
4
5   def guess_game(max_guesses_allowed):
6
7       # (v) - start
8       difficulty = input("Enter difficulty E(asy) or H(ard): ")
9       if difficulty.upper() == "H":
10          secret_number = randint(1, 100)
11      else:
12          secret_number = randint(1, 5)
13      # (v) - end
14      guess_count = 0
15      user_guess = 0
16      guesses = [] # (vi)
17
18      while (user_guess != secret_number) and (guess_count < max_guesses_allowed): #
    (iii)
19
20          user_guess = int(input("Enter your guess: "))
21          guess_count += 1
22
23          # (vi) - start
24          if user_guess in guesses:
25              print("You already guessed this number.")
26          guesses.append(user_guess)
27          # (vi) - end
28
29          if user_guess == secret_number:
30              print("Congratulations! You win!")
31              print("You took", guess_count, "guesses") # (i)
32          # (ii) - start
33          elif user_guess < secret_number:
34              print("Sorry! Your guess was too low")
35          else:
36              print("Sorry! Your guess was too high")
37          # (ii) - end
38
39  print("Welcome to the guessing game!")
40  # (iv) - start
41  num_guesses_allowed = int(input("Enter the maximum number of guesses allowed: "))
42  guess_game(num_guesses_allowed)
43  # (iv) - end





                                       22

<!-- PAGE 23 -->
# Page 23

![Page 23](../../../image_assets/marking_schemes/higher/computer_science_higher_2023_paper_1_marking_scheme_page_023.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(i)                                                           10 marks (B-10 scale)

 10 marks  Correct response
             Correct implementation using solution above or similar.

 7 marks   Almost correct response
             Correct implementation using solution above or similar but with minor syntax or
            semantic error.

 3 marks   Response with some merit
           Any other reasonable attempt.




(ii)                                                          10 marks (B-10 scale)


 10 marks  Correct response
             Correct implementation using solution above or similar.

 7 marks   Almost correct response
             Correct implementation using solution above or similar but with minor syntax or
            semantic error.
 3 marks   Response with some merit
           Any other reasonable attempt.




(iii)                                                          5 marks (B-5 scale)

 5 marks   Correct response
             Correct implementation using solution above or similar.

 3 marks   Almost correct response
             Correct implementation using solution above or similar but with minor syntax or
            semantic error.

 2 marks   Response with some merit
           Any other reasonable attempt.





                                       23

<!-- PAGE 24 -->
# Page 24

![Page 24](../../../image_assets/marking_schemes/higher/computer_science_higher_2023_paper_1_marking_scheme_page_024.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(iv)                                                          5 marks (B-5 scale)

 5 marks   Correct response
             Correct implementation using solution above or similar.

 3 marks   Almost correct response
             Correct implementation using solution above or similar but with minor syntax or
            semantic error.

 2 marks   Response with some merit
           Any other reasonable attempt.




(v)                                                          10 marks (C-10 scale)

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




(vi)                                                          10 marks (C-10 scale)

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





                                       24

<!-- PAGE 25 -->
# Page 25

![Page 25](../../../image_assets/marking_schemes/higher/computer_science_higher_2023_paper_1_marking_scheme_page_025.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(b)                                                                     30 marks
Possible solution:


1   # Question 16(b)
2   # Examination Number:
3
4   from random import randint
5
6   user_score = 0 # a variable to keep track of the user's score
7
8   # Keep looping until the break statement is executed ...
9   # ... this will happen when the does not wish to play another round
10  while True:
11
12      secret_number = randint(1, 100) # generate the secret number
13      user_guess = int(input("Enter your guess: ")) # get the user's guess
14
15      # calculate the absolute difference between the user's guess and the secret
    number
16      difference = abs(user_guess-secret_number)
17      print("Secret number is %d. You guessed %d. Difference is %d" %(secret_number,
    user_guess, difference))
18
19      # Calculate the score based on how close the user's guess is to the secret
    number ...
20      # ... the closer the guess the more points the user/player gets
21      if user_guess == secret_number: # both numbers are the same ...
22          user_score += 100 # ... increase the score by 100 and ...
23          print("JACKPOT!!! You score 100 points") # ... tell the user
24      elif difference < 20: # if the difference is less than 20 ...
25          user_score += 20  # ... increase the score by 20 and ...
26          print("You score 20 points") # ... tell the user
27      elif difference > 30: # if the difference is more than 30 ...
28          user_score -= 30 # ... decrease the score by 30 and ...
29          print("Your lose 30 points")  # ... tell the user
30
31      # display a message with the total score at the end of each round
32      print("Your total score is:", user_score)
33
34      play_again = input("Play again? (y/n): ") # prompt the user to play again
35      if play_again.lower() != "y":
36          break
37





                                       25

<!-- PAGE 26 -->
# Page 26

![Page 26](../../../image_assets/marking_schemes/higher/computer_science_higher_2023_paper_1_marking_scheme_page_026.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

High level of achievement     Moderate level of           Low level of achievement
                      All of the following            achievement                 Poor attempt to complete any
                implemented correctly and     Reasonable attempt to          of the following
                      efficiently                   implement at least two of
                                             each of the following
                   Program executes            Program executes            Program executes
                        correctly with no syntax or       correctly with no syntax or       correctly with no syntax or
                    runtime errors                runtime errors                runtime errors
                   Program meets              Program meets              Program meets
Programming
                     requirements                 requirements                  requirements
Standards
                   Program design is well        Program design is well        Program design is well
(5 marks)
                      explained with comments       explained with comments       explained with comments
                    Meaningful                   Meaningful                   Meaningful
                       variable/function names         variable/function names         variable/function names
                    (5 marks)                        (4 marks)                        (3 marks)
                   Computer correctly           Computer correctly           Computer correctly
                     generates random number      generates random number      generates random number
                   between 1 and 100           between 1 and 100           between 1 and 100
                    User correctly prompted       User correctly prompted to     User correctly prompted
                      to enter guess                 enter guess                     to enter guess
Program Inputs
                    User correctly prompted       User correctly prompted to     User correctly prompted
(5 marks)
                      to play again                    play again                      to play again
                    Variable initialisation and      Variable initialisation and       Variable initialisation and
                    use of assignment             use of assignment             use of assignment
                     statements                   statements                    statements
                    (5 marks)                        (4 marks)                        (3 marks)
                   Game loop / “Play again”      Game loop / “Play again”      Game loop / “Play again”
                         logic                               logic                               logic
Program Logic
                    Logic to determine score       Logic to determine score       Logic to determine score
(Processing)
                  on each round              on each round               on each round
                    Total scores correctly          Total scores correctly          Total scores correctly
(10 marks)
                       calculated                      calculated                       calculated
                  (10 marks)                       (7 marks)                        (5 marks)
                   Message to display secret     Message to display secret     Message to display secret
                   number, user’s guess and      number, user’s guess and      number, user’s guess and
                       difference                      difference                       difference
Program           Message to display the       Message to display the        Message to display the
Outputs            outcome of the round         outcome of the round         outcome of the round
(10 marks)          Message to display total      Message to display total       Message to display total
                      score at the end of each        score at the end of each         score at the end of each
                   round                       round                       round
                  (10 marks)                       (7 marks)                         (5 marks)





                                          26

<!-- PAGE 27 -->
# Page 27

![Page 27](../../../image_assets/marking_schemes/higher/computer_science_higher_2023_paper_1_marking_scheme_page_027.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; text contains visual keywords -->

Coursework (90 marks in total)

# Source References

Exam paper:
- file: intermediate_markdown/exam_papers/higher/computer_science_higher_2023_section_c_exam.md
- pages: [4, 5, 6, 7, 8, 9, 10, 11, 12]

Marking scheme:
- file: intermediate_markdown/marking_schemes/higher/computer_science_higher_2023_paper_1_marking_scheme.md
- pages: [22, 23, 24, 25, 26, 27]

# Notes

