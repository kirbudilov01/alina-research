# Review Language Synthesis V1

Generated: 2026-05-31T02:21:31.283Z

## Scope

Collected recent App Store RSS reviews for top intersection candidates from `data_processed/top_intersection_review_prefill.csv`.

## Coverage

- Apps requested: 100
- Apps with reviews: 78
- Deduplicated reviews: 2294
- Signal rows: 2288

## Rating Mix

- 5 star: 1473
- 4 star: 160
- 3 star: 137
- 2 star: 109
- 1 star: 415

## Signal Counts

- content_depth_request: 605
- pricing_complaint: 367
- loves_daily_loop: 347
- loves_avatar_progress: 300
- loves_emotional_support: 238
- quality_bug_complaint: 150
- churn_signal: 139
- trust_accuracy_complaint: 62
- privacy_safety_signal: 40
- loves_personalization: 40

## Interpretation

- Review language is now available as a first evidence layer beyond app metadata.
- Signals should be treated as keyword clusters, not final sentiment analysis.
- The next pass should manually inspect high-signal reviews for exact user wording around daily use, pricing, trust, and avatar/progress motivation.

## Sample Negative Reviews

- Shepherd: Spiritual Bible BFF (2 star): Love the app! Functionality not working properly - Love the app but it doesn’t seem like anyone is providing IT support or doing any updates. The last update December 2025. I have had issues and sent numerous emails and filled out a report via Notion Team but the Shepher
- Shepherd: Spiritual Bible BFF (2 star): The freakin phone number - I refuse to give my phone number to anyone or anything I got the app and wish to destroy it( from my account)
- Shepherd: Spiritual Bible BFF (2 star): Sad - I want to love this app but mine glitched out and won’t give my devotional anymore. If all the glitches were fixed it would be 5 stars.
- Shepherd: Spiritual Bible BFF (2 star): Glitches - It’s a very cute app but it started glitching on me after a few days. It won’t give me access to a global devotional and even if I do a custom devotional it will reset my streak. I hope this gets fixed.
- Shepherd: Spiritual Bible BFF (1 star): Grandkids - Will not load after every effort
- Shepherd: Spiritual Bible BFF (2 star): Great but there’s a lot of bugs - Whenever I log in, my poor sheep Noel loses hearts for literally no reason. She was just at 88 hearts but now she is at 22. Also, it won’t ever let me do the devotionals. It always has an error that says my WiFi is bad a
- Shepherd: Spiritual Bible BFF (2 star): I love it overall but - The bible part keep closing the entire app out when I try to go to it. I read all the way to Judges and it keep kicking me out the app when I go to the bible tab
- Shepherd: Spiritual Bible BFF (1 star): It was good - I really enjoyed this app until one Sunday I was at church and my pastor said something really interesting and it made me feel differently about this app. He was talking about how AI isn’t real and can be considered a de
- Pitstop: Scale Human Potential (1 star): Boring - Have you ever been bored within 2 minutes of using an app? I have. This is the type of app that was likely started by an investment banker who has a little extra coin in his pocket and is trying to build the “next big ap
- ModernSam: LVL up your life (2 star): Still a Work in Progress - It’s a good concept and there are things I really like, but overall there’s just too much still missing. Pros: + Daily side quests are a great way to add new goals and get some easy wins to build momentum. + Short, fanta
- ModernSam: LVL up your life (2 star): I don’t get it - Maybe I am not the right audience for this app, but I don’t get it. I don’t understand what the story has to do with the rest of it, and I don’t understand the reward system. You complete quests and tasks to earn stuff s
- Muna: Astrology & Horoscope (1 star): Does not change - I just signed up and when it asks for your birthday it does not let me change the date. It stays on today’s date. My birthday is in December not October. Looks like I take this off my phone.

## Sample Positive Reviews

- Shepherd: Spiritual Bible BFF (5 star): Very awesome sauce - This is really good for my spiritual growth (especially since i can literally NEVER understand what the bible tryna say to me 😭) but i wanna be able to pet my lamb :(((
- Shepherd: Spiritual Bible BFF (5 star): The best app ever - I love it so much it helps me get closer to God a lot more then just going to to my Christian church
- Shepherd: Spiritual Bible BFF (5 star): Best - It is really helping me become a better person and closer to the lord
- Shepherd: Spiritual Bible BFF (5 star): Best Christian App - Literally the funnest way to continue your journey with God! I got it because my friend told me about it, and when I started going on it more, I feel so much more connected to God and I feel my journey has been able to f
- Shepherd: Spiritual Bible BFF (5 star): Great 5 stars - Really good helped me learn about the gospel and talk with god in a fun way so that even kids could do it
- Shepherd: Spiritual Bible BFF (5 star): Cute game! - I really wanted to work on becoming a devoted Catholic. This is really helping me. I just got it really recently and I really felt like leaving this because it’s really helpful. The only thing I would change is the fact 
- Shepherd: Spiritual Bible BFF (5 star): Very nice - I like this app because it reminds me to pray everyday and stay focused and faithful.
- Shepherd: Spiritual Bible BFF (5 star): Shepherd Recommendations - I absolutely Love this app, It’s already helped me so much with my spiritual journey and I am obsessed. Here are a few recommendations to make the app more fun though! I think there should be little mini games or just ga
- Shepherd: Spiritual Bible BFF (5 star): Sarah🌷🌸🎀🩷🌺 - I love this app because it helps me connect with god😇😄😁😆☺️🙃🙂😊
- Shepherd: Spiritual Bible BFF (5 star): 不能注册 - 大陆手机号收不到验证码，也没有可以用邮箱注册的地方
- Shepherd: Spiritual Bible BFF (5 star): This app is broken - In all honesty I fell in love with this app, it’s been 3 days that I’ve not been able to do my daily devotions, it cost me heart’s gem’s. And I’ve had to buy Moses twice. I’ve tried seeing what it would take to contact t
- Shepherd: Spiritual Bible BFF (5 star): Closer to god!!!❤️ - Shepherd brought me closer to god immediately.I love how you get a prize for reading the bible and having your own lamb that you can customize is so fun.❤️❤️❤️

## Files

- `data_raw/app_store_top_candidate_reviews.csv`
- `data_processed/review_signal_matrix.csv`
