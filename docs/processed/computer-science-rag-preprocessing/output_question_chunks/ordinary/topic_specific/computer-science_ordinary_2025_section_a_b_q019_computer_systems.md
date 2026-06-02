---
subject: "Computer Science"
subject_id: "computer-science"
level: "Ordinary"
year: 2025
paper: "Section A B"
question_number: 19
section: "Question 14"
topic: "Computer Systems"
secondary_topics: []
classification_type: "topic_specific"
source_type: "past_paper_with_marking_scheme"
has_visual: true
visual_assets:
  - "../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2025_section_a_b_exam_page_014.png"
  - "../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2025_section_a_b_exam_page_015.png"
  - "../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2025_section_a_b_exam_page_016.png"
  - "../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2025_section_a_b_exam_page_013.png"
source_exam_pages:
  - "13"
  - "14"
  - "15"
  - "16"
source_marking_scheme_pages:
  - "13"
  - "14"
  - "15"
  - "16"
pairing_confidence: "high"
topic_confidence: "medium"
classification_source: "fallback_rules"
candidate_topics:
  - "Computer Systems"
  - "Data Representation"
needs_review: false
review_reason: ""
---


# Question

Question 14

A vending machine, such as that in Figure 6, has the following options available for users.


 Item code     Item name                  Price (€)


 A1            Water, flavoured            1.5


 A2           Water                      1.2


 B1           Oreos                      2.5


 C1              Crisps, Salt & Vinegar      2

                                                                            Figure 6
 C2              Crisps, Cheese & Onion     2


Customers deposit coins into the vending machine and input the two-character item code (for
example, A2 for water) for their desired selection. If the customer has deposited enough funds,
the vending machine dispenses the chosen item and returns any necessary change.


(a)  A section of the Python code for the vending machine program is shown below.
 1  if money >= price:
 2     dispenseItem
 3     giveChange(money - price)
 4  else:
 5     print("Error – not enough money inserted")

        (i)    Line 1 of the code has a conditional statement. Explain the purpose of this conditional
           statement.





        (ii)   State a suitable data type for the variable price.





                                                          This question continues on the next page.



Leaving Certificate 2025                       13
Computer Science, Sections A & B – Ordinary level

<!-- PAGE 14 -->
# Page 14

