---
subject: "Computer Science"
subject_id: "computer-science"
level: "Higher"
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
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2021_section_c_exam_page_004.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2021_section_c_exam_page_005.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2021_section_c_exam_page_006.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2021_section_c_exam_page_007.png"
  - "../../../image_assets/exam_papers/higher/computer_science_higher_2021_section_c_exam_page_003.png"
source_exam_pages:
  - 3
  - 4
  - 5
  - 6
  - 7
  - 8
source_marking_scheme_pages:
  - 23
  - 24
  - 25
  - 26
  - 27
  - 28
  - 29
  - 30
  - 31
  - 32
pairing_confidence: "high"
needs_review: false
review_reason: ""
---

# Question

Question 16

(a)  Open the program called Question16_A.py from your device. The source code is shown below.

     Before making any changes, you should save your working copy of the file using the format
     CandidateNumberQuestion16_A.py. For example, you would save the file as
     123456Question16_A.py if your candidate number was 123456.

     Enter your Examination Number in the space provided on line 2 in your Python file.

     The Python program shown below tests whether the strings stored in the variables word1
     and word2 are anagrams of each other and displays YES if they are.

    Two words are anagrams of each other if they both use exactly the same letters. For
     example, the words LISTEN and SILENT are anagrams of one another. ELVIS and LIVES are
      also anagrams.

     The function definition is_anagram(w1, w2) determines whether or not two words are
     anagrams of one another and will not be used until part (v).

     1  # Question 16(a)
     2  # Examination Number:
     3
     4  # function definition used in part (v)
     5  def is_anagram(w1, w2):
     6      if sorted(w1) == sorted(w2):
     7          return True
     8      else:
     9          return False
     10
     11 word1 = input("Enter the first word: ")
     12 word2 = "SILENT"
     13
     14 # test whether the sorted strings are the same as each other
     15 # if the sorted strings are the same then they must be anagrams
     16 if (sorted(word1) == sorted(word2)):
     17     print("YES")

    When the program is run, the user is prompted to enter a word. If the user enters the word
     LISTEN (in uppercase) the output should look as follows because LISTEN and SILENT are
     anagrams of each other.

    Enter the first word: LISTEN
    YES





Leaving Certificate 2021
Computer Science, Section C – Higher level           3

<!-- PAGE 4 -->
# Page 4

