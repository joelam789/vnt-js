
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

## macro
show-miki = # show-img miki1 160 520 from-left-right 60 400

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
[//]: # (# show-img miki1 160 320 from-left-right -190 300)
# run-macro show-miki

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

# hide-img miki1 to-left-right 60 400

?
So it's the end ... ?

?
Or still needs something more ... ?

... ...

### plot meet-again

# show-bg bg2

# run-macro show-miki

c1
你周末打算干什么去？

c2
我周末看看电视，然后就是去打球。

# change-img from miki1 to miki2

c1
我和你不一样，我就是听听音乐，或者看看书。你喜欢看书吗？

c2
我也看，只是看的不多。

c1
那你平时喜欢看哪些书呢？

c2
一些武侠小说呀，比如
《射雕英雄传》、《神雕侠侣》、
《书剑恩仇录》、《笑傲江湖》、
《七剑下天山》、《白发魔女传》。。。
还有一些科幻小说，比如
《八十天环游世界》、《时间机器》、
《科学怪人》、《太空漫游2001》、
《指环王》、《哈利波特》...... 等等

c1
那你读的书还真不少哟！

c2
嘿嘿，算半个小说迷吧

# hide-img miki2 to-left-right 60 400

?
那。。。不如今天就先这样。。。？！

(loop)

# jump first-meet