![Page 14](../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2025_section_a_b_exam_page_014.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; page contains vector drawings; text contains visual keywords -->

(b)  The vending machine needs to be tested before it is released.

        (i)   Describe a unit test that should take place for the vending machine.





        (ii)  The table below shows a test plan for the vending machine. Some of the entries have
         been left blank. Complete the test plan by filling in the correct information in the blank
           spaces.


      Code entered  Money inserted (€)   Expected result


      B1            3                  Oreos dispensed, €0.50 change given


                        1.2                Water dispensed, no change given


      C1                                     Error – not enough money inserted


      C2             0.75



      (iii)   Name and explain a stage of software testing, other than unit testing, that should take
          place to ensure the vending machine works as intended when it is released.

 Name:

  Explain:





Leaving Certificate 2025                       14
Computer Science, Sections A & B – Ordinary level

<!-- PAGE 15 -->
# Page 15

![Page 15](../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2025_section_a_b_exam_page_015.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; page contains vector drawings -->

(iv)    Describe two design features that could be incorporated into the vending machine to
        make it accessible to as many different types of users as possible.


  1.





  2.





(c)  When the user inserts the correct amount of money and enters the code of an item, the
     vending machine will perform a number of checks. Create an algorithm or flowchart to
      describe the process outlined in the following bullet points:
         The vending machine checks if there are any of that particular item available.
           If there are any items available, one is dispensed to the user.
           If there are no items available, the user is asked to enter another code.
           If there are less than three of that particular item remaining a message is sent to head
            office to order more stock for the vending machine.





Leaving Certificate 2025                       15
Computer Science, Sections A & B – Ordinary level

<!-- PAGE 16 -->
# Page 16

![Page 16](../../../image_assets/exam_papers/ordinary/computer_science_ordinary_2025_section_a_b_exam_page_016.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; page contains vector drawings; text contains visual keywords -->

# Marking Scheme

Question 14                                                   38 (6, 24, 8) marks

(a)                                                          6 (5, 1) marks

     (i)                                                        5 marks

     It is to check that the user has entered enough money to buy the selected item

            Good explanation – clear understanding demonstrated    5 marks
                 Fair description – limited understanding                3 marks




     (ii)                                                       1 mark

    float
                                  Correct  1 mark




(b)                                                      24 (4, 9, 3, 8) marks

      (i)                                                       4 marks

      Verify that selecting a specific snack (e.g., "A1") correctly identifies the item
     Check if the vending machine accepts and processes a specific amount of money (e.g.,
       €1.50) for a €1.50 snack.
     Check that the vending machine dispenses the correct change if too much money is
      entered
     Check that the card facility for payment is working
     Check that the vending machine doesn’t allow an item to be selected if it is sold out
     Check that the cancel button returns funds
            Any similar valid response

            Good description – clear understanding demonstrated    4 marks
                 Fair description – limited understanding                2 marks





Leaving Certificate 2025                       13
Computer Science – Ordinary Level
Marking Scheme

<!-- PAGE 14 -->
# Page 14

![Page 14](../../../image_assets/marking_schemes/ordinary/computer_science_ordinary_2025_paper_1_marking_scheme_page_014.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

(ii)                                                      9 (3, 3, 3) marks


           Code Entered    Money Inserted (€)  Expected Result

           B1              3                 Oreos served, €0.50 change given

          A2                1.2               Water served, no change given

           C1              <2                   Error – not enough money inserted

           C2                0.75                 Error – not enough money inserted


                         Each correct item     3 marks




    (iii)                                                        3 (1, 2) marks

       Functional Testing. Functional testing checks whether the software performs its
        intended functions correctly. For example, testing that the vending machine dispenses
        water when the correct amount of money is inserted and the code button is entered.
       Non-Functional Testing. Non-functional testing evaluates aspects like performance,
          usability, or reliability rather than specific behaviours. For example, testing how
         quickly the vending machine responds after the code is entered or how many users it
        can serve in an hour.
       System Testing. System testing involves evaluating the complete and integrated
        system to ensure it meets the specified requirements. For example, testing the vending
        machine as a whole- powering it on, selecting a product, paying, and receiving the item
             - to confirm everything works together seamlessly.
       User Acceptance Testing (UAT). This type of testing is done by the end users to verify
        the system meets their needs and is ready for real-world use. For example, a customer
          tests the vending machine in a real-world setting to confirm it operates as expected
       and is easy to use.
       Alpha testing. This the first round of testing done by the developers of the software,
         usually inside the company. The goal is to find bugs or problems before the software is
        shared with people outside the company. It helps make sure everything works as
         expected.
       Beta testing. This happens after alpha testing. It’s done by a group of real users outside
        the company who try the software in real-world situations. This helps catch any issues
         that the developers might have missed.
       Any other valid stage of software testing is acceptable

            Valid name                                      1 mark

         Good description – clear understanding demonstrated   2 marks
            Fair description – limited understanding               1 mark




Leaving Certificate 2025                       14
Computer Science – Ordinary Level
Marking Scheme

<!-- PAGE 15 -->
# Page 15

![Page 15](../../../image_assets/marking_schemes/ordinary/computer_science_ordinary_2025_paper_1_marking_scheme_page_015.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains embedded images; page contains vector drawings -->

(iv)                                                  8 (4, 4) marks
         Large Buttons: Easily readable buttons with high-contrast colours and tactile
          feedback can help users with visual impairments.
          Braille: Adding Braille next to each button and on product labels helps blind or low-
           vision users identify items and make selections.
         Audio: A voice-guided system could provide instructions, item names, and prices,
         which is helpful for visually impaired users.
         Height Position: A height-adjustable interface or lower panel allows both standing
          users and those in wheelchairs to access the machine comfortably.
         Touchscreen: A touchscreen interface with an accessibility mode that enlarges text,
         adds voice assistance, or reduces complexity for users with cognitive disabilities.
         Multi-Language Support: Providing instructions in multiple languages accommodates
          users who may not speak the primary language displayed on the machine.
         Any other valid design feature

           For each:
         Good description – clear understanding demonstrated   4 marks
            Fair description – limited understanding               2 marks


(c)                                                                     8 marks
             Pseudocode:                                  Flowchart:

 START

 User inserts money and enters item code

 IF stock is less than 1:
     Prompt user to enter another code
        IF stock is less than 3:
           (Dispense item)
          Send Email to head office
 ELSE: (stock must be 1 or more)
      Dispense item

 STOP





    Correctly deals with condition to check if any items available              3 marks OR
   Reasonable attempt at condition to check if any items available            2 marks

    Correctly deals with condition to send email where stock is less than 3      3 marks OR
   Reasonable attempt at condition to send email where stock is less than 3    2 marks

   Good overall coherence of flowchart/pseudocode                      2 marks OR
    Fair overall coherence of flowchart/pseudocode                        1 marks

Leaving Certificate 2025                       15
Computer Science – Ordinary Level
Marking Scheme

<!-- PAGE 16 -->
# Page 16

![Page 16](../../../image_assets/marking_schemes/ordinary/computer_science_ordinary_2025_paper_1_marking_scheme_page_016.png)

<!-- HAS_VISUAL: true -->
<!-- VISUAL_REASON: page contains vector drawings -->

# Source References

Exam paper:
- file: intermediate_markdown/exam_papers/ordinary/computer_science_ordinary_2025_section_a_b_exam.md
- pages: [13, 14, 15, 16]

Marking scheme:
- file: intermediate_markdown/marking_schemes/ordinary/computer_science_ordinary_2025_paper_1_marking_scheme.md
- pages: [13, 14, 15, 16]

# Notes

