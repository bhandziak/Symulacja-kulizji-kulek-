Napotkane problemy:
- podczas tworzenia kulek, niektóre z nich blokowały się 
 -> przed wygenerowaniem kulek program sprawdza, czyli kulki ze sobą nie kolidują

- początkowo samą kolizję kulek wykonałem poprzez odbicie wektorów Velocity X i Y dwóch kul,
ale kulki często się blokowały i wyglądało to nienaturalnie
 -> wykorzystałem wzory fizyczne dotyczące kolizji obiektów

- zastosowałem odbicie wektorów, gdy kulka uderzyła ścianę, ale wyglądało to nienaturalnie
 -> zaimplementowałem funkcję liczącą kąt odbicia

- czasem wektor kulki po odbiciu od ściany miał zły zwrot
 -> skorygowałem to zmieniając zwrot wektora w odpowiednich ćwiartkach mapy

 - kulki często blokowały się w skrajnych (0, π/2, π, 3π/2) miejscach okręgu
  -> jeśli znajdują się tych miejscach to dodaje im prękość w przeciwną stronę

