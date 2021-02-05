
## background
bg1 = mcwp.png

<!--
## button btn1
tpl = vnt-box vnt-text
rect = 200 320 180 60
text = New Start
click = start-new-game
-->

## image-button btn1
url = start-button.png
pos = 300 330
scale = 0.3 0.3
click = start-new-game

## button btn2
tpl = vnt-my-box vnt-my-text
rect = 880 320 180 60
text = Load Games
click = load-old-ones

### plot show-main-title no-wait no-save

# show-bg bg1

# show-btn btn1 btn2

# jump common-end

### plot load-old-ones

# show-form-load

# jump common-end

### plot start-new-game

# call scene1

### plot common-end no-save