![Page 4](../../../image_assets/exam_papers/higher/computer_science_higher_2021_section_c_exam_page_004.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

Make the following changes to the program:

        (i)    Currently the value of the variable word2 is hard‐coded to SILENT. Modify the
         program so that it prompts the user to ‘Enter the second word:’, and then assign
          whatever value the user enters to the variable word2.

        When the program is run the output may look as follows:

        Enter the first word: LISTEN
        Enter the second word: SILENT
        YES


        (ii)    If both words entered are anagrams the program should display the first word
           followed by the phrase ‘is an anagram of' and then the second word.

        When the program is run the output may look as follows:

        Enter the first word: LISTEN
        Enter the second word: SILENT
        LISTEN is an anagram of SILENT


         (iii)  Extend the program so that if the words entered are not anagrams of each other the
         program displays the first word followed by the phrase ‘is NOT an anagram of' and
          then the second word.

        When the program is run the output may look as follows:

        Enter the first word: LIST
        Enter the second word: ARRAY
        LIST is NOT an anagram of ARRAY


       (iv)  The program currently treats words as case‐sensitive. Modify the program so that the
           case of the words entered does not matter.

        When the program is run the output may look as follows:

        Enter the first word: Listen
        Enter the second word: Silent
        Listen is an anagram of Silent

      (v)   Extend the program to use the function is_anagram to determine whether or not
          the two words entered are anagrams of each other. You should not delete any code
         you wrote in previous parts. The program will now check twice if the words are
          anagrams of each other.

        When the program is run the output may look as follows:

        Enter the first word: Listen
        Enter the second word: Silent
        Listen is an anagram of Silent
        Listen is an anagram of Silent





Leaving Certificate 2021
Computer Science, Section C – Higher level           4

<!-- PAGE 5 -->
# Page 5

![Page 5](../../../image_assets/exam_papers/higher/computer_science_higher_2021_section_c_exam_page_005.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; text contains visual keywords -->

(vi)  Anagrams of words can also be phrases. For example, Moon starer is an anagram of
          Astronomer, and Voices rant on is an anagram of the two words, Conversation and
           Conservation. Note that the spaces in the phrases are ignored.

          Extend the program so that it prompts the user to ‘Enter a phrase:’. The program
          should display two additional messages to say whether or not word1 is an anagram of
          the phrase and, whether or not word2 is an anagram of the phrase.

        Some example outputs are shown below. You could use this data to test your program.


        Enter the first word: Listen
        Enter the second word: Silent
        Listen is an anagram of Silent
        Listen is an anagram of Silent

        Enter a phrase: Silence of the lambs
        Listen is NOT an anagram of Silence of the lambs
        Silent is NOT an anagram of Silence of the lambs


        Enter the first word: conversation
        Enter the second word: conservation
        conversation is an anagram of conservation
        conversation is an anagram of conservation

        Enter a phrase: voices rant on
        conversation is an anagram of voices rant on
        conservation is an anagram of voices rant on


        Enter the first word: Astronomer
        Enter the second word: Moon
        Astronomer is NOT an anagram of Moon
        Astronomer is NOT an anagram of Moon

        Enter a phrase: moon starer
        Astronomer is an anagram of moonstarer
        Moon is NOT an anagram of moon starer


Save your file using the format CandidateNumberQuestion16_A.py. For example, you would save
the file as 123456Question16_A.py if your candidate number was 123456.





Leaving Certificate 2021
Computer Science, Section C – Higher level           5

<!-- PAGE 6 -->
# Page 6

![Page 6](../../../image_assets/exam_papers/higher/computer_science_higher_2021_section_c_exam_page_006.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

Space for rough work.

                                  This page will not be reviewed by an examiner.





Leaving Certificate 2021
Computer Science, Section C – Higher level           6

<!-- PAGE 7 -->
# Page 7

![Page 7](../../../image_assets/exam_papers/higher/computer_science_higher_2021_section_c_exam_page_007.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

Space for rough work.

                                  This page will not be reviewed by an examiner.





Leaving Certificate 2021
Computer Science, Section C – Higher level           7

<!-- PAGE 8 -->
# Page 8

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images -->

Copyright notice
    This examination paper may contain text or images for which the State Examinations Commission is not the
    copyright owner, and which may have been adapted, for the purpose of assessment, without the authors’
    prior consent. This examination paper has been prepared in accordance with Section 53(5) of the Copyright
   and Related Rights Act, 2000. Any subsequent use for a purpose other than the intended purpose is not
    authorised. The Commission does not accept liability for any infringement of third‐party rights arising from
   unauthorised distribution or use of this examination paper.





Leaving Certificate – Higher Level
Computer Science – Section C
Saturday 22 May
Morning 11:30 – 12:30

# Marking Scheme

Question 16

(a)                                                 50 (5, 5, 5, 10, 10, 15) marks
Possible solution:
 1  # Question 16(a)
 2  # Examination Number:
 3
 4  # function definition used in part (v)
 5  def is_anagram(w1, w2):
 6      if sorted(w1) == sorted(w2):
 7          return True
 8      else:
 9          return False
 10
 11 word1 = input("Enter the first word: ")
 12 word2 = input("Enter the second word: ") # Solution (i)
 13
 14 # test whether the sorted strings are the same as each other
 15 # if the sorted strings are the same then they must be anagrams
 16 if (sorted(word1.upper()) == sorted(word2.upper())): # (iv)
 17     print(word1, "is an anagram of", word2) # (ii)
 18 else:
 19     print(word1, "is NOT an anagram of", word2) # (iii)
 20
 21 # (v)
 22 if (is_anagram(word1.upper(), word2.upper())):
 23     print(word1, "is an anagram of", word2)
 24 else:
 25     print(word1, "is NOT an anagram of", word2)
 26
 27
 28 # Part (vi)
 29 phrase = input("Enter a phrase: ")
 30 phrase_no_spaces = phrase.replace(" ", "")
 31 if (is_anagram(word1.upper(), phrase_no_spaces.upper())):
 32     print(word1, "is an anagram of", phrase)
 33 else:
 34     print(word1, "is NOT an anagram of", phrase)
 35
 36 if (is_anagram(word2.upper(), phrase_no_spaces.upper())):
 37     print(word2, "is an anagram of", phrase)
 38 else:
 39     print(word2, "is NOT an anagram of", phrase)




                                      23

<!-- PAGE 24 -->
# Page 24

![Page 24](../../../image_assets/marking_schemes/higher/computer_science_higher_2021_paper_1_marking_scheme_page_024.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(i)                                                           5 marks (A-5 scale)

      5 marks      Correct response
                    Correct implementation using solution above or similar.
      3 marks     Almost correct response
                    Correct implementation using solution above or similar but with syntax
                       error.
                  Attempted use of input function in an assignment statement
                  Minor error in string.
      2 marks     Response with some merit
                 Any other reasonable attempt.



(ii)                                                          5 marks (A-5 scale)

      5 marks      Correct response
                    Correct implementation using solution above or similar.
      3 marks     Almost correct response
                    Correct implementation using solution above or similar but with syntax
                       error.
                  Attempted use of print function with both variables (word1 and
                 word2).
                  Minor error in construction of string.
      2 marks     Response with some merit
                 Any other reasonable attempt.


(iii)                                                          5 marks (A-5 scale)

      5 marks      Correct response
                    Correct implementation using solution above or similar.
      3 marks     Almost correct response
                    Correct implementation using solution above or similar but with syntax
                     error (allow use of else, elif or a separate if statement).
                  Attempted use of print function with both variables (word1 and
                 word2).
                  Minor error in construction of string.
      2 marks     Response with some merit
                 Any other reasonable attempt.





                                      24

<!-- PAGE 25 -->
# Page 25

![Page 25](../../../image_assets/marking_schemes/higher/computer_science_higher_2021_paper_1_marking_scheme_page_025.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(iv)                                                          10 marks (B-10 scale)

      10 marks     Correct response
                    Correct implementation using solution above or similar.
      8 marks     Almost correct response
                    Correct implementation using solution above or similar but with syntax
                    or semantic error.
      5 marks     Response about half-right
                  Attempt to convert the case of either variable.
      3 marks     Response with some merit
                 Any other reasonable attempt.



(v)                                                          10 marks (B-10 scale)

      10 marks   Correct response
                  Correct implementation using solution above or similar (even if the
                  case is ignored).
      8 marks    Almost correct response
               Any 3 of:
                     •  A call to the function is_anagram
                     •  Passing in the correct arguments to is_anagram
                     •  Correct processing of return value
                     •  Display result.

      5 marks    Response about half-right
               Any 2 of:
                     •  A call to the function is_anagram
                     •  Passing in the correct arguments to is_anagram
                     •  Correct processing of return value
                     •  Display result.

      3 marks    Response with some merit
               Any other reasonable attempt.





                                      25

<!-- PAGE 26 -->
# Page 26

![Page 26](../../../image_assets/marking_schemes/higher/computer_science_higher_2021_paper_1_marking_scheme_page_026.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(vi)                                                          15 marks (B-15 scale)

      15 marks   Correct response
                  Correct implementation using solution above or similar.
      10 marks   Almost correct response
               Any 3 of:
                     •  Phrase correctly read
                     •  Spaces removed
                     •  Processing for word1 anagram of phrase
                     •  Processing for word2 anagram of phrase.
      5 marks    Response about half-right
               Any 2 of:
                     •  Phrase correctly read
                     •  Spaces removed
                     •  Processing for word1 anagram of phrase
                     •  Processing for word2 anagram of phrase.
      2 marks    Response with some merit
               Any other reasonable attempt.





                                      26

<!-- PAGE 27 -->
# Page 27

![Page 27](../../../image_assets/marking_schemes/higher/computer_science_higher_2021_paper_1_marking_scheme_page_027.png)

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
                 You must also include references and/or a bibliography.References                                                                  0
Summary word count
                     Include a summary of the word count of the report, including theSummary word
                       total word count.                                           0count





                                      27

<!-- PAGE 28 -->
# Page 28

![Page 28](../../../image_assets/marking_schemes/higher/computer_science_higher_2021_paper_1_marking_scheme_page_028.png)

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
•    If the reference mark is at least 27 but less than 54, then add 36 to the reference mark
   to get the final mark.
•    If the reference is at least 1 but less than 27, then double the reference mark and add
   9 to get the final mark.
•    If the reference mark is 0 the final mark is 0.
      Reference Mark                            Conversion
        54 or more                         Award 90 marks
          27 – 53                           Add 36 marks
          1 - 26                  Multiply the reference mark by 2 and add 9 marks
            0                                    0





                                      28

<!-- PAGE 29 -->
# Page 29

![Page 29](../../../image_assets/marking_schemes/higher/computer_science_higher_2021_paper_1_marking_scheme_page_029.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; text extraction is sparse relative to visible page content -->

BLANK PAGE





                    29

<!-- PAGE 30 -->
# Page 30

![Page 30](../../../image_assets/marking_schemes/higher/computer_science_higher_2021_paper_1_marking_scheme_page_030.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; text extraction is sparse relative to visible page content -->

BLANK PAGE





                    30

<!-- PAGE 31 -->
# Page 31

![Page 31](../../../image_assets/marking_schemes/higher/computer_science_higher_2021_paper_1_marking_scheme_page_031.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; text extraction is sparse relative to visible page content -->

BLANK PAGE





                    31

<!-- PAGE 32 -->
# Page 32

![Page 32](../../../image_assets/marking_schemes/higher/computer_science_higher_2021_paper_1_marking_scheme_page_032.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings; text extraction is sparse relative to visible page content -->

32

# Source References

Exam paper:
- file: intermediate_markdown/exam_papers/higher/computer_science_higher_2021_section_c_exam.md
- pages: [3, 4, 5, 6, 7, 8]

Marking scheme:
- file: intermediate_markdown/marking_schemes/higher/computer_science_higher_2021_paper_1_marking_scheme.md
- pages: [23, 24, 25, 26, 27, 28, 29, 30, 31, 32]

# Notes

