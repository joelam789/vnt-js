
## character
c1 =Cindy Lam
c2= Jason Brown
?=???

## background
bg1 = school_front_morning.jpg
bg2 = school_front_afternoon.jpg
bg3 = school_front_night.jpg

## image
miki1 = Miki_Casual_PoseD_Smile.png 0.5 0.5
miki2 = Miki_PoseA_Casual_Smile.png 0.5 0.5

## music
bgm1 = easy-lemon.mp3

## voice
v1 = v-01.wav
v2 = v-02.wav

## variable
times = 0

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

```js

    console.log("test 0");

    for (let i=1; i<=3; i++) {
        console.log("test ... " + i);
    }

    if (sprite) console.log("plot - " + sprite.name);

```

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


### plot night-talk

# show-bg bg3

<!-- # check-var (times > 0) q1 q2 -->

### plot q1

c1
Then guess what kind of books I like to read?

# jump try-to-guess

### plot q2

c1
Guess again!

### plot try-to-guess no-savepoint

## choice-and-branch a1 a2 a3 a4 a5
historical stories
science fictions
horror stories
fairy tales
comics

### plot a1

c1
No, not historical stories

# jump q2

### plot a2

c1
I like science fictions, but not very much

# jump q2

### plot a3

c1
I don't like horror stories

# jump q2

### plot a4

c1
When I was in elementary school, I liked reading fairy tales

# jump q2

### plot a5

c1
Bingo! I like comic books best!

# hide-img miki2 to-left-right 60 400

... ...

Okay, this is the ending... for now

(loop)

# jump first-meet
