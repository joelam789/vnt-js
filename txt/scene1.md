
## character
c1 =Cindy Lam
c2= Jason Brown
?=???

## background
bg1 = school_front_morning.jpg
bg2 = school_front_afternoon.jpg

## image
miki1 = Miki_Casual_PoseD_Smile.png 0.5 0.5
miki2 = Miki_PoseA_Casual_Smile.png 0.5 0.5

## music
bgm1 = easy-lemon.mp3

## voice
v1 = v-01.wav
v2 = v-02.wav

### plot first-meet

# show-bg bg1

# play-bgm bgm1

<!-- 
let's clean up the screen - 
hide all npc images and just show the background image only 
-->
# hide-img all

ready?

let's start ...

<!-- show the npc image from right side -->
[//]: # (# show-img miki1 480 320 from-left-right 820 200)
<!-- show the npc image from left side -->
# show-img miki1 160 320 from-left-right -190 300

c1
"Hello~"
# play-voice v1

c2
"How are you?"
# stop-voice

c1
"I'm good thank you."
# play-voice v2

c2
"That's great to hear."
# stop-voice

# hide-img miki1 to-left-right -190 300

?
So it's the end ... ?

?
Or still needs something more ... ?

... ...

### plot meet-again

# show-bg bg2

# show-img miki1 160 320 from-left-right -190 300

c1
你周末打算干什么去？

c2
我周末看看电视，然后就是去打球。

# change-img from miki1 to miki2

c1
我和你不一样，我就是听听音乐，或者看看书。你喜欢看书吗？

c2
"我也看，当时看的比较少。"

# hide-img miki2 to-left-right -190 300

?
好了，就先这样吧。。。

(loop)

# jump first-meet
